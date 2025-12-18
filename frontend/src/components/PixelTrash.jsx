import React from "react";

const PixelTrash = ({ size = 20, color = "#8b0000" }) => (
  <svg
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    {/* Lid */}
    <rect x="6" y="4" width="12" height="2" fill={color} />
    <rect x="9" y="2" width="6" height="2" fill={color} />
    
    {/* Body */}
    <rect x="7" y="7" width="10" height="13" fill={color} />
    <rect x="6" y="6" width="12" height="2" fill={color} />
    
    {/* Stripes/Detail */}
    <rect x="9" y="9" width="2" height="9" fill="rgba(255,255,255,0.2)" />
    <rect x="13" y="9" width="2" height="9" fill="rgba(255,255,255,0.2)" />
    
    {/* Outline */}
    <path
      d="M6 4V6H18V4H15V2H9V4H6ZM5 6V8H6V20H5V22H19V20H18V8H19V6H5ZM8 8H16V20H8V8Z"
      fill="black"
      fillOpacity="0.1"
    />
  </svg>
);

export default PixelTrash;
