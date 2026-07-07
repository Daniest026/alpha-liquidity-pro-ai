import type { Candle } from '../lib/types';
import { MockMarketProvider } from '../providers/marketProvider';

export interface MarketAdapter {
  getCandles(symbol: string, timeframe: string, limit: number): Promise<Candle[]>;
}

export class MockMarketAdapter implements MarketAdapter {
  constructor(private readonly provider: MockMarketProvider = new MockMarketProvider()) {}

  async getCandles(symbol: string, timeframe: string, limit: number): Promise<Candle[]> {
    const marketData = await this.provider.getMarketData(symbol, timeframe);
    return marketData.candles.slice(-limit);
  }
}
