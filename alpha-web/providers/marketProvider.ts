import type { Candle, MarketData } from '../lib/types';

export interface MarketProvider {
  getMarketData(symbol: string, timeframe: string): Promise<MarketData>;
}

export class MockMarketProvider implements MarketProvider {
  async getMarketData(symbol: string, timeframe: string): Promise<MarketData> {
    const candles: Candle[] = [];
    const now = Date.now();
    const intervalMs = 60 * 1000;

    let price = 100;

    for (let index = 0; index < 100; index += 1) {
      const drift = (Math.sin(index / 5) + Math.cos(index / 7)) * 0.8;
      const open = price;
      const change = (Math.random() - 0.48) * 2.2 + drift * 0.2;
      const close = Math.max(1, open + change);
      const high = Math.max(open, close) + Math.abs(change) * 0.45 + 0.4;
      const low = Math.min(open, close) - Math.abs(change) * 0.45 - 0.4;
      const volume = 1200 + Math.round(Math.abs(change) * 1800) + index * 3;

      candles.push({
        time: now - (99 - index) * intervalMs,
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
