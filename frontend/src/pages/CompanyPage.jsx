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

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isTopFilter = searchParams.get('filter') === 'top';

  useEffect(() => {
    if (!config) return;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const endpoint = isTopFilter 
          ? config.endpoint.replace('get.php', 'top.php')
          : config.endpoint;

        const res = await fetch(`${apiBase}${endpoint}`);
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
        console.error(`Failed to load ${company} products`, err);
        setError(`Failed to load ${company} items.`);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [company, config, isTopFilter]);

  if (!config) return <div style={{padding:'2rem'}}>Unknown Company</div>;

  const topLimitText = company === 'nestly' ? "Listings" : company === 'whisk' ? "Menu Items" : "Services";

  return (
    <div style={{ padding: "2rem" }} className={config.bgClass}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <h2 className="pixel-font" style={{ margin: 0 }}>
            {isTopFilter ? `Top 5 ${config.title}` : config.title}
          </h2>
          <p style={{ margin: '0.25rem 0', fontSize: '0.9rem', opacity: 0.8 }}>
            {isTopFilter ? "Based on community trends and ratings" : "The local selection"}
          </p>
        </div>

        <Link 
          to={isTopFilter ? `/${company}` : `/${company}?filter=top`} 
          className="pixel-btn" 
          style={{ fontSize: '0.9rem', minWidth: '150px', textAlign: 'center' }}
        >
          {isTopFilter ? "Show All Items" : `View Top 5 ${topLimitText}`}
        </Link>
      </div>

      {loading && <p>Consulting the village records...</p>}
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
