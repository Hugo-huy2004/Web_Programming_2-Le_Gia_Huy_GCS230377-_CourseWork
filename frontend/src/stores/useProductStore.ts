import { create } from 'zustand'
import type { Product } from '../types/product'
import type { AddProductInput, UpdateProductInput } from '../types/store'
import {createId,toNumber,normalizeMetalType,sanitizeDiscount,mapProductDto,} from '../lib/storeUtils'
import {type ProductSyncPayload,} from '../lib/api'
import { productService } from '@/services/productApiService'
import { uploadApiService } from '@/services/uploadApiService'
import { usePriceStore } from './usePriceStore'
import {METAL_PURITY,DEFAULT_XAUUSD_PER_OUNCE,DEFAULT_XAGUSD_PER_OUNCE,GRAMS_PER_TROY_OUNCE,GRAMS_PER_CHI,} from '../lib/storeUtils'
import type { ProductPricing } from '../types/store'

interface ProductStoreState {
  products: Product[]
  searchTerm: string
  selectedCategory: string
  productsSyncState: 'idle' | 'syncing' | 'success' | 'error'
  productsSyncMessage: string
  lastProductsSyncAt: string | null
  setProducts: (products: Product[]) => void
  addProduct: (input: AddProductInput) => void
  createProduct: (input: AddProductInput) => Promise<void>
  updateProductInfo: (productId: string, input: UpdateProductInput) => void
  updateProduct: (productId: string, input: UpdateProductInput) => Promise<void>
  removeProduct: (productId: string) => Promise<{ ok: boolean; message: string }>
  deleteProduct: (productId: string) => Promise<{ ok: boolean; message: string }>
  updateProductStock: (productId: string, stock: number) => void
  uploadProductImage: (file: File) => Promise<{ ok: boolean; publicUrl: string | null; message: string }>
  loadProductsFromMongo: () => Promise<void>
  syncProductsToMongo: () => Promise<{ ok: boolean; message: string; syncedCount: number }>
  setSearchTerm: (term: string) => void
  setSelectedCategory: (category: string) => void
  categories: () => string[]
  getProductPricing: (product: {
    metalType: Product['metalType']
    weightChi: number
    makingFee: number
    discountPercent?: number
  }) => ProductPricing
}

const isProductsAutoSyncingRef = { current: false }
const hasLoadedProductsFromMongoRef = { current: false }

