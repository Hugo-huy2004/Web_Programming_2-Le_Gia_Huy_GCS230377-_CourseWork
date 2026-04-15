import Order from '../models/Order.js';
import { verifyPaypalOrder, isPaypalVerificationConfigured } from '../services/paypalService.js';
import { sendError, sendSuccess } from '../lib/responseHelpers.js';
import { ORDER_STATUSES } from '../constants/statuses.js';

function toTrimmedText(value) {
    return String(value ?? "").trim();
}

function normalizeEmail(email) {
    return toTrimmedText(email).toLowerCase();
}

function toNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function isPaypalOrder(payload) {
    return payload?.paymentMethod === "paypal" && toTrimmedText(payload?.paypalOrderId).length > 0;
}

function extractPaypalAmounts(paypalOrder) {
    const candidates = [
        paypalOrder?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
        paypalOrder?.purchase_units?.[0]?.payments?.authorizations?.[0]?.amount?.value,
        paypalOrder?.purchase_units?.[0]?.amount?.value,
    ];

    const amounts = [];

    for (const candidate of candidates) {
        const parsed = toNumber(candidate, 0);
        if (parsed > 0) {
            amounts.push(parsed);
        }
    }

    return Array.from(new Set(amounts));
}

export const createOrder = async (req, res) => {
    try {
        const payload = req.body;

        if (payload?.paymentMethod !== "paypal") {
            return sendError(res, 400, "Only PayPal payment is allowed.");
        }

        if (!isPaypalOrder(payload)) {
            return sendError(res, 400, "PayPal order id is required.");
        }

        if (!isPaypalVerificationConfigured()) {
            return sendError(res, 500, "PayPal verification is not configured on server.");
        }

        const paypalOrder = await verifyPaypalOrder(payload.paypalOrderId);
        const paypalStatus = toTrimmedText(paypalOrder?.status).toUpperCase();
        if (paypalStatus !== "APPROVED" && paypalStatus !== "COMPLETED") {
            return sendError(res, 400, "PayPal order is not approved.");
        }

        const paypalAmounts = extractPaypalAmounts(paypalOrder);
        const expectedAmount = toNumber(payload?.total, 0);
        const matchedAmount = paypalAmounts.find((value) => Math.abs(value - expectedAmount) <= 0.05);

        if (!matchedAmount || !expectedAmount) {
            const paidSummary = paypalAmounts.length > 0
                ? paypalAmounts.map((value) => value.toFixed(2)).join(" / ")
                : "N/A";
            return sendError(
                res,
                400,
                `PayPal amount mismatch. Paid ${paidSummary} but order total is ${expectedAmount.toFixed(2)}.`
            );
        }

        const newRecord = await Order.create({ ...payload });

        return sendSuccess(res, 201, {
            message: 'Your piece has been registered for delivery!',
            order: newRecord
        });
    } catch (err) {
        console.error("Order Creation Failed:", err);
        return sendError(res, 500, 'Server could not process this order.');
    }
};

export const listOrders = async (req, res) => {
    try {
        const customerEmail = normalizeEmail(req.query?.customerEmail);
        const searchQuery = customerEmail ? { customerEmail } : {};

        const entries = await Order.find(searchQuery).sort({ createdAt: -1 });

        return sendSuccess(res, 200, { orders: entries });
    } catch (err) {
        console.error("Fetch Orders Failed:", err);
        return sendError(res, 500, 'Could not retrieve order history.');
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const orderId = toTrimmedText(req.params.id);
        const nextStatus = toTrimmedText(req.body?.status).toLowerCase();

        if (!ORDER_STATUSES.includes(nextStatus)) {
            return sendError(res, 400, 'Invalid status type');
        }

        const updatedDoc = await Order.findByIdAndUpdate(
            orderId,
            { status: nextStatus },
            { new: true }
        );

        if (!updatedDoc) {
            return sendError(res, 404, 'Order not found in vault.');
        }

        return sendSuccess(res, 200, { message: 'Logistics updated.', order: updatedDoc });
    } catch (err) {
        console.error("Update Failed:", err);
        return sendError(res, 500, 'Server failed to update status.');
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const idToRemove = toTrimmedText(req.params.id);
        const result = await Order.findByIdAndDelete(idToRemove);

        if (!result) {
            return sendError(res, 404, 'Record already missing.');
        }

        return sendSuccess(res, 200, { message: 'Record purged from database.' });
    } catch (err) {
        console.error("Deletion Failed:", err);
        return sendError(res, 500, 'Critical Error: Could not delete record.');
    }
};
