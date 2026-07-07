import { Candle } from '../lib/types';
import { EngineResult } from './core';

export interface OrderBlock {
  type: 'Bullish' | 'Bearish';
  price: number;
  candleIndex: number;
}

export interface OrderBlockResult extends EngineResult {
  orderBlock: OrderBlock | null;
}

export function detectOrderBlock(candles: Candle[]): OrderBlockResult {
  if (candles.length < 20) {
    return {
      detected: false,
      confidence: 0,
      direction: 'None',
      level: null,
      reason: 'Not enough candles to evaluate order block.',
      orderBlock: null,
    };
  }

  const lastIndex = candles.length - 1;
  const previousCandle = candles[lastIndex - 1];
  const currentCandle = candles[lastIndex];
  const impulse = Math.abs(currentCandle.close - currentCandle.open);
  const previousRange = Math.abs(previousCandle.high - previousCandle.low);

  if (previousCandle.close < previousCandle.open && currentCandle.close > currentCandle.open && impulse > previousRange * 0.4) {
    return {
      detected: true,
      confidence: 85,
      direction: 'Bullish',
      level: previousCandle.close,
      reason: 'A bullish order block formed after a bearish impulse and was confirmed by a strong reversal.',
      orderBlock: {
        type: 'Bullish',
        price: previousCandle.close,
        candleIndex: lastIndex - 1,
      },
    };
  }

  if (previousCandle.close > previousCandle.open && currentCandle.close < currentCandle.open && impulse > previousRange * 0.4) {
    return {
      detected: true,
      confidence: 85,
      direction: 'Bearish',
      level: previousCandle.close,
      reason: 'A bearish order block formed after a bullish impulse and was confirmed by a strong reversal.',
      orderBlock: {
        type: 'Bearish',
        price: previousCandle.close,
        candleIndex: lastIndex - 1,
      },
    };
  }

  return {
    detected: false,
    confidence: 0,
    direction: 'Neutral',
    level: null,
    reason: 'No order block detected.',
    orderBlock: null,
  };
}
