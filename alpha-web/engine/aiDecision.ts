import { Candle } from '../lib/types';
import { detectBreakOfStructure } from './bos';
import { detectChangeOfCharacter } from './choch';
import { detectFairValueGap } from './fairValueGap';
import { detectLiquiditySweep } from './liquidity';
import { detectOrderBlock } from './orderBlock';
import { detectTrend } from './trend';

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
}

export function analyzeMarket(candles: Candle[]): AiDecision {
  const trend = detectTrend(candles);
  const bos = detectBreakOfStructure(candles);
  const choch = detectChangeOfCharacter(candles);
  const liquidity = detectLiquiditySweep(candles);
  const orderBlock = detectOrderBlock(candles);
  const fairValueGap = detectFairValueGap(candles);

  const reasons: string[] = [];
  let confidence = 0;

  if (trend === 'Strong Bullish' || trend === 'Bullish') {
    confidence += 20;
    reasons.push(`Trend: ${trend}`);
  } else if (trend === 'Strong Bearish' || trend === 'Bearish') {
    confidence += 20;
    reasons.push(`Trend: ${trend}`);
  } else {
    reasons.push(`Trend: ${trend}`);
  }

  if (bos.detected) {
    confidence += 20;
    reasons.push('Break of structure detected.');
  }

  if (choch.detected) {
    confidence += 15;
    reasons.push(choch.reason);
  }

  if (liquidity.detected) {
    confidence += 15;
    reasons.push(liquidity.reason);
  }

  if (orderBlock.detected) {
    confidence += 15;
    reasons.push(orderBlock.reason);
  }

  if (fairValueGap.detected) {
    confidence += 15;
    reasons.push(fairValueGap.reason);
  }

  const decision: AiDecision = {
    decision: 'WAIT',
    confidence,
    reasons,
    trend,
    bos: bos.detected,
    choch: choch.detected,
    liquidity: liquidity.detected,
    orderBlock: orderBlock.detected,
    fairValueGap: fairValueGap.detected,
  };

  if (confidence >= 80) {
    decision.decision = trend === 'Strong Bearish' || trend === 'Bearish' ? 'SELL' : 'BUY';
  }

  return decision;
}
