import { Candle } from '../lib/types';
import {
  detectBreakOfStructure,
  detectEqualHighsAndLows,
  detectExternalStructure,
  detectInternalStructure,
  findSwingHigh,
  findSwingLow,
} from './bos';
import { detectChangeOfCharacter } from './choch';
import { detectFairValueGap } from './fairValueGap';
import { detectLiquiditySweep } from './liquidity';
import { detectOrderBlock } from './orderBlock';
import { detectMarketBias, detectPremiumDiscount, detectTrend } from './trend';

export interface AiDecision {
  decision: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;
  reasons: string[];
  trend: string;
  bos: boolean;
  choch: boolean;
  liquidity: boolean;
  orderBlock: boolean;
  fairValueGap: boolean;
  bosDirection: 'Bullish' | 'Bearish' | 'None';
  chochDirection: 'Bullish' | 'Bearish' | 'Neutral' | 'None';
  liquidityDirection: 'Bullish' | 'Bearish' | 'Neutral' | 'None';
  orderBlockDirection: 'Bullish' | 'Bearish' | 'Neutral' | 'None';
  fairValueGapDirection: 'Bullish' | 'Bearish' | 'Neutral' | 'None';
  internalStructure: 'Bullish' | 'Bearish' | 'Neutral';
  externalStructure: 'Bullish' | 'Bearish' | 'Neutral';
  equalHigh: boolean;
  equalLow: boolean;
  premiumDiscount: 'Premium' | 'Discount' | 'Fair';
  marketBias: 'Bullish' | 'Bearish' | 'Neutral';
  explanation: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskRewardRatio: number;
  invalidationLevel: number;
}

interface Confirmation {
  factor: string;
  direction: 'Bullish' | 'Bearish';
  detail: string;
}

