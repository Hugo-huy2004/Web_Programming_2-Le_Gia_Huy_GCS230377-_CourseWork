import Customer from "../models/Customer.js";
import { verifyGoogleIdToken } from "../services/googleTokenService.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { sendError, sendSuccess } from "../lib/responseHelpers.js";

function normalizeEmail(email) {
    return String(email ?? "").trim().toLowerCase();
}

function safeNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function applyMetricDelta(currentValue, delta, options = {}) {
    const { min = 0, roundTo2 = false, truncate = false } = options;
    const safeDelta = safeNumber(delta, 0);

    let nextValue = safeNumber(currentValue, 0) + (truncate ? Math.trunc(safeDelta) : safeDelta);
    if (roundTo2) {
        nextValue = Number(nextValue.toFixed(2));
    }

    return Math.max(min, nextValue);
}

function toCustomerResponse(customer) {
    return {
        id: String(customer._id),
        email: customer.email,
        profile: {
            fullName: customer.fullName,
            birthday: customer.birthday,
            phone: customer.phone,
            address: customer.address,
        },
        loyaltyPoints: Number(customer.loyaltyPoints ?? 0),
        totalSpent: Number(customer.totalSpent ?? 0),
        totalOrders: Number(customer.totalOrders ?? 0),
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
    };
}

function parseProfile(payload) {
    return {
        fullName: String(payload?.fullName ?? "").trim(),
        birthday: String(payload?.birthday ?? "").trim(),
        phone: String(payload?.phone ?? "").trim(),
        address: String(payload?.address ?? "").trim(),
    };
}

function createCustomerAccessToken(customerId) {
    return jwt.sign(
        { id: String(customerId), role: "customer" },
        env.jwtSecret,
        { expiresIn: "7d" }
    );
}

export async function upsertGoogleCustomer(req, res) {
    try {
        const verified = await verifyGoogleIdToken(req.body?.idToken);
        const email = normalizeEmail(verified.email);
        const name = String(verified.name ?? "").trim();

        if (!email) {
            return sendError(res, 400, "Customer email is required");
        }

        const customer = await Customer.findOneAndUpdate(
            { email },
            {
                $set: {
                    provider: "google",
                    providerId: verified.providerId || undefined,
                },
                $setOnInsert: {
                    email,
                    fullName: name || "New Customer",
                    birthday: "",
                    phone: "",
                    address: "",
                    loyaltyPoints: 0,
                    totalSpent: 0,
                    totalOrders: 0,
                },
            },
            { new: true, upsert: true }
        );

        const accessToken = createCustomerAccessToken(customer._id);
        return sendSuccess(res, 200, {
            message: "Google login successful",
            customer: toCustomerResponse(customer),
            accessToken,
        });
    } catch (error) {
        const message = String(error?.message ?? "Google login failed");
        const lower = message.toLowerCase();
        const isAuthError = lower.includes("token") || lower.includes("google") || lower.includes("audience") || lower.includes("verified");
        return sendError(res, isAuthError ? 401 : 500, message);
    }
}

export async function getCustomerByEmail(req, res) {
    try {
        const email = normalizeEmail(req.params?.email);
        if (!email) {
            return sendError(res, 400, "Customer email is required");
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        return sendSuccess(res, 200, { customer: toCustomerResponse(customer) });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

export async function updateCustomerProfile(req, res) {
    try {
        const email = normalizeEmail(req.params?.email);
        const profile = parseProfile(req.body ?? {});

        if (!email) {
            return sendError(res, 400, "Customer email is required");
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        const hasAnyField = Boolean(
            profile.fullName || profile.birthday || profile.phone || profile.address
        );
        if (!hasAnyField) {
            return sendError(res, 400, "At least one profile field is required");
        }

        // Allow partial profile updates while preserving existing values for omitted fields.
        if (profile.fullName) customer.fullName = profile.fullName;
        if (profile.birthday) customer.birthday = profile.birthday;
        if (profile.phone) customer.phone = profile.phone;
        if (profile.address) customer.address = profile.address;
        await customer.save();

        return sendSuccess(res, 200, { message: "Profile updated", customer: toCustomerResponse(customer) });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

export async function adjustCustomerMetrics(req, res) {
    try {
        const email = normalizeEmail(req.params?.email);
        const pointsDelta = req.body?.pointsDelta ?? 0;
        const spentDelta = req.body?.spentDelta ?? 0;
        const ordersDelta = req.body?.ordersDelta ?? 0;

        if (!email) {
            return sendError(res, 400, "Customer email is required");
        }

        const customer = await Customer.findOne({ email });
        if (!customer) {
            return sendError(res, 404, "Customer not found");
        }

        customer.loyaltyPoints = applyMetricDelta(customer.loyaltyPoints, pointsDelta);
        customer.totalSpent = applyMetricDelta(customer.totalSpent, spentDelta, { roundTo2: true });
        customer.totalOrders = applyMetricDelta(customer.totalOrders, ordersDelta, { truncate: true });

        await customer.save();

        return sendSuccess(res, 200, { message: "Customer metrics updated", customer: toCustomerResponse(customer) });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}

export async function getAllCustomers(req, res) {
    try {
        const customers = await Customer.find().sort({ totalSpent: -1 });
        return sendSuccess(res, 200, {
            customers: customers.map((customer) => toCustomerResponse(customer))
        });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
}
