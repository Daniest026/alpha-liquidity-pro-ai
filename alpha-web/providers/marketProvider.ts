import type { Candle, MarketData } from '../lib/types';
import { MARKET_PROVIDER } from '../config/market';

export interface MarketProvider {
  getMarketData(symbol: string, timeframe: string): Promise<MarketData>;
}

export class MockMarketProvider implements MarketProvider {
  async getMarketData(symbol: string, timeframe: string): Promise<MarketData> {
    const candles: Candle[] = [];
    const now = Date.now();
    const intervalMs = 60 * 1000;
    const candleCount = MARKET_PROVIDER.defaultLimit;

    let price = 100;

    for (let index = 0; index < candleCount; index += 1) {
      const drift = (Math.sin(index / 6) + Math.cos(index / 9)) * 0.7;
      const open = price;
      const change = drift * 0.8 + (index % 7 - 3) * 0.12;
      const close = Math.max(1, open + change);
      const high = Math.max(open, close) + Math.abs(change) * 0.45 + 0.3;
      const low = Math.min(open, close) - Math.abs(change) * 0.45 - 0.3;
      const volume = 1200 + Math.round(Math.abs(change) * 1600) + index * 3;

      candles.push({
        time: now - (candleCount - 1 - index) * intervalMs,
        open,
        high,
        low,
        close,
        volume,
      });

      price = close;
    }

    return {
      symbol,
      timeframe,
      candles,
    };
  }
}
