"use client";

import { useEffect, useState } from "react";
import { analysisService } from "../services/analysisService";

type AnalysisPanelState = {
  symbol: string;
  timeframe: string;
  totalCandles: number;
  analysis: {
    decision: "BUY" | "SELL" | "WAIT";
    confidence: number;
    reasons: string[];
    trend: string;
  } | null;
  lastUpdated: string;
};

type AnalysisPanelProps = {
  analysis?: {
    symbol: string;
    timeframe: string;
    totalCandles: number;
    analysis: {
      decision: "BUY" | "SELL" | "WAIT";
      confidence: number;
      reasons: string[];
      trend: string;
    };
  } | null;
};

const getDecisionColor = (decision: string) => {
  switch (decision) {
    case "BUY":
      return "#4ade80";
    case "SELL":
      return "#f87171";
    default:
      return "#FFD700";
  }
};

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  const [state, setState] = useState<AnalysisPanelState>({
    symbol: "XAUUSD",
    timeframe: "M15",
    totalCandles: 0,
    analysis: null,
    lastUpdated: "Waiting for analysis",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAnalysis() {
      setLoading(true);
      try {
        const result = await analysisService.analyze("XAUUSD", "M15");
        if (!isMounted) {
          return;
        }

        setState({
          symbol: result.symbol,
          timeframe: result.timeframe,
          totalCandles: result.totalCandles,
          analysis: result.analysis,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState((current) => ({
          ...current,
          analysis: null,
          lastUpdated: "Analysis failed",
        }));
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadAnalysis();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    setState({
      symbol: analysis.symbol,
      timeframe: analysis.timeframe,
      totalCandles: analysis.totalCandles,
      analysis: analysis.analysis,
      lastUpdated: new Date().toLocaleTimeString(),
    });
    setLoading(false);
  }, [analysis]);

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
            Analysis Service
          </p>
          <h2 style={{ margin: "6px 0 0", fontSize: "clamp(1.2rem, 2vw, 1.45rem)" }}>
            Market Analysis
          </h2>
        </div>
        {loading ? (
          <span
            style={{
              color: "#FFD700",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Loading...
          </span>
        ) : (
          <span
            style={{
              color: getDecisionColor(state.analysis?.decision ?? "WAIT"),
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {state.analysis?.decision ?? "WAIT"}
          </span>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <div style={cardStyle}>
          <div style={labelStyle}>Symbol</div>
          <div style={valueStyle}>{state.symbol}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Timeframe</div>
          <div style={valueStyle}>{state.timeframe}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Trend</div>
          <div style={valueStyle}>{state.analysis?.trend ?? "Neutral"}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Decision</div>
          <div style={{ ...valueStyle, color: getDecisionColor(state.analysis?.decision ?? "WAIT") }}>
            {state.analysis?.decision ?? "WAIT"}
          </div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Confidence</div>
          <div style={valueStyle}>{state.analysis?.confidence ?? 0}%</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Total Candles</div>
          <div style={valueStyle}>{state.totalCandles}</div>
        </div>
        <div style={cardStyle}>
          <div style={labelStyle}>Last Updated</div>
          <div style={valueStyle}>{state.lastUpdated}</div>
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
        {loading ? (
          <p style={{ margin: "8px 0 0", color: "#d8d8d8" }}>Analyzing market structure...</p>
        ) : (
          <ul style={{ margin: "8px 0 0", paddingLeft: "18px", color: "#d8d8d8", lineHeight: 1.6 }}>
            {(state.analysis?.reasons ?? ["Waiting for market data."]).map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

const cardStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "14px",
  background: "rgba(255, 255, 255, 0.04)",
  border: "1px solid rgba(255, 215, 0, 0.14)",
};

const labelStyle: React.CSSProperties = {
  color: "#f8d84a",
  fontSize: "0.8rem",
  textTransform: "uppercase",
};

const valueStyle: React.CSSProperties = {
  marginTop: "4px",
  fontSize: "1.05rem",
  fontWeight: 700,
};
