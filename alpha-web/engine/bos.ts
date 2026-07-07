import { Candle } from '../lib/types';

export interface SwingPoint {
  index: number;
  time: number;
  price: number;
}

export interface BosResult {
  detected: boolean;
  direction: 'Bullish' | 'Bearish' | 'None';
  breakPrice: number | null;
  swingHigh: SwingPoint | null;
  swingLow: SwingPoint | null;
  confidence: number;
}

export function findSwingHigh(candles: Candle[]): SwingPoint | null {
  if (candles.length < 3) {
    return null;
  }

  let latestSwingHigh: SwingPoint | null = null;

  for (let index = 1; index < candles.length - 1; index += 1) {
    const previous = candles[index - 1];
    const current = candles[index];
    const next = candles[index + 1];

    if (current.high > previous.high && current.high > next.high) {
      latestSwingHigh = {
        index,
        time: current.time,
        price: current.high,
      };
    }
  }

  return latestSwingHigh;
}

export function findSwingLow(candles: Candle[]): SwingPoint | null {
  if (candles.length < 3) {
    return null;
  }

  let latestSwingLow: SwingPoint | null = null;

  for (let index = 1; index < candles.length - 1; index += 1) {
    const previous = candles[index - 1];
    const current = candles[index];
    const next = candles[index + 1];

    if (current.low < previous.low && current.low < next.low) {
      latestSwingLow = {
        index,
        time: current.time,
        price: current.low,
      };
    }
  }

  return latestSwingLow;
}

export function detectBreakOfStructure(candles: Candle[]): BosResult {
  if (candles.length < 20) {
    return {
      detected: false,
      direction: 'None',
      breakPrice: null,
      swingHigh: null,
      swingLow: null,
      confidence: 0,
    };
  }

  const latestSwingHigh = findSwingHigh(candles);
  const latestSwingLow = findSwingLow(candles);
  const latestCandle = candles[candles.length - 1];
  const previousCandle = candles[candles.length - 2];
  const latestBody = Math.abs(latestCandle.close - latestCandle.open);
  const previousBody = Math.abs(previousCandle.close - previousCandle.open);

  if (latestSwingHigh && latestCandle.close > latestSwingHigh.price) {
    return {
      detected: true,
      direction: 'Bullish',
      breakPrice: latestSwingHigh.price,
      swingHigh: latestSwingHigh,
      swingLow: latestSwingLow,
      confidence: 70 + (latestBody > previousBody ? 10 : 0),
    };
  }

  if (latestSwingLow && latestCandle.close < latestSwingLow.price) {
    return {
      detected: true,
      direction: 'Bearish',
      breakPrice: latestSwingLow.price,
      swingHigh: latestSwingHigh,
      swingLow: latestSwingLow,
      confidence: 70 + (latestBody > previousBody ? 10 : 0),
    };
  }

  return {
    detected: false,
    direction: 'None',
    breakPrice: null,
    swingHigh: latestSwingHigh,
    swingLow: latestSwingLow,
    confidence: 0,
  };
}
