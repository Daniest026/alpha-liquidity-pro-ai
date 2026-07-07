"use client";

import { useEffect, useMemo, useState } from "react";
import AiDecisionCard from "../components/AiDecisionCard";
import AnalysisPanel from "../components/AnalysisPanel";
import Header from "../components/Header";
import MarketStatus from "../components/MarketStatus";
import SmcEngine from "../components/SmcEngine";
import TradingControlPanel from "../components/TradingControlPanel";
import type { AiDecision } from "../engine/aiDecision";
import { getInitialSmcState } from "../lib/smc";
import { analysisService } from "../services/analysisService";

export default function Home() {
  const [smcState, setSmcState] = useState(() => getInitialSmcState());
  const [analysisResult, setAnalysisResult] = useState<{
    symbol: string;
    timeframe: string;
    totalCandles: number;
    analysis: AiDecision;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  const applyAnalysisResult = (result: {
    symbol: string;
    timeframe: string;
    totalCandles: number;
    analysis: AiDecision;
  }) => {
    const normalizedTrend = (() => {
      switch (result.analysis.trend) {
        case "Strong Bullish":
        case "Bullish":
          return "Bullish";
        case "Strong Bearish":
        case "Bearish":
          return "Bearish";
        default:
          return "Neutral";
      }
    })();

    const bosStatus = result.analysis.bosDirection === "Bullish" ? "Bullish" : result.analysis.bosDirection === "Bearish" ? "Bearish" : "Waiting";
    const chochStatus = result.analysis.chochDirection === "Bullish" ? "Bullish" : result.analysis.chochDirection === "Bearish" ? "Bearish" : "Waiting";
    const liquidityStatus = result.analysis.liquidityDirection === "Bullish" ? "Bullish" : result.analysis.liquidityDirection === "Bearish" ? "Bearish" : "Waiting";
    const orderBlockStatus = result.analysis.orderBlockDirection === "Bullish" ? "Bullish" : result.analysis.orderBlockDirection === "Bearish" ? "Bearish" : "Waiting";
    const fairValueGapStatus = result.analysis.fairValueGapDirection === "Bullish" ? "Open" : result.analysis.fairValueGapDirection === "Bearish" ? "Open" : "None";

    setSmcState({
      trend: normalizedTrend,
      bos: bosStatus,
      choch: chochStatus,
      liquidity: liquidityStatus,
      orderBlock: orderBlockStatus,
      fairValueGap: fairValueGapStatus,
    });
    setAnalysisResult(result);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadMarketState() {
      setIsAnalyzing(true);

      try {
        const result = await analysisService.analyze("XAUUSD", "M15");

        if (!isMounted) {
          return;
        }

        applyAnalysisResult(result);
      } catch {
        if (isMounted) {
          setSmcState(getInitialSmcState());
          setAnalysisResult(null);
        }
      } finally {
        if (isMounted) {
          setIsAnalyzing(false);
        }
      }
    }

    void loadMarketState();

    return () => {
      isMounted = false;
    };
  }, []);

  const smcCards = useMemo(
    () => [
      {
        title: "Break of Structure (BOS)",
        status: smcState.bos,
        description: "Monitor structural breaks that confirm a shift in directional intent.",
      },
      {
        title: "Change of Character (CHoCH)",
        status: smcState.choch,
        description: "Detect subtle transitions that often precede a larger market reversal.",
      },
      {
        title: "Liquidity Sweep",
        status: smcState.liquidity,
        description: "Identify engineered sweeps that trap participants before the next move.",
      },
      {
        title: "Order Block",
        status: smcState.orderBlock,
        description: "Track institutional demand and supply zones that can anchor future price action.",
      },
      {
        title: "Fair Value Gap",
        status: smcState.fairValueGap,
        description: "Highlight imbalance zones where price often seeks efficient rebalancing.",
      },
      {
        title: "Premium / Discount Zone",
        status: "Waiting",
        description: "Map value areas to determine whether price is operating at a premium or discount.",
      },
    ],
    [smcState.bos, smcState.choch, smcState.fairValueGap, smcState.liquidity, smcState.orderBlock],
  );

  const cards = [
    {
      title: "Market Structure",
      description: "Identify trend phases, swing levels, and market context with clarity.",
      badge: "Core",
    },
    {
      title: "Liquidity",
      description: "Track where buying and selling pressure is concentrated in real time.",
      badge: "Flow",
    },
    {
      title: "Order Block",
      description: "Highlight high-impact zones that may influence the next directional move.",
      badge: "Zone",
    },
    {
      title: "Fair Value Gap",
      description: "Spot inefficiencies where price may seek to rebalance with precision.",
      badge: "Signal",
    },
    {
      title: "Premium / Discount",
      description: "Assess value areas and relative positioning before taking action.",
      badge: "Bias",
    },
    {
      title: "AI Trade Signal",
      description: "Receive intelligent guidance built from market structure and liquidity analysis.",
      badge: "AI",
    },
  ];

  return (
    <>
      <Header />
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0B0B0B 0%, #161616 100%)",
          color: "#FFD700",
          fontFamily: "Arial, sans-serif",
          padding: "32px 20px 60px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <section style={{ maxWidth: "1200px", width: "100%" }}>
          <MarketStatus
            trend={smcState.trend}
            bos={smcState.bos}
            choch={smcState.choch}
            liquidity={smcState.liquidity}
            orderBlock={smcState.orderBlock}
            fairValueGap={smcState.fairValueGap}
          />

          <SmcEngine cards={smcCards} />

          <AiDecisionCard decision={analysisResult?.analysis ?? null} loading={isAnalyzing} />
          <TradingControlPanel onAnalysis={applyAnalysisResult} />
          <AnalysisPanel analysis={analysisResult} />

          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                margin: 0,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "#f8d84a",
                fontSize: "0.8rem",
              }}
            >
              Alpha Liquidity Pro AI
            </p>
            <h1
              style={{
                margin: "8px 0 10px",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.1,
              }}
            >
              Precision trading intelligence for modern markets.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: "760px",
                color: "#e6e6e6",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              Monitor liquidity zones, institutional concepts, and smart entry signals in a clean,
              professional workspace.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "18px",
            }}
          >
            {cards.map((card) => (
              <article
                key={card.title}
                style={{
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 215, 0, 0.22)",
                  borderRadius: "18px",
                  padding: "20px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.78rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      color: "#f8d84a",
                    }}
                  >
                    {card.badge}
                  </span>
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#FFD700",
                    }}
                  />
                </div>
                <h2 style={{ margin: "0 0 8px", fontSize: "1.1rem" }}>{card.title}</h2>
                <p style={{ margin: 0, color: "#d8d8d8", fontSize: "0.95rem", lineHeight: 1.7 }}>
                  {card.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