function roundTo(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

function calculateAtr(candles: Candle[], period = 14): number {
  if (candles.length < period + 1) {
    return 0;
  }

  const sample = candles.slice(-period);
  const trueRanges = sample.slice(1).map((candle, index) => {
    const previous = sample[index];
    const highLow = candle.high - candle.low;
    const highClose = Math.abs(candle.high - previous.close);
    const lowClose = Math.abs(candle.low - previous.close);
    return Math.max(highLow, highClose, lowClose);
  });

  const sum = trueRanges.reduce((total, range) => total + range, 0);
  return sum / trueRanges.length;
}

function buildTradePlan(candles: Candle[], decision: 'BUY' | 'SELL' | 'WAIT', atr: number) {
  const latest = candles[candles.length - 1];
  const recentSwingHigh = findSwingHigh(candles);
  const recentSwingLow = findSwingLow(candles);
  const recentRange = candles.slice(-20).reduce((max, candle) => Math.max(max, candle.high - candle.low), 0);
  const riskBuffer = Math.max(atr * 0.6, recentRange * 0.12, 0.25);

  if (decision === 'BUY') {
    const entryPrice = roundTo(latest.close + atr * 0.35);
    const stopLoss = roundTo(Math.min(latest.low, recentSwingLow?.price ?? latest.low) - riskBuffer);
    const takeProfit = roundTo(entryPrice + (entryPrice - stopLoss) * 2);
    const riskRewardRatio = roundTo(Math.abs((takeProfit - entryPrice) / (entryPrice - stopLoss)));
    const invalidationLevel = roundTo(Math.min(latest.low, recentSwingLow?.price ?? latest.low));

    return { entryPrice, stopLoss, takeProfit, riskRewardRatio, invalidationLevel };
  }

  if (decision === 'SELL') {
    const entryPrice = roundTo(latest.close - atr * 0.35);
    const stopLoss = roundTo(Math.max(latest.high, recentSwingHigh?.price ?? latest.high) + riskBuffer);
    const takeProfit = roundTo(entryPrice - (stopLoss - entryPrice) * 2);
    const riskRewardRatio = roundTo(Math.abs((entryPrice - takeProfit) / (stopLoss - entryPrice)));
    const invalidationLevel = roundTo(Math.max(latest.high, recentSwingHigh?.price ?? latest.high));

    return { entryPrice, stopLoss, takeProfit, riskRewardRatio, invalidationLevel };
  }

  return {
    entryPrice: roundTo(latest.close),
    stopLoss: roundTo(latest.close),
    takeProfit: roundTo(latest.close),
    riskRewardRatio: 0,
    invalidationLevel: roundTo(latest.close),
  };
}

export function analyzeMarket(candles: Candle[]): AiDecision {
  if (candles.length < 200) {
    return {
      decision: 'WAIT',
      confidence: 0,
      reasons: ['Not enough candles to produce a compliant SMC signal.'],
      trend: 'Neutral',
      bos: false,
      choch: false,
      liquidity: false,
      orderBlock: false,
      fairValueGap: false,
      bosDirection: 'None',
      chochDirection: 'None',
      liquidityDirection: 'None',
      orderBlockDirection: 'None',
      fairValueGapDirection: 'None',
      internalStructure: 'Neutral',
      externalStructure: 'Neutral',
      equalHigh: false,
      equalLow: false,
      premiumDiscount: 'Fair',
      marketBias: 'Neutral',
      explanation: 'The engine requires the full 200-candle dataset before producing a trade decision.',
      entryPrice: 0,
      stopLoss: 0,
      takeProfit: 0,
      riskRewardRatio: 0,
      invalidationLevel: 0,
    };
  }

  const trend = detectTrend(candles);
  const bos = detectBreakOfStructure(candles);
  const choch = detectChangeOfCharacter(candles);
  const liquidity = detectLiquiditySweep(candles);
  const orderBlock = detectOrderBlock(candles);
  const fairValueGap = detectFairValueGap(candles);
  const internalStructure = detectInternalStructure(candles);
  const externalStructure = detectExternalStructure(candles);
  const equalLevels = detectEqualHighsAndLows(candles);
  const premiumDiscount = detectPremiumDiscount(candles);
  const marketBias = detectMarketBias(candles);
  const atr = calculateAtr(candles);

  const confirmations: Confirmation[] = [];
  const reasons: string[] = [];
  const bullishConfirmations: Confirmation[] = [];
  const bearishConfirmations: Confirmation[] = [];

  const pushConfirmation = (factor: string, direction: 'Bullish' | 'Bearish', detail: string) => {
    const confirmation = { factor, direction, detail };
    confirmations.push(confirmation);
    if (direction === 'Bullish') {
      bullishConfirmations.push(confirmation);
    } else {
      bearishConfirmations.push(confirmation);
    }
  };

  if (bos.detected) {
    pushConfirmation('BOS', bos.direction === 'Bullish' ? 'Bullish' : 'Bearish', bos.direction === 'Bullish'
      ? `BOS confirmed a bullish break above the prior swing high at ${roundTo(bos.breakPrice ?? 0)}.`
      : `BOS confirmed a bearish break below the prior swing low at ${roundTo(bos.breakPrice ?? 0)}.`);
  } else {
    reasons.push('BOS did not confirm a structural break.');
  }

  if (choch.detected) {
    pushConfirmation('CHoCH', choch.direction === 'Bullish' ? 'Bullish' : 'Bearish', choch.reason);
  } else {
    reasons.push('CHoCH did not confirm a directional shift.');
  }

  if (internalStructure !== 'Neutral') {
    pushConfirmation('Internal Structure', internalStructure === 'Bullish' ? 'Bullish' : 'Bearish', `Internal structure is ${internalStructure.toLowerCase()} and favors continuation.`);
  } else {
    reasons.push('Internal structure remained neutral.');
  }

  if (externalStructure !== 'Neutral') {
    pushConfirmation('External Structure', externalStructure === 'Bullish' ? 'Bullish' : 'Bearish', `External structure is ${externalStructure.toLowerCase()}.`);
  } else {
    reasons.push('External structure remained neutral.');
  }

  if (liquidity.detected) {
    pushConfirmation('Liquidity Sweep', liquidity.direction === 'Bullish' ? 'Bullish' : 'Bearish', liquidity.reason);
  } else {
    reasons.push('No liquidity sweep was detected.');
  }

  if (orderBlock.detected) {
    pushConfirmation('Order Block', orderBlock.direction === 'Bullish' ? 'Bullish' : 'Bearish', orderBlock.reason);
  } else {
    reasons.push('No valid order block was detected.');
  }

  if (fairValueGap.detected) {
    pushConfirmation('Fair Value Gap', fairValueGap.direction === 'Bullish' ? 'Bullish' : 'Bearish', fairValueGap.reason);
  } else {
    reasons.push('No fair value gap was detected.');
  }

  if (premiumDiscount === 'Discount') {
    pushConfirmation('Premium / Discount', 'Bullish', 'Price is trading below the midpoint of the recent range, indicating discount value.');
  } else if (premiumDiscount === 'Premium') {
    pushConfirmation('Premium / Discount', 'Bearish', 'Price is trading above the midpoint of the recent range, indicating premium value.');
  } else {
    reasons.push('Price is trading near the midpoint of the recent range.');
  }

  if (marketBias === 'Bullish') {
    pushConfirmation('Market Bias', 'Bullish', `The market bias is ${marketBias.toLowerCase()} based on the prevailing trend.`);
  } else if (marketBias === 'Bearish') {
    pushConfirmation('Market Bias', 'Bearish', `The market bias is ${marketBias.toLowerCase()} based on the prevailing trend.`);
  } else {
    reasons.push('Market bias remained neutral.');
  }

  reasons.push(`Trend: ${trend}.`);
  reasons.push(`Current price is ${roundTo(candles[candles.length - 1].close)} with ATR ${roundTo(atr)}.`);

  const bullishCount = bullishConfirmations.length;
  const bearishCount = bearishConfirmations.length;
  const confluenceGap = bullishCount - bearishCount;

  let decision: AiDecision['decision'] = 'WAIT';
  let confidence = 0;
  let explanation = '';

  if (bullishCount >= 5 && bullishCount > bearishCount) {
    decision = 'BUY';
    confidence = Math.min(95, 55 + bullishCount * 6 + Math.max(0, confluenceGap) * 2);
    explanation = `The confluence model generated a BUY signal because ${bullishCount} bullish confirmations aligned against ${bearishCount} bearish confirmations. The structure is bullish, the market is trading in discount value, and the trade plan is built from the actual 200-candle dataset.`;
  } else if (bearishCount >= 5 && bearishCount > bullishCount) {
    decision = 'SELL';
    confidence = Math.min(95, 55 + bearishCount * 6 + Math.max(0, -confluenceGap) * 2);
    explanation = `The confluence model generated a SELL signal because ${bearishCount} bearish confirmations aligned against ${bullishCount} bullish confirmations. The structure is bearish, the market is trading in premium value, and the trade plan is built from the actual 200-candle dataset.`;
  } else {
    confidence = Math.min(70, 35 + Math.max(bullishCount, bearishCount) * 4);
    explanation = `The confluence threshold was not reached. ${bullishCount} bullish confirmations and ${bearishCount} bearish confirmations were observed, so the engine returned WAIT to avoid a premature trade.`;
  }

  confirmations.forEach((confirmation) => {
    reasons.push(`${confirmation.factor}: ${confirmation.detail}`);
  });

  const tradePlan = buildTradePlan(candles, decision, atr);

  const decisionResult: AiDecision = {
    decision,
    confidence,
    reasons,
    trend,
    bos: bos.detected,
    choch: choch.detected,
    liquidity: liquidity.detected,
    orderBlock: orderBlock.detected,
    fairValueGap: fairValueGap.detected,
    bosDirection: bos.direction,
    chochDirection: choch.direction,
    liquidityDirection: liquidity.direction,
    orderBlockDirection: orderBlock.direction,
    fairValueGapDirection: fairValueGap.direction,
    internalStructure,
    externalStructure,
    equalHigh: equalLevels.equalHigh,
    equalLow: equalLevels.equalLow,
    premiumDiscount,
    marketBias,
    explanation,
    entryPrice: tradePlan.entryPrice,
    stopLoss: tradePlan.stopLoss,
    takeProfit: tradePlan.takeProfit,
    riskRewardRatio: tradePlan.riskRewardRatio,
    invalidationLevel: tradePlan.invalidationLevel,
  };

  return decisionResult;
}
