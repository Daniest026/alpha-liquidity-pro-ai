export interface Trend {
  value: "Neutral" | "Bullish" | "Bearish";
}

export interface BOS {
  value: "Waiting" | "Bullish" | "Bearish";
}

export interface CHoCH {
  value: "Waiting" | "Bullish" | "Bearish";
}

export interface Liquidity {
  value: "Waiting" | "Bullish" | "Bearish";
}

export interface OrderBlock {
  value: "None" | "Waiting" | "Bullish" | "Bearish";
}

export interface FairValueGap {
  value: "None" | "Waiting" | "Open" | "Filled";
}

export interface SmcState {
  trend: Trend["value"];
  bos: BOS["value"];
  choch: CHoCH["value"];
  liquidity: Liquidity["value"];
  orderBlock: OrderBlock["value"];
  fairValueGap: FairValueGap["value"];
}

export function getInitialSmcState(): SmcState {
  return {
    trend: "Neutral",
    bos: "Waiting",
    choch: "Waiting",
    liquidity: "Waiting",
    orderBlock: "None",
    fairValueGap: "None",
  };
}
