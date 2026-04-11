import Product from "../models/Product.js";
import { uploadImageBufferToCloudinary } from "../lib/cloudinaryStorage.js";
import { sendError, sendSuccess } from "../lib/responseHelpers.js";

function toFiniteNumber(value, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toNonNegativeInt(value) {
    return Math.max(0, Math.floor(toFiniteNumber(value, 0)));
}

function toDiscountPercent(value) {
    return Math.min(95, Math.max(0, toFiniteNumber(value, 0)));
}

function toBoolean(value) {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.trim().toLowerCase() === "true";
    return false;
}

function trimString(value) {
    return String(value ?? "").trim();
}

function createProductCode() {
    const suffix = Math.floor(100000 + Math.random() * 899999);
    return `HWJ-${suffix}`;
}

function createSku(productCode) {
    const base = trimString(productCode).toUpperCase();
    if (base) {
        return `SKU-${base}`;
    }

    return `SKU-${createProductCode()}`;
}

function normalizeProductPayload(payload) {
    const updateData = { ...payload };

    if (updateData.imageUrl !== undefined) {
        updateData.imageUrl = trimString(updateData.imageUrl);
    }
    if (updateData.weightChi !== undefined) {
        updateData.weightChi = toFiniteNumber(updateData.weightChi, 0);
    }
    if (updateData.makingFee !== undefined) {
        updateData.makingFee = toFiniteNumber(updateData.makingFee, 0);
    }
    if (updateData.stock !== undefined) {
        updateData.stock = toNonNegativeInt(updateData.stock);
    }
    if (updateData.discountPercent !== undefined) {
        updateData.discountPercent = toDiscountPercent(updateData.discountPercent);
    }
    if (updateData.isNew !== undefined) {
        updateData.isNew = toBoolean(updateData.isNew);
    }

    Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined) {
            delete updateData[key];
        }
    });

    return updateData;
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return sendSuccess(res, 200, { products });
    } catch (error) {
        console.error("Error fetching products", error);
        return sendError(res, 500, "Server error");
    }
}

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(res, 200, { product });
    } catch (error) {
        console.error("Error fetching product by ID", error);
        return sendError(res, 500, "Server error");
    }
}

async function uploadProductImage(file) {
    return uploadImageBufferToCloudinary({
        buffer: file.buffer,
        fileName: file.originalname,
    });
}

export const editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const updateData = normalizeProductPayload(req.body);

        if (req.file) {
            const uploaded = await uploadProductImage(req.file);
            updateData.imageUrl = uploaded.publicUrl;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            updateData,
            { new: true }
        );

        if (!updatedProduct) {
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(res, 200, { product: updatedProduct });

    } catch (error) {
        console.error("Error editing product", error);
        return sendError(res, 500, "Server error");
    }
};

export const addProduct = async (req, res) => {
    try {
        const { name, category, metalType, description } = req.body;
        let imageUrl = trimString(req.body?.imageUrl) || "/images/placeholder-gold.jpg";

        if (req.file) {
            const uploaded = await uploadProductImage(req.file);
            imageUrl = uploaded.publicUrl;
        }

        if (!name || !category || !metalType || !description) {
            return sendError(res, 400, "Missing required fields");
        }

        const productCode = trimString(req.body?.productCode) || createProductCode();
        const sku = trimString(req.body?.sku) || createSku(productCode);

        const newProduct = new Product({
            productCode,
            sku,
            name,
            category,
            metalType,
            weightChi: toFiniteNumber(req.body?.weightChi, 0),
            makingFee: toFiniteNumber(req.body?.makingFee, 0),
            description,
            stock: toNonNegativeInt(req.body?.stock),
            discountPercent: toDiscountPercent(req.body?.discountPercent),
            imageUrl,
            isNew: toBoolean(req.body?.isNew)
        });

        await newProduct.save();

        return sendSuccess(res, 201, { product: newProduct });
    } catch (error) {
        console.error("Error adding product", error);
        return sendError(res, 500, "Server error");
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return sendError(res, 404, "Product not found");
        }

        return sendSuccess(res, 200, { message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product", error);
        return sendError(res, 500, "Server error");
    }
}

export const syncProducts = async (req, res) => {
    try {
        const { products, pruneMissing } = req.body;
        if (!Array.isArray(products)) {
            return sendError(res, 400, "Invalid products array");
        }

        let inserted = 0;
        let modified = 0;
        let matched = 0;

        for (const p of products) {
            const sku = trimString(p.sku) || createSku(p.productCode);
            const nextProduct = {
                ...p,
                sku,
            };

            const result = await Product.updateOne(
                { productCode: p.productCode },
                { $set: nextProduct },
                { upsert: true }
             );

            if (result.upsertedCount > 0) {
                inserted++;
            } else if (result.modifiedCount > 0) {
                modified++;
            } else {
                matched++;
            }
        }

        let deleted = 0;
        if (pruneMissing) {
            const incomingProductCodes = products.map(p => p.productCode);
            const deleteResult = await Product.deleteMany({ productCode: { $nin: incomingProductCodes } });
            deleted = deleteResult.deletedCount;
        }

        return sendSuccess(res, 200, {
            totalInput: products.length,
            inserted,
            modified,
            matched,
            deleted
        });
    } catch (error) {
        console.error("Error syncing products", error);
        return sendError(res, 500, "Server error");
    }
}