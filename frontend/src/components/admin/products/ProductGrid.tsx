import { AnimatePresence, motion } from "framer-motion"
import ProductItem from "@/components/admin/products/ProductItem"
import type { Product } from "@/types/product"
import type { ProductPricing } from "@/types/store"

type ProductGridProps = {
  products: Product[]
  getProductPricing: (product: Product) => ProductPricing
  onEdit: (product: Product) => void
  onDelete: (productId: string) => Promise<void>
  onRestock: (productId: string, stock: number) => Promise<void>
}

export function ProductGrid({ products, getProductPricing, onEdit, onDelete, onRestock }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <motion.div
            layout
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8 }}
          >
            <ProductItem
              product={product}
              pricing={getProductPricing(product)}
              onEdit={() => onEdit(product)}
              onDelete={() => void onDelete(product.id)}
              onRestock={() => void onRestock(product.id, product.stock + 1)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
