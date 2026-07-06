type SmcCardProps = {
  title: string;
  status: string;
  description: string;
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

export default function SmcCard({ title, status, description }: SmcCardProps) {
  return (
    <article
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
        <h3 style={{ margin: 0, fontSize: "1rem", color: "#f8d84a" }}>{title}</h3>
        <span
          style={{
            ...getBadgeStyle(status),
            padding: "6px 10px",
            borderRadius: "999px",
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {status}
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
        {description}
      </p>
    </article>
  );
}
