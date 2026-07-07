export enum MarketProviderType {
  MOCK = 'MOCK',
  REAL = 'REAL',
}

export interface MarketProviderConfig {
  provider: MarketProviderType;
  defaultSymbol: string;
  defaultTimeframe: string;
  defaultLimit: number;
}

export const MARKET_PROVIDER: MarketProviderConfig = {
  provider: MarketProviderType.MOCK,
  defaultSymbol: 'XAUUSD',
  defaultTimeframe: 'M15',
  defaultLimit: 200,
};
