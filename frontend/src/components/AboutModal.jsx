import React from 'react';
import '../styles/AboutModal.css';

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="about-modal-overlay" onClick={onClose}>
      <div className="about-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="scroll-wrapper">
          <div className="scroll-text">
            <h2 className="pixel-font">The Commons</h2>
            <p>Your digital village for student living, artisanal treats, and pet care.</p>
            <ul className="pixel-list">
              <li><strong>Nestly:</strong> Student Housing</li>
              <li><strong>Whisk:</strong> Online Bakery</li>
              <li><strong>PetSitHub:</strong> Pet Services</li>
            </ul>
            <p>Collaborative project by Shamathmika, Wendy & Anandita.</p>
            <button className="pixel-btn close-modal-btn" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutModal;
