import { MockMarketProvider, type MarketProvider } from '../providers/marketProvider';
import type { MarketData } from '../lib/types';

class MarketService {
  private provider: MarketProvider;

  constructor() {
    this.provider = new MockMarketProvider();
  }

  async getMarketData(symbol: string, timeframe: string): Promise<MarketData> {
    return this.provider.getMarketData(symbol, timeframe);
  }
}

export const marketService = new MarketService();
