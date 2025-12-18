// src/components/Footer.jsx
import React from "react";
import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer-container pixel-font">
      <div className="footer-inner">
        <span>© {new Date().getFullYear()} The Commons</span>

        <a
          href="https://github.com/shamathmika/thecommons"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
