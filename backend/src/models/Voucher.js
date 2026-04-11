import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    discountAmount: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
},{ timestamps: true });

const Voucher = mongoose.model('Voucher', VoucherSchema);
export default Voucher