export const useProductStore = create<ProductStoreState>((set, get) => {
  const mapProductsForSyncPayload = (items: Product[]): { payload: ProductSyncPayload[]; skippedCount: number } => {
    const payload: ProductSyncPayload[] = []
    let skippedCount = 0

    for (const product of items) {
      const productCode = String(product.productCode ?? '').trim()
      const name = String(product.name ?? '').trim()
      const category = String(product.category ?? 'Other').trim() || 'Other'
      const metalType = normalizeMetalType(product.metalType)

      if (!productCode || !name) {
        skippedCount += 1
        continue
      }

      payload.push({
        productCode,
        name,
        category,
        metalType,
        weightChi: Math.max(0, toNumber(product.weightChi, 0)),
        makingFee: Math.max(0, toNumber(product.makingFee, 0)),
        discountPercent: sanitizeDiscount(toNumber(product.discountPercent, 0)),
        stock: Math.max(0, Math.floor(toNumber(product.stock, 0))),
        imageUrl: String(product.imageUrl ?? '').trim() || '/images/placeholder-gold.jpg',
        description: String(product.description ?? '').trim() || `${name} - premium gold jewelry.`,
        isNew: Boolean(product.isNew),
      })
    }

    return { payload, skippedCount }
  }

  return {
    products: [],
    searchTerm: '',
    selectedCategory: 'All',
    productsSyncState: 'idle',
    productsSyncMessage: 'Auto-sync is waiting for changes.',
    lastProductsSyncAt: null,

    setProducts: (products: Product[]) => {
      set({ products })
    },

    addProduct: (input: AddProductInput) => {
      const { products } = get()
      const newProduct: Product = {
        id: createId('product'),
        productCode: `PENDING-${Date.now()}`, 
        name: input.name.trim(),
        category: input.category.trim(),
        metalType: input.metalType,
        weightChi: Math.max(0, input.weightChi),
        makingFee: Math.max(0, input.makingFee),
        stock: Math.max(0, Math.floor(input.stock)),
        imageUrl: input.imageUrl.trim(),
        description: input.description.trim(),
        isNew: input.isNew,
        discountPercent: sanitizeDiscount(input.discountPercent),
      }

      set({ products: [newProduct, ...products] })
    },

    createProduct: async (input: AddProductInput) => {
      await productService.addProduct(input)
      await get().loadProductsFromMongo()
    },

    updateProductInfo: (productId: string, input: UpdateProductInput) => {
      const { products } = get()
      set({
        products: products.map((product) => {
          if (product.id !== productId) {
            return product
          }

          return {
            ...product,
            name: input.name === undefined ? product.name : input.name.trim() || product.name,
            category:
              input.category === undefined
                ? product.category
                : input.category.trim() || product.category,
            metalType: input.metalType ?? product.metalType,
            weightChi:
              input.weightChi === undefined ? product.weightChi : Math.max(0, Number(input.weightChi) || 0),
            makingFee:
              input.makingFee === undefined
                ? product.makingFee
                : Math.max(0, Number(input.makingFee) || 0),
            stock:
              input.stock === undefined
                ? product.stock
                : Math.max(0, Math.floor(Number(input.stock) || 0)),
            imageUrl:
              input.imageUrl === undefined ? product.imageUrl : input.imageUrl.trim() || product.imageUrl,
            description:
              input.description === undefined
                ? product.description
                : input.description.trim() || product.description,
            isNew: input.isNew ?? product.isNew,
            discountPercent:
              input.discountPercent === undefined
                ? product.discountPercent
                : sanitizeDiscount(Number(input.discountPercent) || 0),
          }
        }),
      })
    },

    updateProduct: async (productId: string, input: UpdateProductInput) => {
      await productService.editProduct(productId, input)
      await get().loadProductsFromMongo()
    },

    removeProduct: async (productId: string) => {
      try {
        await productService.deleteProduct(productId)
        await get().loadProductsFromMongo()

        return {
          ok: true,
          message: 'Product deleted successfully.',
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete product.'
        set({
          productsSyncState: 'error',
          productsSyncMessage: `Delete failed: ${message}`,
        })

        return {
          ok: false,
          message,
        }
      }
    },

    deleteProduct: async (productId: string) => {
      return get().removeProduct(productId)
    },

    updateProductStock: (productId: string, stock: number) => {
      const nextStock = Math.max(0, Math.floor(stock))
      const { products } = get()

      set({
        products: products.map((product) =>
          product.id === productId ? { ...product, stock: nextStock } : product
        ),
      })
    },

    uploadProductImage: async (file: File) => {
      try {
        const result = await uploadApiService.uploadProductImage(file)
        if (!result.ok) {
          return {
            ok: false,
            publicUrl: null,
            message: result.message || 'Image upload failed.',
          }
        }

        return {
          ok: true,
          publicUrl: result.publicUrl,
          message: result.message,
        }
      } catch (error) {
        return {
          ok: false,
          publicUrl: null,
          message: error instanceof Error ? error.message : 'Image upload failed.',
        }
      }
    },

    loadProductsFromMongo: async () => {
      try {
        const response = await productService.listProducts()
        const mapped = response.products
          .map((item) => mapProductDto(item))
          .filter((item): item is Product => item !== null)

        set({
          products: mapped,
          productsSyncState: 'success',
          productsSyncMessage: mapped.length > 0
            ? `Loaded ${mapped.length} products from MongoDB.`
            : 'MongoDB responded with no products.',
          lastProductsSyncAt: new Date().toISOString(),
        })
        hasLoadedProductsFromMongoRef.current = true
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to load products from MongoDB.'
        set({ products: [] })
        hasLoadedProductsFromMongoRef.current = true
        set({
          productsSyncState: 'error',
          productsSyncMessage: `Failed to load products from MongoDB: ${message}`,
        })
      }
    },

    syncProductsToMongo: async () => {
      if (!productService.canSyncProducts()) {
        set({
          productsSyncState: 'error',
          productsSyncMessage: 'Auto-sync disabled: missing VITE_ADMIN_API_KEY.',
        })
        return { ok: false, message: 'Missing VITE_ADMIN_API_KEY in frontend env.', syncedCount: 0 }
      }

      const { products } = get()

      if (isProductsAutoSyncingRef.current) {
        return { ok: false, message: 'Products are already syncing.', syncedCount: 0 }
      }

      isProductsAutoSyncingRef.current = true
      const { payload, skippedCount } = mapProductsForSyncPayload(products)

      set({
        productsSyncState: 'syncing',
        productsSyncMessage: `Syncing ${payload.length} products to MongoDB...`,
      })

      try {
        const response = await productService.syncProducts(payload, { pruneMissing: true })
        const syncedAt = new Date().toISOString()

        set({
          productsSyncState: 'success',
          productsSyncMessage: `Auto-sync successful. Inserted: ${response.inserted}, Updated: ${response.modified}, Deleted: ${response.deleted ?? 0}.${
            skippedCount > 0 ? ` Skipped: ${skippedCount}.` : ''
          }`,
          lastProductsSyncAt: syncedAt,
        })

        return {
          ok: true,
          message: `${response.message}. Inserted: ${response.inserted}, Updated: ${response.modified}, Deleted: ${response.deleted ?? 0}.${
            skippedCount > 0 ? ` Skipped: ${skippedCount}.` : ''
          }`,
          syncedCount: response.totalInput,
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to sync products.'
        set({
          productsSyncState: 'error',
          productsSyncMessage: `Auto-sync failed: ${message}`,
        })

        return {
          ok: false,
          message,
          syncedCount: 0,
        }
      } finally {
        isProductsAutoSyncingRef.current = false
      }
    },

    setSearchTerm: (term: string) => {
      set({ searchTerm: term })
    },

    setSelectedCategory: (category: string) => {
      set({ selectedCategory: category })
    },

    categories: () => {
      const { products } = get()
      const values = new Set<string>(products.map((item) => item.category))
      return ['All', ...Array.from(values)]
    },

    getProductPricing: (product) => {
      const priceStore = usePriceStore.getState()
      const isSilver = product.metalType === 'Silver9999'

      const basePerChi = isSilver
        ? priceStore.goldSnapshot?.pricePerChi9999Silver ??
          (DEFAULT_XAGUSD_PER_OUNCE / GRAMS_PER_TROY_OUNCE) * GRAMS_PER_CHI
        : priceStore.goldSnapshot?.pricePerChi24K ??
          (DEFAULT_XAUUSD_PER_OUNCE / GRAMS_PER_TROY_OUNCE) * GRAMS_PER_CHI

      const purity = METAL_PURITY[product.metalType] ?? 1
      const materialCost = Number((Math.max(0, product.weightChi) * basePerChi * purity).toFixed(2))
      const oldPrice = Number((materialCost + Math.max(0, product.makingFee)).toFixed(2))
      const discountPercent = sanitizeDiscount(product.discountPercent ?? 0)
      const finalPrice = Number((oldPrice * (1 - discountPercent / 100)).toFixed(2))

      return {
        materialCost,
        oldPrice,
        finalPrice,
        discountPercent,
        basePerChi,
        purity,
      }
    },
  }
})