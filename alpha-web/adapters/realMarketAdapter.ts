import type { Candle } from '../lib/types';
import type { MarketAdapter } from './marketAdapter';

export class RealMarketAdapter implements MarketAdapter {
  async getCandles(symbol: string, timeframe: string, limit: number): Promise<Candle[]> {
    throw new Error('Real market data provider is not configured yet.');
  }
}
