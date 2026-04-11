import Voucher from '../models/Voucher.js';

function toVoucherResponse(voucher) {
    return {
        _id: voucher._id,
        id: voucher._id,
        code: voucher.code,
        discountAmount: voucher.discountAmount,
        active: voucher.active,
        createdAt: voucher.createdAt,
    };
}

export const listVouchers = async (req, res) => {
    try {
        const vouchers = await Voucher.find().sort({ createdAt: -1 });

        return res.status(200).json({ ok: true, vouchers: vouchers.map(toVoucherResponse) });
    } catch (error) {
        console.error("Error listing vouchers:", error);
        return res.status(500).json({ ok: false, message: 'Failed to fetch vouchers' });
    }
};

export const createVoucher = async (req, res) => {
    try {
        const { code, discountAmount } = req.body || {};

        if (!code || discountAmount === undefined) {
            return res.status(400).json({ ok: false, message: 'Please provide voucher code and discount amount' });
        }

        const existing = await Voucher.findOne({ code: code.trim().toUpperCase() });
        if (existing) {
            return res.status(400).json({ ok: false, message: 'Voucher code already exists' });
        }

        const newVoucher = await Voucher.create({
            code: code.trim().toUpperCase(),
            discountAmount,
            active: true
        });

        return res.status(201).json({ 
            ok: true, 
            message: 'Voucher created successfully', 
            voucher: toVoucherResponse(newVoucher)
        });
    } catch (error) {
        console.error("Error creating voucher:", error);
        return res.status(500).json({ ok: false, message: 'Failed to create voucher' });
    }
};

export const toggleVoucherStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const voucher = await Voucher.findById(id);
        if (!voucher) {
            return res.status(404).json({ ok: false, message: 'Voucher not found' });
        }

        voucher.active = !voucher.active;
        await voucher.save();

        return res.status(200).json({ 
            ok: true, 
            message: `Voucher ${voucher.active ? 'activated' : 'deactivated'} successfully`, 
            voucher: toVoucherResponse(voucher)
        });
    } catch (error) {
        console.error("Error toggling voucher:", error);
        return res.status(500).json({ ok: false, message: 'Failed to toggle voucher status' });
    }
};

export const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;

        const voucher = await Voucher.findByIdAndDelete(id);
        if (!voucher) {
            return res.status(404).json({ ok: false, message: 'Voucher not found' });
        }

        return res.status(200).json({ 
            ok: true, 
            message: 'Voucher deleted successfully', 
            deletedId: id
        });
    } catch (error) {
        console.error("Error deleting voucher:", error);
        return res.status(500).json({ ok: false, message: 'Failed to delete voucher' });
    }
};
