import type { Candle } from '../lib/types';

export interface IDataProvider {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getCandles(symbol: string, timeframe: string, limit: number): Promise<Candle[]>;
}
