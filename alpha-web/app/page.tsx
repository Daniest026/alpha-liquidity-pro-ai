"use client";

import { useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [trend] = useState("Neutral");
  const [bos] = useState("Waiting");
  const [choch] = useState("Waiting");
  const [liquidity] = useState("Waiting");
  const [orderBlock] = useState("None");
  const [fairValueGap] = useState("None");
  const [bosStatus] = useState("Waiting");
  const [chochStatus] = useState("Waiting");
  const [liquiditySweepStatus] = useState("Waiting");
  const [orderBlockBias] = useState("Waiting");
  const [fairValueGapStatus] = useState("Waiting");
  const [premiumDiscountStatus] = useState("Waiting");

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

  const marketStatus = [
    { label: "Trend", value: trend, level: 0 },
    { label: "BOS", value: bos, level: 1 },
    { label: "CHoCH", value: choch, level: 2 },
    { label: "Liquidity", value: liquidity, level: 3 },
    { label: "Order Block", value: orderBlock, level: 4 },
    { label: "Fair Value Gap", value: fairValueGap, level: 5 },
  ];

  const getBadgeStyle = (value: string) => {
    switch (value) {
      case "Bullish":
      case "Detected":
      case "Open":
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
      case "Premium":
      case "Discount":
      case "Equilibrium":
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

  const smartMoneyCards = [
    {
      title: "Break of Structure (BOS)",
      status: bosStatus,
      description: "Monitor structural breaks that confirm a shift in directional intent.",
    },
    {
      title: "Change of Character (CHoCH)",
      status: chochStatus,
      description: "Detect subtle transitions that often precede a larger market reversal.",
    },
    {
      title: "Liquidity Sweep",
      status: liquiditySweepStatus,
      description: "Identify engineered sweeps that trap participants before the next move.",
    },
    {
      title: "Order Block",
      status: orderBlockBias,
      description: "Track institutional demand and supply zones that can anchor future price action.",
    },
    {
      title: "Fair Value Gap",
      status: fairValueGapStatus,
      description: "Highlight imbalance zones where price often seeks efficient rebalancing.",
    },
    {
      title: "Premium / Discount Zone",
      status: premiumDiscountStatus,
      description: "Map value areas to determine whether price is operating at a premium or discount.",
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
              {marketStatus.map((item) => (
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

          <div
            style={{
              marginBottom: "28px",
              background: "#050505",
              border: "1px solid rgba(255, 215, 0, 0.3)",
              borderRadius: "22px",
              padding: "22px",
              boxShadow: "0 14px 38px rgba(0, 0, 0, 0.35)",
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
              <h2
                style={{
                  margin: 0,
                  fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
                  color: "#FFD700",
                }}
              >
                Smart Money Concepts Engine
              </h2>
              <span
                style={{
                  color: "#f8d84a",
                  fontSize: "0.8rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                }}
              >
                Phase 3.2
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "16px",
              }}
            >
              {smartMoneyCards.map((card) => (
                <article
                  key={card.title}
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 215, 0, 0.2)",
                    borderRadius: "18px",
                    padding: "18px",
                    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: "1rem", color: "#f8d84a" }}>{card.title}</h3>
                    <span
                      style={{
                        ...getBadgeStyle(card.status),
                        padding: "6px 10px",
                        borderRadius: "999px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {card.status}
                    </span>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#d8d8d8",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

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
