import api from "@/lib/axios"
import { type AddProductInput, type UpdateProductInput } from "@/types/store"
import {
    listProductsRequest,
    syncProductsRequest,
    isAdminApiKeyConfigured,
    type ProductSyncPayload,
} from "@/lib/api"

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
        const res = await api.put(`/products/${id}`, payload)
        return res.data
    },
    addProduct: async (payload: AddProductInput) => {
        const res = await api.post("/products", payload)
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
