import { motion } from "framer-motion"
import { useMemo } from "react"
import { ProductCard } from "@/components/product/ProductCard"
import { ProductFilterBar } from "@/components/product/ProductFilterBar"
import { useProductStore } from "@/stores/useProductStore"
import { usePriceStore } from "@/stores/usePriceStore"
import { useCartStore } from "@/stores/useCartStore"
import { formatUsd } from "@/lib/formatUtils"
import { getCollectionPriceHighlights } from "@/lib/metalPriceView"

function matchesProductFilter(
  product: { category: string; name: string; description: string; productCode: string },
  selectedCategory: string,
  keyword: string
) {
  const matchesCategory = selectedCategory === "All" || product.category === selectedCategory

  const matchesKeyword =
    !keyword ||
    product.name.toLowerCase().includes(keyword) ||
    product.category.toLowerCase().includes(keyword) ||
    product.description.toLowerCase().includes(keyword) ||
    product.productCode.toLowerCase().includes(keyword)

  return matchesCategory && matchesKeyword
}

const Collections = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    categories: getCategories,
    productsSyncState,
    productsSyncMessage,
    getProductPricing,
  } = useProductStore()
  const { goldSnapshot } = usePriceStore()
  const { triggerAnimation, addToCart, getCartQuantity } = useCartStore()

  const categories = getCategories()

  const filteredProducts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()

    return products
      .filter((product) => matchesProductFilter(product, selectedCategory, keyword))
      .sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
  }, [products, searchTerm, selectedCategory])

  const priceHighlights = useMemo(
    () => (goldSnapshot ? getCollectionPriceHighlights(goldSnapshot) : []),
    [goldSnapshot]
  )

  const addToCartWithAnimation = (
    e: React.MouseEvent<HTMLButtonElement>,
    input: { id: string; imageUrl: string; stock: number }
  ) => {
    const img = e.currentTarget.closest("article")?.querySelector("img")
    if (img) {
      const rect = img.getBoundingClientRect()
      const flySize = Math.min(88, Math.max(56, rect.width * 0.34))
      triggerAnimation(input.imageUrl, rect.left + rect.width / 2, rect.top + rect.height / 2, flySize)
    }
    addToCart(input.id, input.stock)
  }

  return (
    <section className="relative space-y-10 pb-20 md:space-y-20 md:pb-32">
      {/* Editorial Header */}
      <header className="relative border-b border-border pb-8 pt-7 md:pb-10 md:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-6 md:space-y-12"
        >
          <p className="small-caps">The Heritage Archive</p>
          <h1 className="font-serif text-[2.25rem] leading-tight tracking-tighter text-foreground sm:text-5xl md:text-7xl">
            Curated <br />
            <span className="italic text-accent opacity-90">Collections</span>
          </h1>
          <div className="flex flex-col justify-between gap-7 pt-3 lg:flex-row lg:items-end">
            <p className="max-w-xl font-serif text-[15px] italic leading-relaxed text-muted-foreground md:text-base">
              Explore a selection of timeless masterpieces, each meticulously authenticated. Refine your discovery by category or metal type to find the perfect addition to your curated legacy.
            </p>

            {priceHighlights.length > 0 && (
              <div className="grid grid-cols-1 gap-4 border-y border-accent/20 py-4 min-[430px]:grid-cols-2 min-[430px]:gap-8 lg:flex lg:items-center lg:border-l lg:border-y-0 lg:py-0 lg:pl-8">
                {priceHighlights.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="small-caps mb-1">{item.label}</p>
                    <p className="font-serif text-[2rem] leading-none text-foreground md:text-3xl">{formatUsd(item.value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </header>

      <ProductFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 pt-2 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((item, idx) => (
          <ProductCard
            key={item.id}
            product={item}
            index={idx}
            pricing={getProductPricing(item)}
            inCartQuantity={getCartQuantity(item.id)}
            formatUsd={formatUsd}
            onAddToCart={addToCartWithAnimation}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="border-t border-border px-4 py-14 text-center md:p-20">
          <p className="font-serif text-xl italic text-muted-foreground opacity-40 md:text-2xl">
            {productsSyncState === "error"
              ? productsSyncMessage
              : "No pieces found in the current selection archive."}
          </p>
        </div>
      )}

    </section>
  )
}

export default Collections
