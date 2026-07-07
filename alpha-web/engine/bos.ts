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

export interface StructureResult {
  internal: 'Bullish' | 'Bearish' | 'Neutral';
  external: 'Bullish' | 'Bearish' | 'Neutral';
}

export interface EqualLevelsResult {
  equalHigh: boolean;
  equalLow: boolean;
  level: number | null;
}

function collectSwingPoints(candles: Candle[]) {
  const highs: SwingPoint[] = [];
  const lows: SwingPoint[] = [];

  for (let index = 1; index < candles.length - 1; index += 1) {
    const previous = candles[index - 1];
    const current = candles[index];
    const next = candles[index + 1];

    if (current.high > previous.high && current.high > next.high) {
      highs.push({ index, time: current.time, price: current.high });
    }

    if (current.low < previous.low && current.low < next.low) {
      lows.push({ index, time: current.time, price: current.low });
    }
  }

  return { highs, lows };
}

export function findSwingHigh(candles: Candle[]): SwingPoint | null {
  if (candles.length < 3) {
    return null;
  }

  const { highs } = collectSwingPoints(candles);
  return highs[highs.length - 1] ?? null;
}

export function findSwingLow(candles: Candle[]): SwingPoint | null {
  if (candles.length < 3) {
    return null;
  }

  const { lows } = collectSwingPoints(candles);
  return lows[lows.length - 1] ?? null;
}

export function detectInternalStructure(candles: Candle[]): StructureResult['internal'] {
  if (candles.length < 20) {
    return 'Neutral';
  }

  const { highs, lows } = collectSwingPoints(candles);

  if (highs.length >= 2 && lows.length >= 2) {
    const latestHigh = highs[highs.length - 1];
    const previousHigh = highs[highs.length - 2];
    const latestLow = lows[lows.length - 1];
    const previousLow = lows[lows.length - 2];

    if (latestHigh.price > previousHigh.price && latestLow.price > previousLow.price) {
      return 'Bullish';
    }

    if (latestHigh.price < previousHigh.price && latestLow.price < previousLow.price) {
      return 'Bearish';
    }
  }

  return 'Neutral';
}

export function detectExternalStructure(candles: Candle[]): StructureResult['external'] {
  if (candles.length < 20) {
    return 'Neutral';
  }

  const { highs, lows } = collectSwingPoints(candles);
  const latestHigh = highs[highs.length - 1];
  const previousHigh = highs[highs.length - 2];
  const latestLow = lows[lows.length - 1];
  const previousLow = lows[lows.length - 2];

  if (!latestHigh || !previousHigh || !latestLow || !previousLow) {
    return 'Neutral';
  }

  if (latestHigh.price > previousHigh.price && latestLow.price > previousLow.price) {
    return 'Bullish';
  }

  if (latestHigh.price < previousHigh.price && latestLow.price < previousLow.price) {
    return 'Bearish';
  }

  return 'Neutral';
}

export function detectEqualHighsAndLows(candles: Candle[]): EqualLevelsResult {
  if (candles.length < 2) {
    return { equalHigh: false, equalLow: false, level: null };
  }

  const current = candles[candles.length - 1];
  const previous = candles[candles.length - 2];
  const tolerance = Math.max(0.25, Math.abs(current.high - current.low) * 0.01);

  return {
    equalHigh: Math.abs(current.high - previous.high) <= tolerance,
    equalLow: Math.abs(current.low - previous.low) <= tolerance,
    level: current.high === previous.high ? current.high : null,
  };
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
