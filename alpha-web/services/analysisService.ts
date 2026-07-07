import { analyzeMarket } from '../engine/aiDecision';
import { detectBreakOfStructure } from '../engine/bos';
import { detectChangeOfCharacter } from '../engine/choch';
import { detectFairValueGap } from '../engine/fairValueGap';
import { detectLiquiditySweep } from '../engine/liquidity';
import { detectOrderBlock } from '../engine/orderBlock';
import { detectTrend } from '../engine/trend';
import { MockMarketAdapter, type MarketAdapter } from '../adapters/marketAdapter';
import { RealMarketAdapter } from '../adapters/realMarketAdapter';
import { MARKET_PROVIDER, MarketProviderType } from '../config/market';
import type { MarketData } from '../lib/types';

class AnalysisService {
  private readonly adapter: MarketAdapter;

  constructor(adapter?: MarketAdapter) {
    this.adapter = adapter ?? AnalysisService.createAdapter();
  }

  private static createAdapter(): MarketAdapter {
    if (MARKET_PROVIDER.provider === MarketProviderType.REAL) {
      return new RealMarketAdapter();
    }

    return new MockMarketAdapter();
  }

  async analyze(symbol: string, timeframe: string) {
    const candles = await this.adapter.getCandles(symbol, timeframe, MARKET_PROVIDER.defaultLimit);
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
