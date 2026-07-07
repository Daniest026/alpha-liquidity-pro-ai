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

  const recentHighs = candles.slice(-10).map((candle) => candle.high);
  const recentLows = candles.slice(-10).map((candle) => candle.low);

  const previousLowerHigh = recentHighs[recentHighs.length - 2];
  const previousHigherLow = recentLows[recentLows.length - 2];

  if (latestCandle.close > previousLowerHigh) {
    return {
      detected: true,
      confidence: 75,
      direction: 'Bullish',
      level: previousLowerHigh,
      reason: 'Price broke above previous lower high.',
    };
  }

  if (latestCandle.close < previousHigherLow) {
    return {
      detected: true,
      confidence: 75,
      direction: 'Bearish',
      level: previousHigherLow,
      reason: 'Price broke below previous higher low.',
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
