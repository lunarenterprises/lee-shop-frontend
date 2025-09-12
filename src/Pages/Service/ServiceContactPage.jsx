import { useEffect, useState } from "react";
import "./ServiceContactPage.css";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../ProgressSteps";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const ServiceContactPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    primaryContact: "",
    alternateContact: "",
    whatsappNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [merged, setMerged] = useState(null);

  // Enhanced validation functions from ContactInfoForm
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
    // Only check uniqueness between primary and alternate phone
    // WhatsApp can be same as either primary or alternate

    if (phones.primaryContact.trim() && phones.alternateContact.trim()) {
      const primaryClean = phones.primaryContact.replace(/\D/g, "");
      const alternateClean = phones.alternateContact.replace(/\D/g, "");

      if (primaryClean === alternateClean) {
        errors.alternateContact = [
          "Alternate phone number must be different from primary phone number",
        ];
      }
    }

    return errors;
  };

  useEffect(() => {
    const businessType = localStorage.getItem("businessType");
    const businessInfo = JSON.parse(
      localStorage.getItem("serviceInfo") || "{}"
    );
    const operatingDetails = JSON.parse(
      localStorage.getItem("serviceOperatingDetails") || "{}"
    );
    const brandingDetails = JSON.parse(
      localStorage.getItem("serviceRegistration") || "{}"
    );
    const brandingImageFiles = window.serviceImageFiles || [];

    setMerged({
      service_or_shop:
        businessType === "product-seller"
          ? "shop"
          : businessType === "service-provider"
          ? "service"
          : "both",
      shop_name: businessInfo.shopName,
      owner_name: businessInfo.ownerName,
      shop_address: businessInfo.shopAddress,
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
      category_name: businessInfo.businessCategory || "grocery",
      image: brandingImageFiles,
    });
  }, []);

  const validateField = (name, value, allValues = formData) => {
    let fieldErrors = [];

    switch (name) {
      case "primaryContact":
        fieldErrors = validatePhone(value, "Primary contact number");
        break;
      case "alternateContact":
        if (value.trim()) {
          // Only validate if provided (optional field)
          fieldErrors = validatePhone(value, "Alternate contact number");
        }
        break;
      case "whatsappNumber":
        if (value.trim()) {
          // Only validate if provided (optional field)
          fieldErrors = validatePhone(value, "WhatsApp number");
        }
        break;
      case "email":
        if (value.trim()) {
          // Only validate if provided (optional field)
          fieldErrors = validateEmail(value);
        }
        break;
      case "password":
        fieldErrors = validatePassword(value);
        break;
      case "confirmPassword":
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
    Object.keys(formData).forEach((key) => {
      const fieldErrors = validateField(key, formData[key]);
      if (fieldErrors.length > 0) {
        newErrors[key] = fieldErrors;
      }
    });

    // Check for phone number uniqueness
    const phoneUniquenessErrors = validatePhoneUniqueness(formData);
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

  const handleInputChange = (field, value) => {
    let processedValue = value;

    // Remove non-numeric characters for phone inputs and limit to 10 digits
    if (
      ["primaryContact", "alternateContact", "whatsappNumber"].includes(field)
    ) {
      processedValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Real-time validation - clear errors when user starts typing
    if (processedValue.trim()) {
      clearError(field);

      // For confirm password, also clear password errors if they now match
      if (field === "confirmPassword" && processedValue === formData.password) {
        clearError("confirmPassword");
      }

      // For password, also validate confirm password if it exists
      if (field === "password" && formData.confirmPassword) {
        const confirmErrors = validateConfirmPassword(
          processedValue,
          formData.confirmPassword
        );
        if (confirmErrors.length === 0) {
          clearError("confirmPassword");
        }
      }
    }
  };

  const handleBlur = (field, value) => {
    // Validate field on blur
    const fieldErrors = validateField(field, value);
    if (fieldErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors }));
    }

    // Check phone uniqueness on blur (only for primary and alternate)
    if (["primaryContact", "alternateContact"].includes(field)) {
      const phoneUniquenessErrors = validatePhoneUniqueness(formData);
      if (phoneUniquenessErrors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: [...(prev[field] || []), ...phoneUniquenessErrors[field]],
        }));
      }
    }
  };

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ];

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    const confirmSkip = window.confirm(
      "Are you sure you want to skip? Contact information is important for service providers."
    );
    if (confirmSkip) {
      toast.info("Skipping contact information...");
      setTimeout(() => {
        navigate("/ShopProfileLayout");
      }, 1000);
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

    setIsSubmitting(true);
    toast.info("Submitting your information...");

    const data = {
      ...merged,
      primary_phone: formData.primaryContact,
      secondary_phone: formData.alternateContact,
      whatsapp_number: formData.whatsappNumber,
      email: formData.email.trim(),
      password: formData.password,
    };

    // Log data object before sending
    console.log("Data to submit:", data);

    const submitFormData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "image" && Array.isArray(data.image)) {
        data.image.forEach((file) => submitFormData.append("image", file));
      } else if (Array.isArray(data[key])) {
        // Send arrays as JSON strings (backend expects actual array)
        submitFormData.append(key, JSON.stringify(data[key]));
      } else {
        submitFormData.append(key, data[key]);
      }
    });

    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/shop",
        submitFormData
      );
      setIsSubmitting(false);

      if (response.data?.result) {
        toast.success("Registration successful! Redirecting...");

        // Clear specific business registration related localStorage items
        localStorage.removeItem("businessType");
        localStorage.removeItem("serviceInfo");
        localStorage.removeItem("serviceOperatingDetails");
        localStorage.removeItem("serviceRegistration");
        localStorage.removeItem("bothInfo");

        // Clear any other related data
        window.serviceImageFiles = null;

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
      setIsSubmitting(false);
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
            primaryContact: ["Phone number already exists"],
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

  // Error display component
  const ErrorMessage = ({ errors, field }) => {
    if (!errors[field]) return null;
    return (
      <div
        className="error-message"
        style={{ color: "#dc3545", fontSize: "12px", marginTop: "5px" }}
      >
        {errors[field].map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="registration-container">
      {/* Enhanced ToastContainer */}
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
        <img src="/Rectangle25.png" alt="Shop Owner" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Service Registration."}
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
                  placeholder="Enter number"
                  value={formData.primaryContact}
                  onChange={(e) =>
                    handleInputChange("primaryContact", e.target.value)
                  }
                  onBlur={(e) => handleBlur("primaryContact", e.target.value)}
                  maxLength={10}
                  style={{
                    borderColor: errors.primaryContact ? "#dc3545" : "",
                  }}
                />
              </div>
              <ErrorMessage errors={errors} field="primaryContact" />
            </div>

            <div className="section">
              <label>Alternate Contact Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={formData.alternateContact}
                  onChange={(e) =>
                    handleInputChange("alternateContact", e.target.value)
                  }
                  onBlur={(e) => handleBlur("alternateContact", e.target.value)}
                  maxLength={10}
                  style={{
                    borderColor: errors.alternateContact ? "#dc3545" : "",
                  }}
                />
              </div>
              <ErrorMessage errors={errors} field="alternateContact" />
            </div>

            <div className="section">
              <label>WhatsApp Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={formData.whatsappNumber}
                  onChange={(e) =>
                    handleInputChange("whatsappNumber", e.target.value)
                  }
                  onBlur={(e) => handleBlur("whatsappNumber", e.target.value)}
                  maxLength={10}
                  style={{
                    borderColor: errors.whatsappNumber ? "#dc3545" : "",
                  }}
                />
              </div>
              <ErrorMessage errors={errors} field="whatsappNumber" />
            </div>

            <div className="section">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                style={{ borderColor: errors.email ? "#dc3545" : "" }}
              />
              <ErrorMessage errors={errors} field="email" />
            </div>

            <div className="section">
              <label>Enter Password*</label>
              <input
                type="password"
                placeholder="Enter a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                style={{ borderColor: errors.password ? "#dc3545" : "" }}
              />
              <ErrorMessage errors={errors} field="password" />
            </div>

            <div className="section">
              <label>Confirm Password*</label>
              <input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                style={{ borderColor: errors.confirmPassword ? "#dc3545" : "" }}
              />
              <ErrorMessage errors={errors} field="confirmPassword" />
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
              <button
                className="next-btn2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceContactPage;
