export type MetalType = "24K" | "18K" | "14K" | "10K" | "Silver9999"

export type Product = {
  id: string
  name: string
  category: string
  metalType: MetalType
  productCode: string
  weightChi: number
  makingFee: number
  stock: number
  imageUrl: string
  description: string
  isNew?: boolean
  discountPercent?: number
}
