import { useEffect, useMemo, useState } from "react"
import { useProductStore } from "@/stores/useProductStore"
import { type Product } from "@/types/product"
import { AdminSearchInput } from "@/components/admin/AdminSearchInput"
import { ProductFormModal, type ProductFormState } from "@/components/admin/products/ProductFormModal"
import { ProductTabHeader } from "@/components/admin/products/ProductTabHeader"
import { ProductFeedbackMessage } from "@/components/admin/products/ProductFeedbackMessage"
import { ProductGrid } from "@/components/admin/products/ProductGrid"
import { confirmWithToast } from "@/lib/toastConfirm"
import { toast } from "sonner"
 
const toNumber = (value: string | number) => Number(value) || 0

const initialProductForm: ProductFormState = {
  name: "",
  category: "Rings",
  metalType: "24K",
  weightChi: "1",
  makingFee: "0",
  discountPercent: "0",
  stock: "0",
  imageUrl: "",
  description: "Handcrafted Luxury",
  isNew: false,
}
 
export default function ProductTab() {
  const {
    products,
    loadProductsFromMongo,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductPricing,
    uploadProductImage,
  } = useProductStore()
 
  const [search, setSearch] = useState("")
  const [statusMessage, setStatusMessage] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
 
  const [form, setForm] = useState<ProductFormState>(initialProductForm)
 
  useEffect(() => { loadProductsFromMongo() }, [loadProductsFromMongo])
 
  const activeCategories = useMemo(() => {
    const categories = products.map((product) => product.category)
    const uniqueCategories = Array.from(new Set(categories)).filter(Boolean)
    return uniqueCategories.length > 0 ? uniqueCategories : ["Rings"]
  }, [products])
 
  const filteredProducts = useMemo(
    () => products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  )
 
  const handleAddNew = () => {
    setEditingId(null)
    setForm(initialProductForm)
    setIsModalOpen(true)
  }
 
  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name, category: product.category, metalType: product.metalType,
      weightChi: String(product.weightChi), makingFee: String(product.makingFee),
      discountPercent: String(product.discountPercent || 0), stock: String(product.stock),
      imageUrl: product.imageUrl, description: product.description || "", isNew: !!product.isNew
    })
    setIsModalOpen(true)
  }

  const handleDeleteProduct = async (productId: string) => {
    confirmWithToast({
      message: "Purge this legacy asset from the institutional archive?",
      confirmLabel: "Purge",
      onConfirm: async () => {
        const result = await deleteProduct(productId)
        if (result.ok) {
          toast.success("Product purged from registry.")
          return
        }
        toast.error(result.message || "Failed to purge product.")
      },
    })
  }

  const handleRestock = async (productId: string, nextStock: number) => {
    await updateProduct(productId, { stock: nextStock })
  }
 
  const handleSave = async () => {
    const payload = {
      ...form,
      weightChi: toNumber(form.weightChi),
      makingFee: toNumber(form.makingFee),
      discountPercent: toNumber(form.discountPercent),
      stock: Math.floor(toNumber(form.stock))
    }
 
    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      setStatusMessage("Registry Synchronized Successfully")
      setIsModalOpen(false)
      setTimeout(() => setStatusMessage(""), 5000)
    } catch (err: unknown) { 
      const error = err as Error
      setStatusMessage(error.message) 
    }
  }

  const handleUploadImage = async (file: File): Promise<string | null> => {
    const result = await uploadProductImage(file)
    if (!result.ok || !result.publicUrl) {
      setStatusMessage(result.message || "Image upload failed.")
      return null
    }

    return result.publicUrl
  }
 
  return (
    <div className="space-y-10 py-6 animate-in fade-in duration-1000">
      <ProductTabHeader onAddNew={handleAddNew} />

      <ProductFeedbackMessage message={statusMessage} onClear={() => setStatusMessage("")} />

      <AdminSearchInput
        placeholder="Locate specific historical masterpieces or series..."
        value={search}
        onChange={setSearch}
      />

      <ProductGrid
        products={filteredProducts}
        getProductPricing={getProductPricing}
        onEdit={handleEdit}
        onDelete={handleDeleteProduct}
        onRestock={handleRestock}
      />

      <ProductFormModal
        isOpen={isModalOpen}
        editingId={editingId}
        form={form}
        setForm={setForm}
        categories={activeCategories}
        onUploadImage={handleUploadImage}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
