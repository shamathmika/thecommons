import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

const COMPANY_CONFIG = {
  nestly: {
    title: "Nestly Listings",
    endpoint: "/nestly/listings/get.php",
    detailPrefix: "/nestly/",
    emptyMsg: "No rentals available at the moment.",
    bgClass: "bg-nestly" // Optional for future styling
  },
  whisk: {
    title: "Whisk Menu",
    endpoint: "/whisk/menu/get.php",
    detailPrefix: "/whisk/",
    emptyMsg: "No menu items available.",
    bgClass: "bg-whisk"
  },
  petsit: {
    title: "PetSitHub Services",
    endpoint: "/petsit/services/get.php",
    detailPrefix: "/petsit/",
    emptyMsg: "No services available.",
    bgClass: "bg-petsit"
  }
};

export default function CompanyPage({ company }) {
  // If company not passed as prop, could derive from path, but prop is cleaner in App.jsx
  const config = COMPANY_CONFIG[company];
  // If invalid company, default or error?
  // We'll assume App.jsx passes valid keys.

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!config) return;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${apiBase}${config.endpoint}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        
        // Handle varying response structures if necessary, but ideally normalized by backend
        // Nestly/Whisk get.php return array of objects.
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error(`Failed to load ${company} products`, err);
        setError(`Failed to load ${company} items.`);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [company, config]);

  if (!config) return <div style={{padding:'2rem'}}>Unknown Company</div>;

  return (
    <div style={{ padding: "2rem" }} className={config.bgClass}>
      <h2 className="pixel-font" style={{ marginBottom: "1rem" }}>
        {config.title}
      </h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p>{config.emptyMsg}</p>
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
            to={`${config.detailPrefix}${encodeURIComponent(p.id)}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ProductCard product={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}
