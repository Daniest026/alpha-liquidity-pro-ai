import type { MarketData } from "./types";

export function createEmptyMarketData(symbol: string, timeframe: string): MarketData {
  return {
    symbol,
    timeframe,
    candles: [],
  };
}

export type { MarketData } from "./types";
export type { Candle } from "./types";
