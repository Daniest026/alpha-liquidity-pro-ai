import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeMarket } from './aiDecision.ts';
import type { Candle } from '../lib/types.ts';

function buildCandle(price: number, time: number): Candle {
  return {
    time,
    open: price,
    high: price + 1.2,
    low: price - 1.2,
    close: price,
    volume: 1000,
  };
}

test('analyzeMarket returns a full trade plan with numeric risk metrics', () => {
  const candles: Candle[] = [];
  let price = 100;

  for (let index = 0; index < 200; index += 1) {
    const drift = index % 8 === 0 ? 0.8 : index % 5 === 0 ? -0.4 : 0.1;
    price += drift;
    candles.push(buildCandle(price, index));
  }

  const decision = analyzeMarket(candles);

  assert.ok(['BUY', 'SELL', 'WAIT'].includes(decision.decision));
  assert.ok(Number.isFinite(decision.confidence));
  assert.ok(decision.reasons.length > 0);
  assert.ok(typeof decision.entryPrice === 'number');
  assert.ok(typeof decision.stopLoss === 'number');
  assert.ok(typeof decision.takeProfit === 'number');
  assert.ok(typeof decision.riskRewardRatio === 'number');
  assert.ok(typeof decision.invalidationLevel === 'number');
});
