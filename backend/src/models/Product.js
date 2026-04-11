import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    metalType: { type: String, required: true, trim: true },
    productCode: { type: String, required: true, trim: true, unique: true },
    sku: { type: String, trim: true, unique: true, sparse: true },
    weightChi: { type: Number, required: true, min: 0 },
    makingFee: { type: Number, required: true, min: 0, default: 0 },
    discountPercent: { type: Number, required: true, min: 0, max: 95, default: 0 },
    stock: { type: Number, required: true, min: 0, default: 0 },
    imageUrl: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    isNew: { type: Boolean, default: false },
}, {
    timestamps: true,
    suppressReservedKeysWarning: true,
});

const Product = new mongoose.model('Product', ProductSchema);
export default Product