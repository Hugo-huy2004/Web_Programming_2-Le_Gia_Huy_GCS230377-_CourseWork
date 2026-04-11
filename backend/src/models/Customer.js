import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true },
    birthday: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    loyaltyPoints: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    provider: {
        type: String,
        default: "google"
    },
    providerId: {
        type: String
    }
}, { timestamps: true })

const Customer = mongoose.model('Customer', CustomerSchema);
export default Customer