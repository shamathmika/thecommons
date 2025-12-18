import React from "react";

const PixelStar = ({ filled = true, size = 20 }) => (
  <svg
    viewBox="0 0 24 24"
    className="pixel-star"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={filled ? "#FFD700" : "none"}
      stroke="black"
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default PixelStar;
