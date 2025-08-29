import React, { useState, useEffect } from "react";
import "./ContactInfoForm.css"; // renamed CSS file
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProgressSteps from "../ProgressSteps";

const ContactInfoForm = () => {
  const navigate = useNavigate();

  const [contact, setContact] = useState({
    primary_phone: "",
    secondary_phone: "",
    whatsapp_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [merged, setMerged] = useState(null);
  const [errors, setErrors] = useState({});

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ];

  // Test toast function (you can remove this after testing)
  const testToast = () => {
    toast.success("Success toast is working!");
    toast.error("Error toast is working!");
    toast.warn("Warning toast is working!");
    toast.info("Info toast is working!");
  };

  useEffect(() => {
    const businessType = localStorage.getItem("businessType");
    const businessInfo = JSON.parse(
      localStorage.getItem("businessInfo") || "{}"
    );
    const operatingDetails = JSON.parse(
      localStorage.getItem("operatingDetails") || "{}"
    );
    const brandingDetails = JSON.parse(
      localStorage.getItem("brandingDetails") || "{}"
    );
    const brandingImageFiles = window.brandingImageFiles || [];

    setMerged({
      service_or_shop:
        businessType === "product-seller"
          ? "shop"
          : businessType === "service-provider"
          ? "service"
          : "both",
      shop_name: businessInfo.shop_name,
      owner_name: businessInfo.owner_name,
      shop_address: businessInfo.address,
      state: businessInfo.state,
      city: businessInfo.city,
      working_days: operatingDetails.working_days || [],
      description: brandingDetails.description,
      product_and_service: Array.isArray(brandingDetails.services)
        ? brandingDetails.services
        : [],
      opening_hours: operatingDetails.opening_hours,
      location: businessInfo.location || businessInfo.state,
      delivery_option: operatingDetails.delivery_option,
      category_id: businessInfo.category_id || 4,
      latitude: businessInfo.latitude || 12.9352,
      longitude: businessInfo.longitude || 77.6245,
      category_name: businessInfo.category || "grocery",
      image: brandingImageFiles,
    });
  }, []);

  // Validation functions
  const validatePhone = (phone, fieldName) => {
    const errors = [];

    if (!phone.trim()) {
      errors.push(`${fieldName} is required`);
      return errors;
    }

    // Remove any non-digit characters for validation
    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length !== 10) {
      errors.push(`${fieldName} must be exactly 10 digits`);
    }

    // Check if phone starts with valid digits (6-9 for Indian mobile numbers)
    if (
      cleanPhone.length === 10 &&
      !["6", "7", "8", "9"].includes(cleanPhone[0])
    ) {
      errors.push(`${fieldName} must start with 6, 7, 8, or 9`);
    }

    // Check for invalid patterns
    if (
      cleanPhone === "0000000000" ||
      cleanPhone === "1111111111" ||
      cleanPhone === "1234567890" ||
      cleanPhone === "9999999999"
    ) {
      errors.push(`${fieldName} appears to be invalid`);
    }

    // Check for repeating digits (more than 5 same digits)
    const digitCounts = {};
    for (let digit of cleanPhone) {
      digitCounts[digit] = (digitCounts[digit] || 0) + 1;
      if (digitCounts[digit] > 5) {
        errors.push(`${fieldName} has too many repeating digits`);
        break;
      }
    }

    return errors;
  };

  const validateEmail = (email) => {
    const errors = [];

    if (!email.trim()) {
      errors.push("Email is required");
      return errors;
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Please enter a valid email address");
    }

    // Additional email validations
    if (email.length > 254) {
      errors.push("Email address is too long");
    }

    // Check for common invalid patterns
    if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
      errors.push("Email address format is invalid");
    }

    // Check for valid domain patterns
    const domain = email.split("@")[1];
    if (domain && domain.length > 0) {
      if (domain.length < 4 || !domain.includes(".")) {
        errors.push("Email domain is invalid");
      }
    }

    return errors;
  };

  const validatePassword = (password) => {
    const errors = [];

    if (!password) {
      errors.push("Password is required");
      return errors;
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 50) {
      errors.push("Password must not exceed 50 characters");
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    // Check for common weak passwords
    const weakPasswords = [
      "password",
      "12345678",
      "qwerty123",
      "admin123",
      "password123",
    ];
    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common, please choose a stronger password");
    }

    // Check for sequential or repeated patterns
    if (/(.)\1{3,}/.test(password)) {
      errors.push(
        "Password should not contain more than 3 repeated characters"
      );
    }

    return errors;
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    const errors = [];

    if (!confirmPassword) {
      errors.push("Please confirm your password");
      return errors;
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match");
    }

    return errors;
  };

  const validatePhoneUniqueness = (phones) => {
    const errors = {};
    // Only check uniqueness between primary and secondary phone
    // WhatsApp can be same as either primary or secondary

    if (phones.primary_phone.trim() && phones.secondary_phone.trim()) {
      const primaryClean = phones.primary_phone.replace(/\D/g, "");
      const secondaryClean = phones.secondary_phone.replace(/\D/g, "");

      if (primaryClean === secondaryClean) {
        errors.secondary_phone = [
          "Alternate phone number must be different from primary phone number",
        ];
      }
    }

    return errors;
  };

  const validateField = (name, value, allValues = contact) => {
    let fieldErrors = [];

    switch (name) {
      case "primary_phone":
        fieldErrors = validatePhone(value, "Primary phone number");
        break;
      case "secondary_phone":
        fieldErrors = validatePhone(value, "Alternate phone number");
        break;
      case "whatsapp_number":
        fieldErrors = validatePhone(value, "WhatsApp number");
        break;
      case "email":
        fieldErrors = validateEmail(value);
        break;
      case "password":
        fieldErrors = validatePassword(value);
        break;
      case "confirm_password":
        fieldErrors = validateConfirmPassword(allValues.password, value);
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    Object.keys(contact).forEach((key) => {
      const fieldErrors = validateField(key, contact[key]);
      if (fieldErrors.length > 0) {
        newErrors[key] = fieldErrors;
      }
    });

    // Check for phone number uniqueness
    const phoneUniquenessErrors = validatePhoneUniqueness(contact);
    Object.keys(phoneUniquenessErrors).forEach((key) => {
      if (newErrors[key]) {
        newErrors[key] = [...newErrors[key], ...phoneUniquenessErrors[key]];
      } else {
        newErrors[key] = phoneUniquenessErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Handle phone number inputs - only allow digits and limit to 10
    if (
      ["primary_phone", "secondary_phone", "whatsapp_number"].includes(name)
    ) {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setContact((prev) => ({ ...prev, [name]: processedValue }));

    // Real-time validation
    if (processedValue.trim()) {
      clearError(name);

      // For confirm password, also clear password errors if they now match
      if (name === "confirm_password" && processedValue === contact.password) {
        clearError("confirm_password");
      }

      // For password, also validate confirm password if it exists
      if (name === "password" && contact.confirm_password) {
        const confirmErrors = validateConfirmPassword(
          processedValue,
          contact.confirm_password
        );
        if (confirmErrors.length === 0) {
          clearError("confirm_password");
        }
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validate field on blur
    const fieldErrors = validateField(name, value);
    if (fieldErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
    }

    // Check phone uniqueness on blur (only for primary and secondary)
    if (["primary_phone", "secondary_phone"].includes(name)) {
      const phoneUniquenessErrors = validatePhoneUniqueness(contact);
      if (phoneUniquenessErrors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: [...(prev[name] || []), ...phoneUniquenessErrors[name]],
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submission started");
    toast.info("Processing your request...");

    if (!merged) {
      toast.warn("Loading previous data...");
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    toast.info("Submitting your information...");

    const data = {
      ...merged,
      primary_phone: contact.primary_phone,
      secondary_phone: contact.secondary_phone,
      whatsapp_number: contact.whatsapp_number,
      email: contact.email.trim(),
      password: contact.password,
    };

    // Log data object before sending
    console.log("Data to submit:", data);

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image" && Array.isArray(data.image)) {
        data.image.forEach((file) => formData.append("image", file));
      } else if (Array.isArray(data[key])) {
        // Send arrays as JSON strings (backend expects actual array)
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/shop",
        formData
      );
      setLoading(false);

      if (response.data?.result) {
        toast.success("🎉 Registration successful! Redirecting...");

        // Clear specific business registration related localStorage items
        localStorage.removeItem("businessType");
        localStorage.removeItem("businessInfo");
        localStorage.removeItem("operatingDetails");
        localStorage.removeItem("brandingDetails");

        // Or alternatively, clear all localStorage (your current approach)
        // localStorage.clear();

        // Clear any other related data
        window.brandingImageFiles = null;

        // Navigate to home page after success with a delay
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(
          response.data?.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message || "Invalid data provided";
        if (errorMessage.toLowerCase().includes("email")) {
          setErrors((prev) => ({
            ...prev,
            email: ["Email already exists or is invalid"],
          }));
          toast.error("Email already exists or is invalid");
        } else if (errorMessage.toLowerCase().includes("phone")) {
          setErrors((prev) => ({
            ...prev,
            primary_phone: ["Phone number already exists"],
          }));
          toast.error("Phone number already exists");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 409) {
        toast.error("Account already exists with this information");
      } else if (error.response?.status === 500) {
        toast.error("Server error. Please try again later.");
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip? Contact information is required for account creation."
    );
    if (confirmSkip) {
      toast.info("Skipping contact information...");
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  };

  const ErrorMessage = ({ errors, field }) => {
    if (!errors[field]) return null;
    return (
      <div style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
        {errors[field].map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="registration-container">
      {/* Enhanced ToastContainer with better configuration */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        closeButton={false}
      />

      <div className="left-panel2">
        <img src="/Rectangle-three.png" alt="Shop Owner" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Business Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <form onSubmit={handleSubmit}>
          <div className="form-content2">
            <h2 className="section-title">▶ Add Contact Information</h2>

            <div className="section">
              <label>Primary Contact Number*</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="primary_phone"
                  value={contact.primary_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength={10}
                  required
                  placeholder="Enter number"
                />
              </div>
              <ErrorMessage errors={errors} field="primary_phone" />
            </div>

            <div className="section">
              <label>Alternate Contact Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="secondary_phone"
                  value={contact.secondary_phone}
                  maxLength={10}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter number"
                />
              </div>
              <ErrorMessage errors={errors} field="secondary_phone" />
            </div>

            <div className="section">
              <label>WhatsApp Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="whatsapp_number"
                  maxLength={10}
                  value={contact.whatsapp_number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  placeholder="Enter number"
                />
              </div>
              <ErrorMessage errors={errors} field="whatsapp_number" />
            </div>

            <div className="section">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={contact.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Enter your email"
              />
              <ErrorMessage errors={errors} field="email" />
            </div>

            <div className="section">
              <label>Enter Password</label>
              <input
                type="password"
                name="password"
                value={contact.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Enter password"
              />
              <ErrorMessage errors={errors} field="password" />
            </div>

            <div className="section">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                value={contact.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Confirm password"
              />
              <ErrorMessage errors={errors} field="confirm_password" />
            </div>
          </div>
          {/* Navigation Footer */}
          <div className="button-row">
            <div className="left-buttons">
              <button className="back-btn2" type="button" onClick={handleBack}>
                Back
              </button>
            </div>
            <div className="right-buttons">
              <button className="skip-btn2" type="button" onClick={handleSkip}>
                Skip
              </button>
              <button className="next-btn2" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoForm;
