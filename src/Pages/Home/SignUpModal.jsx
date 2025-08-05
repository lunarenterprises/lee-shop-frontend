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
        password: ""
    });

    const [confirmPwd, setConfirmPwd] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [showCPwd, setShowCPwd] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* ---------- handlers ---------- */
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        // Reset messages
        setError("");
        setSuccess("");

        /* validation */
        if (!agreed) {
            setError("Please agree to the terms and conditions.");
            return;
        }

        if (!form.name || !form.email || !form.mobile || !form.address ||
            !form.district || !form.state || !form.zip_code || !form.password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (form.password !== confirmPwd) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        // Mobile validation (basic)
        const mobileRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!mobileRegex.test(form.mobile)) {
            setError("Please enter a valid mobile number.");
            return;
        }

        /* API call */
        setLoading(true);

        try {
            // Prepare payload
            const payload = {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                mobile: form.mobile.replace(/\D/g, ''), // Remove non-digits
                address: form.address.trim(),
                district: form.district.trim(),
                state: form.state.trim(),
                zip_code: form.zip_code.trim(),
                password: form.password
            };

            console.log('Sending payload:', payload);

            const response = await axios.post(
                "https://lunarsenterprises.com:6031/leeshop/user/register",
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000 // 15 second timeout
                }
            );

            console.log('API Response:', response.data);

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
                const errorMsg = response.data?.message || "Registration failed. Please try again.";
                setError(errorMsg);
            }

        } catch (err) {
            console.error('Registration error:', err);

            let errorMessage = "Something went wrong. Please try again.";

            if (err.code === 'ECONNABORTED') {
                errorMessage = "Request timeout. Please check your connection and try again.";
            } else if (err.response) {
                // Server responded with error status
                if (err.response.status === 400) {
                    errorMessage = err.response.data?.message || "Invalid data provided.";
                } else if (err.response.status === 409) {
                    errorMessage = "An account with this email or mobile number already exists.";
                } else if (err.response.status === 422) {
                    errorMessage = err.response.data?.message || "Validation failed. Please check your input.";
                } else if (err.response.status >= 500) {
                    errorMessage = "Server error. Please try again later.";
                } else {
                    errorMessage = err.response.data?.message || `Error: ${err.response.status}`;
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
                <button className="close-button" onClick={onClose}>&times;</button>

                <img src="/logo.png" alt="Logo" className="modal-logo" />

                <h2 className="signup-title">Sign Up</h2>
                <p className="signup-subtitle">Just a few&nbsp; quick things to get started</p>

                {/* scrollable form area */}
                <div className="modal-body">
                    {[
                        { label: "Name", name: "name", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Mobile", name: "mobile", type: "tel" },
                        { label: "Address", name: "address", type: "text" },
                        { label: "District", name: "district", type: "text" },
                        { label: "State", name: "state", type: "text" },
                        { label: "ZIP Code", name: "zip_code", type: "text" }
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
                            />
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
                            placeholder="Enter your password (min 6 characters)."
                            disabled={loading}
                        />
                        <span className="eye-icon" onClick={() => setShowPwd(!showPwd)}>
                            {showPwd ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    <label>Confirm Password</label>
                    <div className="password-wrapper">
                        <input
                            type={showCPwd ? "text" : "password"}
                            value={confirmPwd}
                            onChange={(e) => setConfirmPwd(e.target.value)}
                            placeholder="Confirm your password."
                            disabled={loading}
                        />
                        <span className="eye-icon" onClick={() => setShowCPwd(!showCPwd)}>
                            {showCPwd ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                </div>{/* /modal-body */}

                {/* terms & conditions */}
                <div className="terms-box">
                    <div className="terms-container">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            disabled={loading}
                        />{" "}
                        I Agree with the Terms and conditions
                    </div>
                </div>

                {/* Success Message */}
                {success && <p className="success-message">{success}</p>}

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                <button
                    className="sign-btn"
                    onClick={handleSubmit}
                    disabled={loading}
                >
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
