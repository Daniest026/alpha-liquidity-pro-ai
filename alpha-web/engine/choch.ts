import { Candle } from '../lib/types';
import { EngineResult } from './core';

export function detectChangeOfCharacter(candles: Candle[]): EngineResult {
  if (candles.length < 20) {
    return {
      detected: false,
      confidence: 0,
      direction: 'None',
      level: null,
      reason: 'Not enough candles to evaluate change of character.',
    };
  }

  const latestCandle = candles[candles.length - 1];
  const previousCandle = candles[candles.length - 2];
  const previousHigh = previousCandle.high;
  const previousLow = previousCandle.low;

  if (latestCandle.close > previousHigh && previousCandle.close < previousHigh) {
    return {
      detected: true,
      confidence: 75,
      direction: 'Bullish',
      level: previousHigh,
      reason: 'Price broke above the previous swing high, signaling a bullish change of character.',
    };
  }

  if (latestCandle.close < previousLow && previousCandle.close > previousLow) {
    return {
      detected: true,
      confidence: 75,
      direction: 'Bearish',
      level: previousLow,
      reason: 'Price broke below the previous swing low, signaling a bearish change of character.',
    };
  }

  return {
    detected: false,
    confidence: 0,
    direction: 'Neutral',
    level: null,
    reason: 'No change of character detected.',
  };
}
