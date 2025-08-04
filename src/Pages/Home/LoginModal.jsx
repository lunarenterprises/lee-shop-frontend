import React, { useState } from "react";
import "./LoginModal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, onForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const response = await axios.post("https://lunarsenterprises.com:6031/leeshop/user/login", {
        email,
        password,
      });

      if (response.data.result === false) {
        setErrorMessage(response.data.message || "Login failed");
      } else if (response.data.user) {
        // Save to localStorage if you want:
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        let role = response.data.user.role  // or use 'role', inspect your payload!
        if (role === "user") {
          navigate("/UserProfile"); // User
        } else if (role === "deliverystaff") {
          navigate("/deliveryProfile"); // Delivery Agent
        } else if (role === "shop") {
          navigate("/shopProfile"); // Shop Owner
        } else {
          navigate("/"); // Default fallback
        }
        onClose && onClose();
      } else {
        setErrorMessage("Login failed: No user info in response.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <img src="/logo.png" alt="Logo" className="modal-logo" />
        <h2>Welcome Back!</h2>
        <p>
          Sign In to <strong>Lee Shop</strong>
        </p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your Email id."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={togglePassword}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="remember-forgot">
          <label>
            <input type="checkbox" /> Remember me!
          </label>
          <span
            className="forgot-password"
            onClick={onForgotPassword}
            style={{ cursor: "pointer", color: "green" }}
          >
            Forgot password?
          </span>
        </div>

        <button className="sign-in-btn" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        <p className="signup-link">
          Don’t have an account? <span>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
