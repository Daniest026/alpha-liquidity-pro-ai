import SmcCard from "./SmcCard";

type SmcCardData = {
  title: string;
  status: string;
  description: string;
};

type SmcEngineProps = {
  cards: SmcCardData[];
};

export default function SmcEngine({ cards }: SmcEngineProps) {
  return (
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
        {cards.map((card) => (
          <SmcCard key={card.title} title={card.title} status={card.status} description={card.description} />
        ))}
      </div>
    </div>
  );
}
