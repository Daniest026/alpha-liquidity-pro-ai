import type { AiDecision } from "../engine/aiDecision";

type AiDecisionCardProps = {
  decision?: AiDecision | null;
};

const statusChipStyle = (value: string) => {
  switch (value) {
    case "BUY":
      return {
        background: "rgba(34, 197, 94, 0.16)",
        color: "#4ade80",
        border: "1px solid rgba(74, 222, 128, 0.35)",
      };
    case "SELL":
      return {
        background: "rgba(239, 68, 68, 0.16)",
        color: "#f87171",
        border: "1px solid rgba(248, 113, 113, 0.35)",
      };
    default:
      return {
        background: "rgba(255, 215, 0, 0.16)",
        color: "#FFD700",
        border: "1px solid rgba(255, 215, 0, 0.3)",
      };
  }
};

export default function AiDecisionCard({ decision }: AiDecisionCardProps) {
  const activeDecision = decision ?? {
    decision: "WAIT",
    confidence: 0,
    reasons: ["Waiting for market data."],
    trend: "Neutral",
    bos: false,
    choch: false,
    liquidity: false,
    orderBlock: false,
    fairValueGap: false,
  };

  return (
    <section
      style={{
        marginBottom: "28px",
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(255, 215, 0, 0.22)",
        borderRadius: "20px",
        padding: "22px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              textTransform: "uppercase",
              letterSpacing: "0.22em",
              color: "#f8d84a",
              fontSize: "0.8rem",
            }}
          >
            AI Decision Engine
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: "clamp(1.2rem, 2vw, 1.45rem)" }}>
            AI Decision
          </h2>
        </div>
        <span
          style={{
            ...statusChipStyle(activeDecision.decision),
            padding: "8px 12px",
            borderRadius: "999px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {activeDecision.decision}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Confidence
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.confidence}%
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Trend
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.trend}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            BOS
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.bos ? "Detected" : "Waiting"}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            CHoCH
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.choch ? "Detected" : "Waiting"}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Liquidity Sweep
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.liquidity ? "Detected" : "Waiting"}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Order Block
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.orderBlock ? "Detected" : "Waiting"}
          </div>
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 215, 0, 0.14)",
          }}
        >
          <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
            Fair Value Gap
          </div>
          <div style={{ marginTop: "4px", fontSize: "1.05rem", fontWeight: 700 }}>
            {activeDecision.fairValueGap ? "Detected" : "Waiting"}
          </div>
        </div>
      </div>

      <div
        style={{
          padding: "14px 15px",
          borderRadius: "14px",
          background: "rgba(255, 255, 255, 0.04)",
          border: "1px solid rgba(255, 215, 0, 0.14)",
        }}
      >
        <div style={{ color: "#f8d84a", fontSize: "0.8rem", textTransform: "uppercase" }}>
          Reasons
        </div>
        <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#d8d8d8", lineHeight: 1.6 }}>
          {activeDecision.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
