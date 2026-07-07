import { Candle } from '../lib/types';

export interface SwingPoint {
  index: number;
  price: number;
}

export interface BosResult {
  detected: boolean;
  direction: 'Bullish' | 'Bearish' | 'None';
  breakLevel: number | null;
  swingHigh: SwingPoint | null;
  swingLow: SwingPoint | null;
}

export function findSwingHigh(candles: Candle[]): SwingPoint | null {
  if (candles.length === 0) {
    return null;
  }

  let highestIndex = 0;
  let highestPrice = candles[0].high;

  for (let index = 1; index < candles.length; index += 1) {
    if (candles[index].high > highestPrice) {
      highestPrice = candles[index].high;
      highestIndex = index;
    }
  }

  return {
    index: highestIndex,
    price: highestPrice,
  };
}

export function findSwingLow(candles: Candle[]): SwingPoint | null {
  if (candles.length === 0) {
    return null;
  }

  let lowestIndex = 0;
  let lowestPrice = candles[0].low;

  for (let index = 1; index < candles.length; index += 1) {
    if (candles[index].low < lowestPrice) {
      lowestPrice = candles[index].low;
      lowestIndex = index;
    }
  }

  return {
    index: lowestIndex,
    price: lowestPrice,
  };
}

export function detectBreakOfStructure(candles: Candle[]): BosResult {
  if (candles.length < 20) {
    return {
      detected: false,
      direction: 'None',
      breakLevel: null,
      swingHigh: null,
      swingLow: null,
    };
  }

  const latestSwingHigh = findSwingHigh(candles);
  const latestSwingLow = findSwingLow(candles);
  const latestClose = candles[candles.length - 1].close;

  if (latestSwingHigh && latestClose > latestSwingHigh.price) {
    return {
      detected: true,
      direction: 'Bullish',
      breakLevel: latestSwingHigh.price,
      swingHigh: latestSwingHigh,
      swingLow: latestSwingLow,
    };
  }

  if (latestSwingLow && latestClose < latestSwingLow.price) {
    return {
      detected: true,
      direction: 'Bearish',
      breakLevel: latestSwingLow.price,
      swingHigh: latestSwingHigh,
      swingLow: latestSwingLow,
    };
  }

  return {
    detected: false,
    direction: 'None',
    breakLevel: null,
    swingHigh: latestSwingHigh,
    swingLow: latestSwingLow,
  };
}
