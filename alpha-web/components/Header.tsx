export default function Header() {
  return (
    <header
      style={{
        background: "#0B0B0B",
        color: "#FFD700",
        padding: "20px",
        textAlign: "center",
        borderBottom: "2px solid #FFD700",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "clamp(1.5rem, 2.5vw, 2rem)" }}>
        🤖 Alpha Liquidity Pro AI
      </h1>
      <p style={{ margin: "8px 0 0", fontSize: "1rem" }}>
        Professional Smart Money Concept Dashboard
      </p>
    </header>
  );
}
