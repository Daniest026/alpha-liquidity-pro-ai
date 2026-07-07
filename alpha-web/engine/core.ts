import { Candle } from '../lib/types';

export interface EngineResult {
  detected: boolean;
  confidence: number;
  direction: 'Bullish' | 'Bearish' | 'Neutral' | 'None';
  level: number | null;
  reason: string;
}

export function calculateBodySize(candle: Candle): number {
  return Math.abs(candle.close - candle.open);
}

export function calculateRange(candle: Candle): number {
  return candle.high - candle.low;
}

export function isBullish(candle: Candle): boolean {
  return candle.close > candle.open;
}

export function isBearish(candle: Candle): boolean {
  return candle.close < candle.open;
}

export function isLargeBody(current: Candle, previous: Candle): boolean {
  return calculateBodySize(current) > calculateBodySize(previous);
}
