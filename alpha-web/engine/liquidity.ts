import { Candle } from '../lib/types';
import { EngineResult } from './core';

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
  const previousCandle = candles[candles.length - 2];

  const previousSwingHigh = Math.max(...candles.slice(-10).map((candle) => candle.high));
  const previousSwingLow = Math.min(...candles.slice(-10).map((candle) => candle.low));

  if (latestCandle.high > previousSwingHigh && latestCandle.close < previousSwingHigh) {
    return {
      detected: true,
      confidence: 80,
      direction: 'Bearish',
      level: previousSwingHigh,
      reason: 'Buy-side liquidity swept.',
      liquidity: {
        price: previousSwingHigh,
        type: 'Buy Side',
      },
    };
  }

  if (latestCandle.low < previousSwingLow && latestCandle.close > previousSwingLow) {
    return {
      detected: true,
      confidence: 80,
      direction: 'Bullish',
      level: previousSwingLow,
      reason: 'Sell-side liquidity swept.',
      liquidity: {
        price: previousSwingLow,
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
