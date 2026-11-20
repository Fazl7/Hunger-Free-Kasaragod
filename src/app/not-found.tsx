import Link from "next/link";

// Requests outside any locale (rare: the proxy adds /en). Plain HTML, real 404 status.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#FFF8E7", color: "#1E1A17", display: "grid", placeItems: "center", minHeight: "100vh", margin: 0 }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1>Page not found</h1>
          <p><Link href="/en">Go to Hunger Free Kasaragod</Link></p>
        </main>
      </body>
    </html>
  );
}
