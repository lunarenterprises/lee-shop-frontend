import React, { useState } from "react";
import "./SignUpModal.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const SignUpModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    district: "",
    state: "",
    zip_code: "",
    password: "",
  });

  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showCPwd, setShowCPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  /* ---------- Enhanced Validation Functions ---------- */
  
  // Sanitize input to prevent XSS
  const sanitizeInput = (input) => {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  };

  // Name validation - only letters and spaces, min 2 chars
  const validateName = (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) return "Name is required";
    if (trimmedName.length < 2) return "Name must be at least 2 characters";
    if (trimmedName.length > 50) return "Name must not exceed 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(trimmedName)) return "Name should only contain letters and spaces";
    if (/^\s|\s$/.test(trimmedName)) return "Name should not start or end with spaces";
    if (/\s{2,}/.test(trimmedName)) return "Name should not contain multiple consecutive spaces";
    return "";
  };

  // Enhanced email validation
  const validateEmail = (email) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) return "Email is required";
    
    // More comprehensive email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(trimmedEmail)) return "Please enter a valid email address";
    if (trimmedEmail.length > 254) return "Email address is too long";
    
    // Check for common typos
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = trimmedEmail.split('@')[1];
    if (domain && domain.includes('..')) return "Email domain cannot contain consecutive dots";
    
    return "";
  };

  // Mobile validation - Indian format
  const validateMobile = (mobile) => {
    const cleanMobile = mobile.replace(/\D/g, "");
    if (!cleanMobile) return "Mobile number is required";
    
    // Indian mobile number validation (10 digits starting with 6-9)
    if (cleanMobile.length !== 10) return "Mobile number must be exactly 10 digits";
    if (!/^[6-9]/.test(cleanMobile)) return "Mobile number must start with 6, 7, 8, or 9";
    if (/^(.)\1{9}$/.test(cleanMobile)) return "Mobile number cannot have all same digits";
    
    return "";
  };

  // Address validation
  const validateAddress = (address) => {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) return "Address is required";
    if (trimmedAddress.length < 10) return "Address must be at least 10 characters";
    if (trimmedAddress.length > 200) return "Address must not exceed 200 characters";
    if (!/^[a-zA-Z0-9\s,.-/#]+$/.test(trimmedAddress)) return "Address contains invalid characters";
    return "";
  };

  // District validation
  const validateDistrict = (district) => {
    const trimmedDistrict = district.trim();
    if (!trimmedDistrict) return "District is required";
    if (trimmedDistrict.length < 2) return "District name must be at least 2 characters";
    if (trimmedDistrict.length > 50) return "District name must not exceed 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(trimmedDistrict)) return "District name should only contain letters and spaces";
    return "";
  };

  // State validation
  const validateState = (state) => {
    const trimmedState = state.trim();
    if (!trimmedState) return "State is required";
    if (trimmedState.length < 2) return "State name must be at least 2 characters";
    if (trimmedState.length > 50) return "State name must not exceed 50 characters";
    if (!/^[a-zA-Z\s]+$/.test(trimmedState)) return "State name should only contain letters and spaces";
    return "";
  };

  // ZIP code validation - Indian PIN code
  const validateZipCode = (zipCode) => {
    const trimmedZip = zipCode.trim();
    if (!trimmedZip) return "ZIP code is required";
    if (!/^\d{6}$/.test(trimmedZip)) return "ZIP code must be exactly 6 digits";
    if (/^0{6}$/.test(trimmedZip)) return "ZIP code cannot be all zeros";
    return "";
  };

  // Enhanced password validation
  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (password.length > 128) return "Password must not exceed 128 characters";
    
    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    
    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    
    // Check for at least one digit
    if (!/\d/.test(password)) return "Password must contain at least one number";
    
    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one special character";
    }
    
    // Check for common weak passwords
    const commonPasswords = ['password', '12345678', 'qwerty123', 'abc123456'];
    if (commonPasswords.includes(password.toLowerCase())) {
      return "Password is too common. Please choose a stronger password";
    }
    
    return "";
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword, originalPassword) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== originalPassword) return "Passwords do not match";
    return "";
  };

  // Real-time field validation
  const validateField = (fieldName, value) => {
    let errorMessage = "";
    
    switch (fieldName) {
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'mobile':
        errorMessage = validateMobile(value);
        break;
      case 'address':
        errorMessage = validateAddress(value);
        break;
      case 'district':
        errorMessage = validateDistrict(value);
        break;
      case 'state':
        errorMessage = validateState(value);
        break;
      case 'zip_code':
        errorMessage = validateZipCode(value);
        break;
      case 'password':
        errorMessage = validatePassword(value);
        break;
      default:
        break;
    }
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: errorMessage
    }));
    
    return errorMessage;
  };

  /* ---------- Enhanced Handlers ---------- */
  
  const onChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setForm({ ...form, [name]: sanitizedValue });
    
    // Clear error message when user starts typing
    setError("");
    
    // Real-time validation with debouncing
    setTimeout(() => {
      validateField(name, sanitizedValue);
    }, 300);
  };

  // Handle confirm password change
  const onConfirmPasswordChange = (e) => {
    const value = sanitizeInput(e.target.value);
    setConfirmPwd(value);
    
    // Real-time validation for confirm password
    setTimeout(() => {
      const errorMessage = validateConfirmPassword(value, form.password);
      setFieldErrors(prev => ({
        ...prev,
        confirmPassword: errorMessage
      }));
    }, 300);
  };

  const handleSubmit = async () => {
    // Reset messages
    setError("");
    setSuccess("");
    setFieldErrors({});

    /* Comprehensive validation */
    const validationErrors = {};
    
    // Validate all fields
    validationErrors.name = validateName(form.name);
    validationErrors.email = validateEmail(form.email);
    validationErrors.mobile = validateMobile(form.mobile);
    validationErrors.address = validateAddress(form.address);
    validationErrors.district = validateDistrict(form.district);
    validationErrors.state = validateState(form.state);
    validationErrors.zip_code = validateZipCode(form.zip_code);
    validationErrors.password = validatePassword(form.password);
    validationErrors.confirmPassword = validateConfirmPassword(confirmPwd, form.password);

    // Check if user agreed to terms
    if (!agreed) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    // Check if there are any validation errors
    const hasErrors = Object.values(validationErrors).some(error => error !== "");
    if (hasErrors) {
      setFieldErrors(validationErrors);
      setError("Please fix the errors above before submitting.");
      return;
    }

    /* API call */
    setLoading(true);

    try {
      // Prepare payload with sanitized and trimmed data
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.replace(/\D/g, ""), // Remove non-digits
        address: form.address.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        zip_code: form.zip_code.trim(),
        password: form.password,
      };

      console.log("Sending payload:", { ...payload, password: "[HIDDEN]" });

      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/user/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.result === true) {
        // Success
        setSuccess("Account created successfully! Welcome to Lee Shop!");

        // Store user data if provided
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }

        // Close modal after showing success message
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(response.data.user);
          } else {
            onClose && onClose();
          }
        }, 2000);
      } else {
        // API returned success: false
        const errorMsg =
          response.data?.message || "Registration failed. Please try again.";
        setError(errorMsg);
      }
    } catch (err) {
      console.error("Registration error:", err);

      let errorMessage = "Something went wrong. Please try again.";

      if (err.code === "ECONNABORTED") {
        errorMessage =
          "Request timeout. Please check your connection and try again.";
      } else if (err.response) {
        // Server responded with error status
        if (err.response.status === 400) {
          errorMessage = err.response.data?.message || "Invalid data provided.";
        } else if (err.response.status === 409) {
          errorMessage =
            "An account with this email or mobile number already exists.";
        } else if (err.response.status === 422) {
          errorMessage =
            err.response.data?.message ||
            "Validation failed. Please check your input.";
        } else if (err.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage =
            err.response.data?.message || `Error: ${err.response.status}`;
        }
      } else if (err.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="modal-overlay">
      <div className="signup-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <img src="/logo.png" alt="Logo" className="modal-logo" />

        <h2 className="signup-title">Sign Up</h2>
        <p className="signup-subtitle">
          Just a few&nbsp; quick things to get started
        </p>

        {/* scrollable form area */}
        <div className="modal-body">
          {[
            { label: "Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Mobile", name: "mobile", type: "tel" },
            { label: "Address", name: "address", type: "text" },
            { label: "District", name: "district", type: "text" },
            { label: "State", name: "state", type: "text" },
            { label: "ZIP Code", name: "zip_code", type: "text" },
          ].map(({ label, name, type }) => (
            <React.Fragment key={name}>
              <label>{label}</label>
              <input
                type={type}
                name={name}
                value={form[name]}
                onChange={onChange}
                placeholder={`Enter your ${label.toLowerCase()}.`}
                disabled={loading}
                style={{
                  borderColor: fieldErrors[name] ? "#ff4444" : undefined
                }}
              />
              {fieldErrors[name] && (
                <p style={{ color: "#ff4444", fontSize: "12px", marginTop: "2px", marginBottom: "5px" }}>
                  {fieldErrors[name]}
                </p>
              )}
            </React.Fragment>
          ))}

          {/* New / confirm password fields with eye icon */}
          <label>New Password</label>
          <div className="password-wrapper">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Enter your password"
              disabled={loading}
              style={{
                borderColor: fieldErrors.password ? "#ff4444" : undefined
              }}
            />
            <span className="eye-icon" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {fieldErrors.password && (
            <p style={{ color: "#ff4444", fontSize: "12px", marginTop: "2px", marginBottom: "5px" }}>
              {fieldErrors.password}
            </p>
          )}

          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showCPwd ? "text" : "password"}
              value={confirmPwd}
              onChange={onConfirmPasswordChange}
              placeholder="Confirm your password."
              disabled={loading}
              style={{
                borderColor: fieldErrors.confirmPassword ? "#ff4444" : undefined
              }}
            />
            <span className="eye-icon" onClick={() => setShowCPwd(!showCPwd)}>
              {showCPwd ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
          {fieldErrors.confirmPassword && (
            <p style={{ color: "#ff4444", fontSize: "12px", marginTop: "2px", marginBottom: "5px" }}>
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>
        {/* /modal-body */}

        {/* terms & conditions */}
        <div className="terms-box">
          <div className="terms-container">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={loading}
            />{" "}
            <span style={{ paddingLeft: "10px" }}>
              I Agree with the Terms and conditions
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && <p className="success-message">{success}</p>}

        {/* Error Message */}
        {error && <p className="error-message">{error}</p>}

        <button className="sign-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="footer-switch">
          Already have an account? <span onClick={onClose}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default SignUpModal;