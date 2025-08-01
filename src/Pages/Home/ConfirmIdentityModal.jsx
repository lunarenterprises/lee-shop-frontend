import React, { useState } from "react";
import "./ConfirmIdentityModal.css";
import axios from "axios";

const ConfirmIdentityModal = ({ onClose, onConfirmEmail }) => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setErrorMessage("Please enter your email.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await axios.post("https://lunarsenterprises.com:6031/leeshop/user/forgotpassword", {
        email,
        u_role: "user"
      });

      if (response.data.result === false) {
        setErrorMessage(response.data.message || "Failed to send verification code.");
      } else {
        onConfirmEmail(email); // Pass email back to parent
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="confirm-identity-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src="/logo.png" alt="Logo" className="modal-logo" />

        <h2>Confirm identity</h2>
        <p>Please enter your email address below to confirm identity</p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your Email id"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        <button className="confirm-btn" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Confirm"}
        </button>
      </div>
    </div>
  );
};

export default ConfirmIdentityModal;
