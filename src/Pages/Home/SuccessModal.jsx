// src/components/SuccessModal.js
import React from "react";
import "./SuccessModal.css";

const SuccessModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="success-modal">
        <div className="success-icon">&#10004;</div>
        <h2>Successfully!</h2>
        <p>Your password has been successfully updated.</p>
        <button className="go-login" onClick={onClose}>Go to Login</button>
      </div>
    </div>
  );
};

export default SuccessModal;
