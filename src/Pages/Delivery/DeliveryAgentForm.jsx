import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAgentForm.css";
import ProgressSteps from "../ProgressSteps";

const DeliveryAgentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp_contact: "",
    secondary_mobile: "",
    location: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp_contact: "",
    location: "",
  });

  // State to track if form has been submitted (for showing validation)
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: true, active: true },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Full name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile.trim()) {
      return "Mobile number is required";
    }
    // Indian mobile number validation (10 digits starting with 6,7,8,9)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile.trim())) {
      return "Please enter a valid 10-digit mobile number";
    }
    return "";
  };

  const validateWhatsApp = (whatsapp) => {
    if (!whatsapp.trim()) {
      return "WhatsApp number is required";
    }
    // Same validation as mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(whatsapp.trim())) {
      return "Please enter a valid 10-digit WhatsApp number";
    }
    return "";
  };

  const validateLocation = (location) => {
    if (!location.trim()) {
      return "Location selection is required";
    }
    return "";
  };

  // Validate single field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "mobile":
        error = validateMobile(value);
        break;
      case "whatsapp_contact":
        error = validateWhatsApp(value);
        break;
      case "location":
        error = validateLocation(value);
        break;
      default:
        break;
    }
    return error;
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      mobile: validateMobile(form.mobile),
      whatsapp_contact: validateWhatsApp(form.whatsapp_contact),
      location: validateLocation(form.location),
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        setForm((prevForm) => ({ ...prevForm, ...parsedData }));
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For mobile numbers, only allow digits and limit to 10 characters
    if (name === "mobile" || name === "whatsapp_contact") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, [name]: numericValue });

      // Clear error when user starts typing (if form was submitted)
      if (isSubmitted) {
        const error = validateField(name, numericValue);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    } else {
      setForm({ ...form, [name]: value });

      // Clear error when user starts typing (if form was submitted)
      if (isSubmitted) {
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (isSubmitted) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  // Fields that are required - removed secondary_mobile as it's not in the design
  const requiredFields = [
    form.name,
    form.email,
    form.mobile,
    form.whatsapp_contact,
    form.location,
  ];
  const allFilled = requiredFields.every(
    (f) => !!f && f.toString().trim() !== ""
  );

  const handleNext = () => {
    setIsSubmitted(true);

    // Validate all fields
    if (validateAllFields()) {
      // Save data for next steps
      const saved = JSON.parse(
        localStorage.getItem("deliveryAgentData") || "{}"
      );
      localStorage.setItem(
        "deliveryAgentData",
        JSON.stringify({ ...saved, ...form })
      );
      console.log(
        "Storing deliveryAgentData:",
        JSON.stringify({ ...saved, ...form })
      );
      navigate("/DeliveryDetails");
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/DeliveryDetails");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/DeliveryImage.png" alt="Delivery Agent Illustration" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content3">
          <h2 className="section-title">▶ Personal Information</h2>

          <div className="section">
            <label className="form-label">Full Name*</label>
            <input
              name="name"
              className={`form-input ${
                isSubmitted && errors.name ? "error" : ""
              }`}
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your Name"
              required
            />
            {isSubmitted && errors.name && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: "0.875rem",
                  marginTop: "4px",
                }}
              >
                {errors.name}
              </div>
            )}
          </div>

          <div className="section">
            <label className="form-label">Mobile Number*</label>
            <div className="input-group">
              <span className="country-code">🇮🇳 +91</span>
              <input
                name="mobile"
                type="tel"
                className={`form-input ${
                  isSubmitted && errors.mobile ? "error" : ""
                }`}
                value={form.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
            </div>
            {isSubmitted && errors.mobile && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: "0.875rem",
                  marginTop: "-10px",
                }}
              >
                {errors.mobile}
              </div>
            )}
          </div>

          <div className="section">
            <label className="form-label">What's app Number*</label>
            <input
              name="whatsapp_contact"
              type="tel"
              className={`form-input ${
                isSubmitted && errors.whatsapp_contact ? "error" : ""
              }`}
              value={form.whatsapp_contact}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              placeholder="Enter 10-digit WhatsApp number"
              maxLength="10"
            />
            {isSubmitted && errors.whatsapp_contact && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: "0.875rem",
                  marginTop: "4px",
                }}
              >
                {errors.whatsapp_contact}
              </div>
            )}
          </div>

          <div className="section">
            <label className="form-label">Email Address*</label>
            <input
              name="email"
              type="email"
              className={`form-input ${
                isSubmitted && errors.email ? "error" : ""
              }`}
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your Email"
              required
            />
            {isSubmitted && errors.email && (
              <div
                style={{
                  color: "#d32f2f",
                  fontSize: "0.875rem",
                  marginTop: "4px",
                }}
              >
                {errors.email}
              </div>
            )}
          </div>

          <div className="section">
            <label className="form-label">Choose your Location*</label>
            <div className="input-group">
              <span className="input-icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: "#666" }}
                >
                  <path
                    d="M12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.3283 14.4353 9.65339 14.3097 9.95671C14.1841 10.26 13.9999 10.5356 13.7678 10.7678C13.5356 10.9999 13.26 11.1841 12.9567 11.3097C12.6534 11.4353 12.3283 11.5 12 11.5ZM12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z"
                    fill="#0A5C15"
                  />
                </svg>
              </span>
              <select
                name="location"
                className={`form-input ${
                  isSubmitted && errors.location ? "error" : ""
                }`}
                value={form.location}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select your Location</option>
                <option value="Autraval">Autraval</option>
                <option value="Chennai">Chennai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
              {isSubmitted && errors.location && (
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "0.875rem",
                    marginTop: "-10px",
                    display: "block",
                  }}
                >
                  {errors.location}
                </div>
              )}
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
            <button className="next-btn2" type="button" onClick={handleNext}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentForm;
