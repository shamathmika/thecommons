import React, { useState, useRef, useEffect } from "react";
import "../styles/PixelDropdown.css";

export default function PixelDropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="pixel-dd-container" ref={ref}>
      <button
        className="pixel-dd-trigger pixel-btn"
        onClick={() => setOpen((o) => !o)}
      >
        {selected?.label || "Select"} 
        <span className="pixel-dd-arrow">▼</span>
      </button>

      <div className={`pixel-dd-menu ${open ? "open" : ""}`}>
        {options.map((opt) => (
          <div
            key={opt.value}
            className={`pixel-dd-item ${
              opt.value === value ? "selected" : ""
            }`}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </div>
        ))}
      </div>
    </div>
  );
}
