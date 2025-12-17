import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

export default function WhiskDetail() {
  const { id } = useParams(); // e.g. "W3"
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1) Load Whisk products & find this one
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${apiBase}/whisk/menu/get.php`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        const found = Array.isArray(data)
          ? data.find((p) => String(p.id) === String(id))
          : null;

        if (!found) {
          setError("Product not found.");
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error("Failed to load Whisk product", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // 2) Track visit once we actually know the product
  useEffect(() => {
    if (!product) return;

    async function trackVisit() {
      try {
        await fetch(`${apiBase}/marketplace/tracking.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: "whisk",
            productId: product.id,
          }),
        });
      } catch (err) {
        console.error("Failed to track visit", err);
        // We don't block the UI on tracking
      }
    }

    trackVisit();
  }, [product]);

  if (loading) {
    return (
      <div style={{ padding: "2rem" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "2rem" }}>
        <p style={{ color: "red" }}>{error || "Product not found."}</p>
        <Link to="/whisk" className="pixel-btn" style={{ marginTop: "1rem" }}>
          ← Back to Whisk menu
        </Link>
      </div>
    );
  }

  return (
    <div
      className="home-container"
      style={{ padding: "2rem", display: "flex", justifyContent: "center" }}
    >
      <div
        className="pixel-card"
        style={{
          maxWidth: "480px",
          width: "100%",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />

        <div>
          <h2 className="pixel-font" style={{ marginBottom: "0.25rem" }}>
            {product.name}
          </h2>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              fontSize: "0.85rem",
            }}
          >
            <span className="pixel-tag">dessert</span>
            <span className="pixel-tag">Whisk</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: "0.9rem",
          }}
        >
          <span>${Number(product.price).toFixed(2)}</span>
          <span>⭐ {product.rating?.toFixed(1) ?? "0.0"}</span>
          <span>{product.visits ?? 0} visits</span>
        </div>

        <p style={{ fontSize: "0.9rem", lineHeight: 1.4 }}>
          {product.description}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.5rem",
          }}
        >
          <Link to="/whisk" className="pixel-btn">
            ← Back
          </Link>
          <button
            type="button"
            className="pixel-btn"
            style={{ cursor: "default" }}
          >
            Add Review (coming soon)
          </button>
        </div>
      </div>
    </div>
  );
}
