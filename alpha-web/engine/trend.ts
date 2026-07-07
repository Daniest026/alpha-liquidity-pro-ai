import { Candle } from '../lib/types';

export type TrendDirection =
  | 'Strong Bullish'
  | 'Bullish'
  | 'Neutral'
  | 'Bearish'
  | 'Strong Bearish';

export function calculateAverageClose(candles: Candle[]): number {
  if (candles.length === 0) {
    return 0;
  }

  const sample = candles.slice(-20);
  const total = sample.reduce((sum, candle) => sum + candle.close, 0);

  return total / sample.length;
}

export function calculateLatestClose(candles: Candle[]): number {
  if (candles.length === 0) {
    return 0;
  }

  return candles[candles.length - 1].close;
}

export function detectTrend(candles: Candle[]): TrendDirection {
  if (candles.length < 20) {
    return 'Neutral';
  }

  const averageClose = calculateAverageClose(candles);
  const latestClose = calculateLatestClose(candles);

  if (latestClose > averageClose * 1.01) {
    return 'Strong Bullish';
  }

  if (latestClose > averageClose) {
    return 'Bullish';
  }

  if (latestClose < averageClose * 0.99) {
    return 'Strong Bearish';
  }

  if (latestClose < averageClose) {
    return 'Bearish';
  }

  return 'Neutral';
}
