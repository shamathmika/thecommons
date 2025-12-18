import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import PixelDropdown from "../components/PixelDropdown";

const apiBase = import.meta.env.VITE_API_BASE || "/backend";

const COMPANY_CONFIG = {
  nestly: {
    title: "Nestly Listings",
    endpoint: "/nestly/listings/get.php",
    detailPrefix: "/nestly/",
    emptyMsg: "No rentals available at the moment.",
    bgClass: "bg-nestly",
  },
  whisk: {
    title: "Whisk Menu",
    endpoint: "/whisk/menu/get.php",
    detailPrefix: "/whisk/",
    emptyMsg: "No menu items available.",
    bgClass: "bg-whisk",
  },
  petsit: {
    title: "PetSitHub Services",
    endpoint: "/petsit/services/get.php",
    detailPrefix: "/petsit/",
    emptyMsg: "No services available.",
    bgClass: "bg-petsit",
  },
  marketplace: {
    title: "All Village Products & Services",
    endpoint: "/marketplace/products/all.php",
    detailPrefix: "/",
    emptyMsg: "The village is quiet today. No products found.",
    bgClass: "bg-marketplace",
  },
};

export default function CompanyPage({ company }) {
  const config = COMPANY_CONFIG[company];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const itemsPerPage = 12;

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isTopFilter = searchParams.get("filter") === "top";

  useEffect(() => {
    if (!config) return;

    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const endpoint = isTopFilter
          ? company === "marketplace"
            ? "/marketplace/products/top.php"
            : config.endpoint.replace("get.php", "top.php")
          : config.endpoint;

        const res = await fetch(`${apiBase}${endpoint}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();

        if (company === "marketplace" && data.products) {
          setProducts(data.products);
        } else if (company === "marketplace" && data.top) {
          setProducts(data.top);
        } else if (Array.isArray(data)) {
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
    setCurrentPage(1);
  }, [company, config, isTopFilter]);

  if (!config) return <div style={{ padding: "2rem" }}>Unknown Company</div>;

  // Sorting & Pagination
  const getSortedProducts = () => {
    let sorted = [...products];

    if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "visits") {
      sorted.sort((a, b) => (b.visits || 0) - (a.visits || 0));
    } else if (sortBy === "popular") {
      const maxVisits = Math.max(...products.map((p) => p.visits || 0), 1);
      sorted.sort((a, b) => {
        const scoreA =
          ((a.rating || 0) / 5) * 0.7 +
          ((a.visits || 0) / maxVisits) * 0.3;
        const scoreB =
          ((b.rating || 0) / 5) * 0.7 +
          ((b.visits || 0) / maxVisits) * 0.3;
        return scoreB - scoreA;
      });
    }
    return sorted;
  };

  const sortedProducts = getSortedProducts();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const topLimitText =
    company === "nestly"
      ? "Listings"
      : company === "whisk"
      ? "Menu Items"
      : "Services";

  // 👇 Button should exist for ALL companies in both views, as long as we have products
  const showTopButton = products.length > 0;

  return (
    <div style={{ padding: "2rem" }} className={config.bgClass}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h2 className="pixel-font" style={{ margin: 0 }}>
            {isTopFilter ? `Top 5 ${config.title}` : config.title}
          </h2>
          <p
            style={{
              margin: "0.25rem 0",
              fontSize: "0.9rem",
              opacity: 0.8,
            }}
          >
            {isTopFilter
              ? "Based on community trends and ratings"
              : "The local selection"}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {!isTopFilter && products.length > 0 && (
            <div
              className="sort-container"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <label
                className="pixel-font"
                style={{ fontSize: "0.9rem" }}
              >
                Sort:
              </label>
              <PixelDropdown
                value={sortBy}
                onChange={(v) => { setSortBy(v); setCurrentPage(1); }}
                options={[
                  { value: "popular", label: "Popular" },
                  { value: "rating", label: "Top Rated" },
                  { value: "visits", label: "Most Visited" }
                ]}
              />

            </div>
          )}

          {showTopButton && (
            <Link
              to={
                isTopFilter
                  ? company === "marketplace"
                    ? "/marketplace"
                    : `/${company}`
                  : company === "marketplace"
                  ? "/marketplace?filter=top"
                  : `/${company}?filter=top`
              }
              className="pixel-btn"
              style={{
                fontSize: "0.9rem",
                minWidth: "150px",
                textAlign: "center",
              }}
            >
              {isTopFilter
                ? "Show All Items"
                : company === "marketplace"
                ? "View Top 5 Villagewide"
                : `View Top 5 ${topLimitText}`}
            </Link>
          )}
        </div>
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
        {currentItems.map((p) => {
          let detailLink = `${config.detailPrefix}${encodeURIComponent(p.id)}`;

          if (company === "marketplace") {
            const prefix =
              p.company === "whisk"
                ? "/whisk/"
                : p.company === "nestly"
                ? "/nestly/"
                : "/petsit/";
            detailLink = `${prefix}${encodeURIComponent(p.id)}`;
          }

          return (
            <Link
              key={`${p.company}-${p.id}`}
              to={detailLink}
              state={{ fromMarketplace: company === "marketplace" }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ProductCard product={p} />
            </Link>
          );
        })}
      </div>

      {!loading && !error && totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            marginTop: "3rem",
            paddingBottom: "2rem",
          }}
        >
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="pixel-btn"
            style={{
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>

          <span className="pixel-font" style={{ fontSize: "1.2rem" }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pixel-btn"
            style={{
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor:
                currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
