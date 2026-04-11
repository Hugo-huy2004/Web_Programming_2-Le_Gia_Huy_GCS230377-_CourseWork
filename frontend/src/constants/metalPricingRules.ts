const GOLD_BUYBACK_RATE = 0.95

export const METAL_BUYBACK_RATE = {
  gold24k: GOLD_BUYBACK_RATE,
  gold18k: GOLD_BUYBACK_RATE,
  gold14k: GOLD_BUYBACK_RATE,
  gold10k: GOLD_BUYBACK_RATE,
  silver9999: 0.7,
} as const

export const SELL_FROM_BUY_RATE = 0.95

export type MetalBuybackKey = keyof typeof METAL_BUYBACK_RATE
