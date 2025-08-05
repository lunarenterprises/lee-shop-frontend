import React, { useState } from "react";
import "./LoginModal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginModal = ({ onClose, onForgotPassword, onSignUp, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword((p) => !p);

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMessage("");

    // Basic validation
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/user/login",
        { email: email.trim(), password }
      );

      if (!data.result) {
        setErrorMessage(data.message || "Login failed");
      } else if (data.user) {
        // Store user data
        localStorage.setItem("userData", JSON.stringify(data.user));

        // Call the success handler from Header if provided
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        } else {
          // Fallback navigation if no success handler
          const role = data.user.role?.toLowerCase();
          if (role === "deliverystaff") navigate("/DeliveryProfile");
          else if (role === "shop") navigate("/ShopProfile");
          else navigate("/UserProfile");
          onClose && onClose();
        }
      } else {
        setErrorMessage("Login failed: No user data received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      let errorMsg = "Something went wrong, please try again.";

      if (err.response?.status === 401) {
        errorMsg = "Invalid email or password.";
      } else if (err.response?.status === 404) {
        errorMsg = "User not found. Please check your email.";
      } else if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="login-modal">
        <button className="close-button" onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <img src="/logo.png" alt="Lee Shop Logo" className="modal-logo" />
        <h2>Welcome Back!</h2>
        <p>Sign in to <strong>Lee Shop</strong></p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your Email id."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          autoComplete="email"
        />

        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            autoComplete="current-password"
          />
          <span className="eye-icon" onClick={togglePassword} role="button" tabIndex={0}>
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {errorMessage && <p className="error-message" role="alert">{errorMessage}</p>}

        <div className="remember-forgot">
          <label>
            <input type="checkbox" disabled={isLoading} /> Remember me!
          </label>
          <span
            className="forgot-password"
            onClick={onForgotPassword}
            style={{ cursor: "pointer", color: "green" }}
            role="button"
            tabIndex={0}
          >
            Forgot password?
          </span>
        </div>

        <button
          className="sign-in-btn"
          onClick={handleLogin}
          disabled={isLoading}
          aria-label={isLoading ? "Signing in..." : "Sign in"}
        >
          {isLoading ? "Signing in…" : "Sign in"}
        </button>

        <p className="signup-link">
          Don't have an account?{" "}
          <span
            onClick={onSignUp}
            style={{ color: "green", cursor: "pointer" }}
            role="button"
            tabIndex={0}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
