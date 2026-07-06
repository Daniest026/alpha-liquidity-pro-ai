import Header from "../components/Header";
export default function Home() {
  return (
      <>
          <Header />
  )
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0B0B0B",
        color: "#FFD700",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Alpha Liquidity Pro AI</h1>
      <p>Dashboard berhasil dibuat.</p>
      <p>Versi 1.1</p>
    </main>  </>
  );
}
