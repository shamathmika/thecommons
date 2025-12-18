import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    showCancel: false,
  });

  const openModal = ({ title, message, onConfirm, onCancel, showCancel = false }) => {
    setModal({
      open: true,
      title,
      message,
      onConfirm,
      onCancel,
      showCancel,
    });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, open: false }));
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {/* Render modal at root */}
      {modal.open && (
        <PixelModal
          {...modal}
          close={closeModal}
        />
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);

// Component is defined inline:
function PixelModal({ open, title, message, onConfirm, onCancel, showCancel, close }) {
  if (!open) return null;

  return (
    <div className="pixel-modal-overlay">
      <div className="pixel-modal-card pixel-card">

        {title && <h2 className="pixel-font" style={{ marginTop: 0 }}>{title}</h2>}
        
        <p style={{ whiteSpace: "pre-line", marginBottom: "1.5rem" }}>{message}</p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem"
        }}>
          <button 
            className="pixel-btn"
            onClick={() => {
              if (onConfirm) onConfirm();
              close();
            }}
          >
            OK
          </button>

          {showCancel && (
            <button 
              className="pixel-btn"
              style={{ backgroundColor: "var(--wood-dark)" }}
              onClick={() => {
                if (onCancel) onCancel();
                close();
              }}
            >
              Cancel
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
