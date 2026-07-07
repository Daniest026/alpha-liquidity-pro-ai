"use client";

import { useMemo, useState } from "react";
import type { AiDecision } from "../engine/aiDecision";
import { analysisService } from "../services/analysisService";

type TradingControlPanelProps = {
  onAnalysis: (result: {
    symbol: string;
    timeframe: string;
    totalCandles: number;
    analysis: AiDecision;
  }) => void;
};

const symbols = ["XAUUSD", "EURUSD", "GBPUSD", "USDJPY", "BTCUSD"];
const timeframes = ["M1", "M5", "M15", "M30", "H1", "H4", "D1"];

export default function TradingControlPanel({ onAnalysis }: TradingControlPanelProps) {
  const [selectedSymbol, setSelectedSymbol] = useState("XAUUSD");
  const [selectedTimeframe, setSelectedTimeframe] = useState("M15");
  const [loading, setLoading] = useState(false);

  const buttonStyle = useMemo(
    () => ({
      border: "1px solid rgba(255, 215, 0, 0.3)",
      background: "rgba(255, 215, 0, 0.12)",
      color: "#FFD700",
      padding: "10px 14px",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: 700,
      transition: "all 0.2s ease",
    }),
    [],
  );

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analysisService.analyze(selectedSymbol, selectedTimeframe);
      onAnalysis(result);
    } finally {
      setLoading(false);
    }
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
          flexWrap: "wrap",
          marginBottom: "16px",
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
            Trading Controls
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: "clamp(1.2rem, 2vw, 1.45rem)" }}>
            Control Panel
          </h2>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          marginBottom: "16px",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "6px", color: "#f8d84a" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Symbol
          </span>
          <select
            value={selectedSymbol}
            onChange={(event) => setSelectedSymbol(event.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 215, 0, 0.22)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#fff",
            }}
          >
            {symbols.map((symbol) => (
              <option key={symbol} value={symbol} style={{ color: "#111" }}>
                {symbol}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "6px", color: "#f8d84a" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Timeframe
          </span>
          <select
            value={selectedTimeframe}
            onChange={(event) => setSelectedTimeframe(event.target.value)}
            style={{
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 215, 0, 0.22)",
              background: "rgba(255, 255, 255, 0.04)",
              color: "#fff",
            }}
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe} value={timeframe} style={{ color: "#111" }}>
                {timeframe}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <button type="button" onClick={handleAnalyze} disabled={loading} style={buttonStyle}>
          {loading ? "Analyzing..." : "Analyze Now"}
        </button>
        <button
          type="button"
          onClick={() => {
            void handleAnalyze();
          }}
          disabled={loading}
          style={buttonStyle}
        >
          Refresh
        </button>
      </div>
    </section>
  );
}
