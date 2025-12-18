// src/components/ProductCard.jsx
import React from "react";
import "../styles/ProductCard.css";
import PixelStar from "./PixelStar";

export default function ProductCard({ product }) {
  if (!product) return null;

  const {
    name,
    company,
    type,
    price,
    rating,
    visits,
    image,
    description,
  } = product;

  const formattedPrice =
    typeof price === "number" ? `$${price.toLocaleString()}` : null;

  const formattedRating =
    typeof rating === "number" ? rating.toFixed(1) : null;

  return (
    <div className="product-card pixel-card">
      <div className="product-card-inner">
        {image && (
          <div className="product-card-image-wrapper">
            <img src={image} alt={name} className="product-card-image" />
          </div>
        )}

        <div className="product-card-body">
          <div className="product-card-header">
            <h3 className="product-card-title">{name}</h3>
            {company && (
              <span className="product-card-company-tag">
                {company.toUpperCase()}
              </span>
            )}
          </div>

          <div className="product-card-subrow">
            {type && <span className="product-card-type">{type}</span>}

            {formattedPrice && (
              <span className="product-card-price">{formattedPrice}</span>
            )}
          </div>

          {description && (
            <p className="product-card-description">{description}</p>
          )}

          <div className="product-card-meta">
            {formattedRating && (
              <span className="product-card-rating">
                <PixelStar size={16} /> <span style={{marginLeft: '4px'}}>{formattedRating}</span>
              </span>
            )}

            {typeof visits === "number" && (
              <span className="product-card-visits">
                {visits} visit{visits === 1 ? "" : "s"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
