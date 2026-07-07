import { Candle } from '../lib/types';
import { EngineResult } from './core';
import { findSwingHigh, findSwingLow } from './bos';

export interface LiquidityLevel {
  price: number;
  type: 'Buy Side' | 'Sell Side';
}

export interface LiquidityResult extends EngineResult {
  liquidity: LiquidityLevel | null;
}

export function detectLiquiditySweep(candles: Candle[]): LiquidityResult {
  if (candles.length < 20) {
    return {
      detected: false,
      confidence: 0,
      direction: 'None',
      level: null,
      reason: 'Not enough candles to evaluate liquidity sweep.',
      liquidity: null,
    };
  }

  const latestCandle = candles[candles.length - 1];
  const previousSwingHigh = findSwingHigh(candles);
  const previousSwingLow = findSwingLow(candles);

  if (previousSwingHigh && latestCandle.high > previousSwingHigh.price && latestCandle.close < previousSwingHigh.price) {
    return {
      detected: true,
      confidence: 80,
      direction: 'Bearish',
      level: previousSwingHigh.price,
      reason: 'Buy-side liquidity was swept as price rejected the prior swing high.',
      liquidity: {
        price: previousSwingHigh.price,
        type: 'Buy Side',
      },
    };
  }

  if (previousSwingLow && latestCandle.low < previousSwingLow.price && latestCandle.close > previousSwingLow.price) {
    return {
      detected: true,
      confidence: 80,
      direction: 'Bullish',
      level: previousSwingLow.price,
      reason: 'Sell-side liquidity was swept as price rejected the prior swing low.',
      liquidity: {
        price: previousSwingLow.price,
        type: 'Sell Side',
      },
    };
  }

  return {
    detected: false,
    confidence: 0,
    direction: 'Neutral',
    level: null,
    reason: 'No liquidity sweep detected.',
    liquidity: null,
  };
}
