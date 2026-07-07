import type { Candle } from '../lib/types';
import type { IDataProvider } from '../interfaces/dataProvider';
import type { MarketAdapter } from './marketAdapter';

export class RealMarketAdapter implements MarketAdapter, IDataProvider {
  private connected = false;

  async connect(): Promise<void> {
    throw new Error('Provider not configured.');
  }

  async disconnect(): Promise<void> {
    throw new Error('Provider not configured.');
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getCandles(symbol: string, timeframe: string, limit: number): Promise<Candle[]> {
    throw new Error('Provider not configured.');
  }
}
