import { create } from 'zustand'
import type { GoldPriceSnapshot, GoldApiResponse } from '../types/store'
import {
  GOLD_API_URL,
  SILVER_API_URL,
  DEFAULT_XAUUSD_PER_OUNCE,
  DEFAULT_XAGUSD_PER_OUNCE,
  GRAMS_PER_TROY_OUNCE,
  GRAMS_PER_CHI,
  SILVER_MARKUP_RATE,
  METAL_PURITY,
  parseGoldRows,
  pickWorldGoldSource,
} from '../lib/storeUtils'

type SilverApiResponse = {
  price?: unknown
  ask?: unknown
  bid?: unknown
}

type SnapshotMeta = {
  date: string
  time: string
  sourceCode: string
  sourceName: string
  rows: GoldPriceSnapshot['rows']
}

function toFixedNumber(value: number, digits = 2): number {
  return Number(value.toFixed(digits))
}

function ounceToChi(pricePerOunce: number): number {
  return (pricePerOunce / GRAMS_PER_TROY_OUNCE) * GRAMS_PER_CHI
}

function resolvePositiveNumber(candidates: unknown[], fallback: number): number {
  for (const candidate of candidates) {
    const parsed = Number(candidate)
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed
    }
  }

  return fallback
}

function resolveGoldPricePerOunce(source: ReturnType<typeof pickWorldGoldSource> | null): number {
  return resolvePositiveNumber([source?.sell, source?.buy], DEFAULT_XAUUSD_PER_OUNCE)
}

function resolveSilverPricePerOunceWithMarkup(payload: SilverApiResponse): number {
  const worldSilverPricePerOunce = resolvePositiveNumber(
    [payload.price, payload.ask, payload.bid],
    DEFAULT_XAGUSD_PER_OUNCE
  )
  return worldSilverPricePerOunce * (1 + SILVER_MARKUP_RATE)
}

function buildKaratPricePerChi(pricePerChi24K: number): Record<string, number> {
  return {
    '24K': toFixedNumber(pricePerChi24K * METAL_PURITY['24K']),
    '18K': toFixedNumber(pricePerChi24K * METAL_PURITY['18K']),
    '14K': toFixedNumber(pricePerChi24K * METAL_PURITY['14K']),
    '10K': toFixedNumber(pricePerChi24K * METAL_PURITY['10K']),
  }
}

function getLiveSnapshotMeta(
  goldPayload: GoldApiResponse,
  rows: GoldPriceSnapshot['rows'],
  goldSource: ReturnType<typeof pickWorldGoldSource>
): SnapshotMeta {
  const now = new Date()
  const date =
    goldPayload.date ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`
  const time =
    goldPayload.time ??
    new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(now)

  return {
    date,
    time,
    sourceCode: goldSource?.code ?? 'FALLBACK',
    sourceName: goldSource?.name ?? 'Fallback World Gold (XAU/USD)',
    rows: rows.slice(0, 30),
  }
}

function getFallbackSnapshotMeta(): SnapshotMeta {
  const now = new Date()
  return {
    date: now.toISOString().slice(0, 10),
    time: now.toLocaleTimeString('en-US', { hour12: false }),
    sourceCode: 'FALLBACK',
    sourceName: 'Fallback World Gold (XAU/USD)',
    rows: [],
  }
}

function createSnapshot(
  meta: SnapshotMeta,
  goldPricePerOunce: number,
  silverPricePerOunce: number
): GoldPriceSnapshot {
  const pricePerChi24K = ounceToChi(goldPricePerOunce)
  const pricePerChi9999Silver = ounceToChi(silverPricePerOunce)

  return {
    date: meta.date,
    time: meta.time,
    sourceCode: meta.sourceCode,
    sourceName: meta.sourceName,
    pricePerOunce24K: toFixedNumber(goldPricePerOunce),
    pricePerChi24K: toFixedNumber(pricePerChi24K),
    pricePerOunce9999Silver: toFixedNumber(silverPricePerOunce),
    pricePerChi9999Silver: toFixedNumber(pricePerChi9999Silver),
    karatPricePerChi: buildKaratPricePerChi(pricePerChi24K),
    rows: meta.rows,
    lastUpdatedAt: new Date().toISOString(),
  }
}

function createSnapshotFromLivePayloads(
  goldPayload: GoldApiResponse,
  silverPayload: SilverApiResponse
): GoldPriceSnapshot {
  const rows = parseGoldRows(goldPayload.prices)
  const goldSource = pickWorldGoldSource(rows)
  const goldPricePerOunce = resolveGoldPricePerOunce(goldSource)
  const silverPricePerOunce = resolveSilverPricePerOunceWithMarkup(silverPayload)
  const meta = getLiveSnapshotMeta(goldPayload, rows, goldSource)

  return createSnapshot(meta, goldPricePerOunce, silverPricePerOunce)
}

function createFallbackSnapshot(): GoldPriceSnapshot {
  const meta = getFallbackSnapshotMeta()
  const silverPricePerOunceWithMarkup = DEFAULT_XAGUSD_PER_OUNCE * (1 + SILVER_MARKUP_RATE)
  return createSnapshot(meta, DEFAULT_XAUUSD_PER_OUNCE, silverPricePerOunceWithMarkup)
}

interface PriceStoreState {
  goldSnapshot: GoldPriceSnapshot | null
  goldLoading: boolean
  goldError: string | null
  refreshGoldPrices: () => Promise<void>
}

export const usePriceStore = create<PriceStoreState>((set) => ({
  goldSnapshot: null,
  goldLoading: false,
  goldError: null,
  refreshGoldPrices: async () => {
    set({ goldLoading: true, goldError: null })
    try {
      const [goldResponse, silverResponse] = await Promise.all([
        fetch(GOLD_API_URL),
        fetch(SILVER_API_URL),
      ])

      if (!goldResponse.ok) throw new Error(`Gold HTTP ${goldResponse.status}`)
      if (!silverResponse.ok) throw new Error(`Silver HTTP ${silverResponse.status}`)

      const [goldPayload, silverPayload] = await Promise.all([
        goldResponse.json() as Promise<GoldApiResponse>,
        silverResponse.json() as Promise<SilverApiResponse>,
      ])

      set({
        goldSnapshot: createSnapshotFromLivePayloads(goldPayload, silverPayload),
        goldLoading: false,
      })
    } catch {
      set({
        goldError: 'Unable to load live world metal prices. Using fallback data.',
        goldSnapshot: createFallbackSnapshot(),
        goldLoading: false,
      })
    }
  },
}))