import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
    singletonKey: { type: String, required: true, unique: true, default: "default" },
    shipperFee: { type: Number, required: true, min: 0, default: 25 },
    dollarsPerPoint: { type: Number, required: true, min: 1, default: 100 },
    minimumPointsToRedeem: { type: Number, required: true, min: 1, default: 10 },
    pickupAddress: {
      type: String,
      required: true,
      trim: true,
      default: "20 Cong Hoa Garden, Tan Binh Ward, Ho Chi Minh City, Vietnam",
    },
},{ timestamps: true });
const Setting = mongoose.model('Setting', SettingSchema);
export default Setting
