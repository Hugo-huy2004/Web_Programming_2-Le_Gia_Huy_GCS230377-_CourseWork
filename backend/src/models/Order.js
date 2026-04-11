import mongoose from "mongoose";
import { ORDER_STATUSES } from "../constants/statuses.js";

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, trim: true },
    customerEmail: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: ORDER_STATUSES[0],
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingMethod: { type: String, enum: ["shipper", "pickup"], required: true },
    shippingFee: { type: Number, required: true, min: 0, default: 0 },
    shippingAddress: { type: String, default: "", trim: true },
    receiverName: { type: String, required: true, trim: true },
    receiverPhone: { type: String, required: true, trim: true },
    note: { type: String, default: "", trim: true },
    voucherCode: { type: String, default: null, trim: true },
    voucherDiscount: { type: Number, required: true, min: 0, default: 0 },
    pointsUsed: { type: Number, required: true, min: 0, default: 0 },
    pointsDiscount: { type: Number, required: true, min: 0, default: 0 },
    tax: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0.10 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ["paypal"], required: true },
    paymentStatus: { type: String, enum: ["paid"], default: "paid" },
    paypalOrderId: { type: String, required: true, trim: true },
    rewardPointsGranted: { type: Boolean, default: false },
    inventoryReserved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

orderSchema.index({ customerEmail: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order