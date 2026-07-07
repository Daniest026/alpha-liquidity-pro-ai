import { analyzeMarket } from '../engine/aiDecision';
import { marketService } from './marketService';

class AnalysisService {
  async analyze(symbol: string, timeframe: string) {
    const marketData = await marketService.getMarketData(symbol, timeframe);
    const result = analyzeMarket(marketData.candles);

    return {
      symbol,
      timeframe,
      totalCandles: marketData.candles.length,
      analysis: result,
    };
  }
}

export const analysisService = new AnalysisService();
