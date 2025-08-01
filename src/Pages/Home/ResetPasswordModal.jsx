import React, { useState } from "react";
import "./ResetPasswordModal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPasswordModal = ({ email, onClose, onSuccess }) => {
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!password || !confirmPassword) {
      setError("Please fill out both fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/user/ResetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.message || "Failed to reset password.");
      }

      onClose();
      onSuccess(); // Show success modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="reset-password-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <img src="/logo.png" alt="Logo" className="logo" />
        <h2>Reset Password</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="input-group">
          <input
            type={showPassword1 ? "text" : "password"}
            placeholder="Enter your new password."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword1(!showPassword1)}
          >
            {showPassword1 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <div className="input-group">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder="Confirm your new password."
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span
            className="eye-icon"
            onClick={() => setShowPassword2(!showPassword2)}
          >
            {showPassword2 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="reset-btn" onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
