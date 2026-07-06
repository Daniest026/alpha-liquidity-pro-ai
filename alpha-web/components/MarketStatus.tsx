import type { BOS, CHoCH, FairValueGap, Liquidity, OrderBlock, Trend } from "../lib/smc";

type MarketStatusProps = {
  trend: Trend["value"];
  bos: BOS["value"];
  choch: CHoCH["value"];
  liquidity: Liquidity["value"];
  orderBlock: OrderBlock["value"];
  fairValueGap: FairValueGap["value"];
};

const getBadgeStyle = (value: string) => {
  switch (value) {
    case "Bullish":
    case "Open":
    case "Detected":
      return {
        background: "rgba(34, 197, 94, 0.16)",
        color: "#4ade80",
        border: "1px solid rgba(74, 222, 128, 0.35)",
      };
    case "Bearish":
      return {
        background: "rgba(239, 68, 68, 0.16)",
        color: "#f87171",
        border: "1px solid rgba(248, 113, 113, 0.35)",
      };
    case "Neutral":
      return {
        background: "rgba(255, 215, 0, 0.16)",
        color: "#FFD700",
        border: "1px solid rgba(255, 215, 0, 0.3)",
      };
    default:
      return {
        background: "rgba(255, 255, 255, 0.08)",
        color: "#c7c7c7",
        border: "1px solid rgba(255, 255, 255, 0.12)",
      };
  }
};

export default function MarketStatus({
  trend,
  bos,
  choch,
  liquidity,
  orderBlock,
  fairValueGap,
}: MarketStatusProps) {
  const rows = [
    { label: "Trend", value: trend, level: 0 },
    { label: "BOS", value: bos, level: 1 },
    { label: "CHoCH", value: choch, level: 2 },
    { label: "Liquidity", value: liquidity, level: 3 },
    { label: "Order Block", value: orderBlock, level: 4 },
    { label: "Fair Value Gap", value: fairValueGap, level: 5 },
  ];

  return (
    <div
      style={{
        marginBottom: "28px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 215, 0, 0.22)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <h2
        style={{
          margin: "0 0 14px",
          fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
          color: "#FFD700",
        }}
      >
        Market Status
      </h2>
      <div style={{ display: "grid", gap: "10px" }}>
        {rows.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              padding: "12px 14px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 215, 0, 0.12)",
              paddingLeft: `${14 + item.level * 16}px`,
            }}
          >
            <span style={{ fontWeight: 600, color: "#f8d84a" }}>{item.label}</span>
            <span
              style={{
                ...getBadgeStyle(item.value),
                padding: "6px 10px",
                borderRadius: "999px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
