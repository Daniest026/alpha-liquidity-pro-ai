import { Candle } from '../lib/types';
import { EngineResult } from './core';

export interface FairValueGap {
  type: 'Bullish' | 'Bearish';
  top: number;
  bottom: number;
  filled: boolean;
}

export interface FairValueGapResult extends EngineResult {
  gap: FairValueGap | null;
}

export function detectFairValueGap(candles: Candle[]): FairValueGapResult {
  if (candles.length < 3) {
    return {
      detected: false,
      confidence: 0,
      direction: 'None',
      level: null,
      reason: 'Not enough candles to evaluate fair value gap.',
      gap: null,
    };
  }

  const currentCandle = candles[candles.length - 1];
  const referenceCandle = candles[candles.length - 3];

  const bullishGap = currentCandle.low > referenceCandle.high;
  const bearishGap = currentCandle.high < referenceCandle.low;

  if (bullishGap) {
    const filled = currentCandle.close <= referenceCandle.high;

    return {
      detected: true,
      confidence: 85,
      direction: 'Bullish',
      level: referenceCandle.high,
      reason: filled ? 'Gap already filled.' : 'Bullish Fair Value Gap detected.',
      gap: {
        type: 'Bullish',
        top: referenceCandle.high,
        bottom: referenceCandle.low,
        filled,
      },
    };
  }

  if (bearishGap) {
    const filled = currentCandle.close >= referenceCandle.low;

    return {
      detected: true,
      confidence: 85,
      direction: 'Bearish',
      level: referenceCandle.low,
      reason: filled ? 'Gap already filled.' : 'Bearish Fair Value Gap detected.',
      gap: {
        type: 'Bearish',
        top: referenceCandle.high,
        bottom: referenceCandle.low,
        filled,
      },
    };
  }

  return {
    detected: false,
    confidence: 0,
    direction: 'Neutral',
    level: null,
    reason: 'No fair value gap detected.',
    gap: null,
  };
}
