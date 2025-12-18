import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

export default function Nestly() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNestlyProducts() {
      try {
        const res = await fetch(`${apiBase}/nestly/listings/get.php`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Failed to load Nestly products", err);
        setError("Failed to load Nestly products.");
      } finally {
        setLoading(false);
      }
    }

    fetchNestlyProducts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 className="pixel-font" style={{ marginBottom: "1rem" }}>
        Nestly Listings
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>No listings available.</p>
      )}

      <div
        style={{
          display: "grid",
          gap: "1.5rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          marginTop: "1rem",
        }}
      >
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/nestly/${encodeURIComponent(p.id)}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}
