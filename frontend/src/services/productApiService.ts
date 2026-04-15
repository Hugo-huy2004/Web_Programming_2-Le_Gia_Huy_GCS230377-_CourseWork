import api from "@/lib/axios"
import { type AddProductInput, type UpdateProductInput } from "@/types/store"
import {
    listProductsRequest,
    syncProductsRequest,
    isAdminApiKeyConfigured,
    type ProductSyncPayload,
} from "@/lib/api"

function appendIfDefined(formData: FormData, key: string, value: unknown) {
    if (value === undefined || value === null) return
    formData.append(key, String(value))
}

function buildProductFormData(payload: AddProductInput | UpdateProductInput) {
    const formData = new FormData()

    appendIfDefined(formData, "name", payload.name)
    appendIfDefined(formData, "category", payload.category)
    appendIfDefined(formData, "metalType", payload.metalType)
    appendIfDefined(formData, "weightChi", payload.weightChi)
    appendIfDefined(formData, "makingFee", payload.makingFee)
    appendIfDefined(formData, "stock", payload.stock)
    appendIfDefined(formData, "imageUrl", payload.imageUrl)
    appendIfDefined(formData, "description", payload.description)
    appendIfDefined(formData, "isNew", payload.isNew)
    appendIfDefined(formData, "discountPercent", payload.discountPercent)

    if (payload.imageFile instanceof File) {
        formData.append("image", payload.imageFile)
    }

    return formData
}

export const productService = {
    getAllProducts: async () => {
        const res = await api.get("/products")
        return res.data
    },
    getProductById: async (id: string) => {
        const res = await api.get(`/products/${id}`)
        return res.data
    },
    editProduct: async (id: string, payload: UpdateProductInput) => {
        const res = await api.put(`/products/${id}`, buildProductFormData(payload))
        return res.data
    },
    addProduct: async (payload: AddProductInput) => {
        const res = await api.post("/products", buildProductFormData(payload))
        return res.data
    },
    deleteProduct: async (id: string) => {
        const res = await api.delete(`/products/${id}`)
        return res.data
        },
        listProducts: listProductsRequest,
        syncProducts: (products: ProductSyncPayload[], options?: { pruneMissing?: boolean }) =>
            syncProductsRequest(products, options),
        canSyncProducts: isAdminApiKeyConfigured,
}
