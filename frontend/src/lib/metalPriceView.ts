import type { GoldPriceSnapshot } from "@/types/store"
import {
  METAL_BUYBACK_RATE,
  SELL_FROM_BUY_RATE,
  type MetalBuybackKey,
} from "@/constants/metalPricingRules"

export type PriceHighlight = {
  label: string
  value: number
}

export type MetalValuationRow = {
  type: string
  sellPrice: number
  buybackPrice: number
}

type GoldBuybackRateKey = Exclude<MetalBuybackKey, "silver9999">

type GoldValuationConfig = {
  type: string
  karat: "24K" | "18K" | "14K" | "10K"
  buybackRateKey: GoldBuybackRateKey
}

const GOLD_VALUATION_CONFIGS: GoldValuationConfig[] = [
  { type: "Pure Gold 24K", karat: "24K", buybackRateKey: "gold24k" },
  { type: "Gold 18K", karat: "18K", buybackRateKey: "gold18k" },
  { type: "Gold 14K", karat: "14K", buybackRateKey: "gold14k" },
  { type: "Gold 10K", karat: "10K", buybackRateKey: "gold10k" },
]

function calculateBuybackPrice(sellPrice: number, key: MetalBuybackKey): number {
  return Number((sellPrice * METAL_BUYBACK_RATE[key]).toFixed(2))
}

function calculateSellPriceFromBuyPrice(buyPrice: number): number {
  return Number((buyPrice * SELL_FROM_BUY_RATE).toFixed(2))
}

export function getCollectionPriceHighlights(snapshot: GoldPriceSnapshot): PriceHighlight[] {
  const marketHighlights = [
    { label: "Live Gold 24K", basePrice: snapshot.karatPricePerChi["24K"] ?? snapshot.pricePerChi24K },
    { label: "Live Silver 9999", basePrice: snapshot.pricePerChi9999Silver },
  ]

  return marketHighlights.map((item) => ({
    label: item.label,
    value: calculateSellPriceFromBuyPrice(item.basePrice),
  }))
}

export function getMetalValuationRows(snapshot: GoldPriceSnapshot): MetalValuationRow[] {
  const goldRows = GOLD_VALUATION_CONFIGS.map((config) => {
    const buyPrice = snapshot.karatPricePerChi[config.karat]
    const sellPrice = calculateSellPriceFromBuyPrice(buyPrice)

    return {
      type: config.type,
      sellPrice,
      buybackPrice: calculateBuybackPrice(sellPrice, config.buybackRateKey),
    }
  })

  const silverSellPrice = calculateSellPriceFromBuyPrice(snapshot.pricePerChi9999Silver)

  return [
    ...goldRows,
    {
      type: "Fine Silver .9999",
      sellPrice: silverSellPrice,
      buybackPrice: calculateBuybackPrice(silverSellPrice, "silver9999"),
    },
  ]
}
