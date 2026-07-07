import { analyzeMarket } from '../engine/aiDecision';
import { detectBreakOfStructure } from '../engine/bos';
import { detectChangeOfCharacter } from '../engine/choch';
import { detectFairValueGap } from '../engine/fairValueGap';
import { detectLiquiditySweep } from '../engine/liquidity';
import { detectOrderBlock } from '../engine/orderBlock';
import { detectTrend } from '../engine/trend';
import { MockMarketAdapter, type MarketAdapter } from '../adapters/marketAdapter';
import type { MarketData } from '../lib/types';

class AnalysisService {
  constructor(private readonly adapter: MarketAdapter = new MockMarketAdapter()) {}

  async analyze(symbol: string, timeframe: string) {
    const candles = await this.adapter.getCandles(symbol, timeframe, 1000);
    const marketData: MarketData = {
      symbol,
      timeframe,
      candles,
    };

    const trend = detectTrend(candles);
    const bos = detectBreakOfStructure(candles);
    const choch = detectChangeOfCharacter(candles);
    const liquidity = detectLiquiditySweep(candles);
    const orderBlock = detectOrderBlock(candles);
    const fairValueGap = detectFairValueGap(candles);

    const analysis = analyzeMarket(candles);

    return {
      symbol: marketData.symbol,
      timeframe: marketData.timeframe,
      candles: marketData.candles,
      analysis: {
        ...analysis,
        trend,
        bos: bos.detected,
        choch: choch.detected,
        liquidity: liquidity.detected,
        orderBlock: orderBlock.detected,
        fairValueGap: fairValueGap.detected,
      },
      totalCandles: marketData.candles.length,
    };
  }
}

export const analysisService = new AnalysisService();
