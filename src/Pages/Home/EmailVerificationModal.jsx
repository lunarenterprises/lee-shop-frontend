import React, { useState, useRef } from "react";
import "./EmailVerificationModal.css";
import axios from "axios";

const EmailVerificationModal = ({ onClose, onVerify, email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // auto-focus next input
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      setMessage("Please enter the complete 4-digit code.");
      return;
    }

    setIsVerifying(true);
    setMessage("");

    try {
      const response = await axios.post("https://lunarsenterprises.com:6031/leeshop/user/verifyotp", {
        email,
        otp: enteredOtp,
      });

      console.log("OTP Verified:", response.data);
      onVerify(); // Proceed to reset modal
    } catch (error) {
      console.error("OTP Error:", error.response?.data || error.message);
      setMessage(
        error.response?.data?.message || "Invalid or expired OTP. Try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setMessage("");

    try {
      await axios.post("https://lunarsenterprises.com:6031/leeshop/user/forgotpassword", {
        email,
        u_role: "user",
      });

      setMessage("Verification code resent!");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to resend code. Try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="email-verification-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src="/logo.png" alt="Logo" className="modal-logo" />
        <h2>Verify your email Address</h2>
        <p>A verification code has been sent to</p>
        <p className="email-id">{email}</p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              ref={(el) => (inputsRef.current[index] = el)}
            />
          ))}
        </div>

        {message && <p className="status-message">{message}</p>}

        <button className="verify-btn" onClick={handleVerify} disabled={isVerifying}>
          {isVerifying ? "Verifying..." : "Verify"}
        </button>

        <p
          className="resend-code"
          style={{ cursor: "pointer", color: "green" }}
          onClick={handleResend}
        >
          {isResending ? "Resending..." : "Resend code"}
        </p>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
