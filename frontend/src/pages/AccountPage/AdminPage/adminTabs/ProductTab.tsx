import { useEffect, useMemo, useState } from "react"
import { useProductStore } from "@/stores/useProductStore"
import { type Product } from "@/types/product"
import { AdminSearchInput } from "@/components/admin/AdminSearchInput"
import { ProductGrid } from "@/components/admin/products/ProductGrid"
import { ProductTabHeader } from "@/components/admin/products/ProductTabHeader"
import { ProductFormModal, type ProductFormState } from "@/components/admin/products/ProductFormModal"
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
  } = useProductStore()
 
  const [search, setSearch] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
 
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
    setSelectedImageFile(null)
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
    setSelectedImageFile(null)
    setIsModalOpen(true)
  }

  const handleSelectImage = (file: File) => {
    const previewUrl = URL.createObjectURL(file)
    setSelectedImageFile(file)
    setForm((prev) => ({ ...prev, imageUrl: previewUrl }))
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
      stock: Math.floor(toNumber(form.stock)),
      imageFile: selectedImageFile,
    }
 
    try {
      if (editingId) await updateProduct(editingId, payload)
      else await createProduct(payload)
      toast.success("Registry synchronized successfully.")
      setSelectedImageFile(null)
      setIsModalOpen(false)
    } catch (err: unknown) { 
      const error = err as Error
      toast.error(error.message || "Synchronization failed.")
    }
  }
 
  return (
    <div className="animate-in space-y-6 py-4 fade-in duration-700 md:space-y-8 md:py-6">
      <ProductTabHeader onAddNew={handleAddNew} />

      <AdminSearchInput
        placeholder="Search by name or category..."
        value={search}
        onChange={setSearch}
        className="max-w-xl"
      />

      <p className="text-xs text-muted-foreground">
        Showing {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"}
      </p>

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
        onSelectImage={handleSelectImage}
        onClose={() => {
          setSelectedImageFile(null)
          setIsModalOpen(false)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
