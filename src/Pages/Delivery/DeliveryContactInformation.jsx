import React, { useState, useEffect } from "react";
import "./DeliveryContactInformation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressSteps from "../ProgressSteps";

const DeliveryContactInformation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    primary_phone: "",
    secondary_phone: "",
    whatsapp_contact: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ];

  // Validation functions
  const validatePhone = (phone) => {
    if (!phone) return "";
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return "Please enter a valid 10-digit mobile number starting with 6-9";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword, password) => {
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) {
      return "Passwords do not match";
    }
    return "";
  };

  // Validate all fields
  const validateField = (name, value, allValues = form) => {
    switch (name) {
      case "primary_phone":
        return !value
          ? "Primary contact number is required"
          : validatePhone(value);
      case "secondary_phone":
        return validatePhone(value);
      case "whatsapp_contact":
        return validatePhone(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      case "confirm_password":
        return validateConfirmPassword(value, allValues.password);
      default:
        return "";
    }
  };

  // Validate form on change
  const validateForm = (formData) => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key], formData);
      if (error) newErrors[key] = error;
    });
    return newErrors;
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        const newForm = {
          ...form,
          primary_phone: parsedData.mobile || "",
          secondary_phone: parsedData.secondary_mobile || "",
          whatsapp_contact: parsedData.whatsapp_contact || "",
          email: parsedData.email || "",
        };
        setForm(newForm);

        // Validate loaded data
        const newErrors = validateForm(newForm);
        setErrors(newErrors);
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  // Generic input handler with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);

    // Validate the changed field
    if (touched[name] || value) {
      const error = validateField(name, value, newForm);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  // Handle field blur (when user leaves field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, value, form);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  // Check for duplicate phone numbers
  const checkDuplicatePhones = (formData) => {
    const phones = [
      formData.primary_phone,
      formData.secondary_phone,
    ].filter((phone) => phone && phone.trim());
    const uniquePhones = [...new Set(phones)];
    return phones.length !== uniquePhones.length;
  };

  // Merge all step data and files and submit to API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      primary_phone: true,
      secondary_phone: true,
      whatsapp_contact: true,
      email: true,
      password: true,
      confirm_password: true,
    });

    // Validate all fields
    const formErrors = validateForm(form);

    // Check for duplicate phone numbers
    if (checkDuplicatePhones(form)) {
      formErrors.phone_duplicate =
        "Primary, secondary, and WhatsApp numbers must be different";
    }

    setErrors(formErrors);

    // Check if there are any errors
    if (Object.keys(formErrors).length > 0) {
      // Find first error field and focus it
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(
        `input[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.focus();
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    try {
      // Collect previous step data & files
      const stepData = JSON.parse(
        localStorage.getItem("deliveryAgentData") || "{}"
      );
      const licenceFile = window.deliveryAgentLicenceFile;
      const profileFile = window.deliveryAgentProfileFile;

      // Build FormData for file upload
      const submitData = new FormData();

      // Required API fields
      submitData.append("name", stepData.name || "");
      submitData.append("email", form.email || stepData.email || "");
      submitData.append("mobile", form.primary_phone || stepData.mobile || "");
      submitData.append(
        "secondary_mobile",
        form.secondary_phone || stepData.secondary_mobile || ""
      );
      submitData.append(
        "whatsapp_contact",
        form.whatsapp_contact || stepData.whatsapp_contact || ""
      );
      submitData.append("location", stepData.location || "");
      submitData.append("vehicle_type", stepData.vehicle_type || "");
      submitData.append("work_type", stepData.work_type || "");
      submitData.append("password", form.password);

      // Images
      if (profileFile) submitData.append("profile", profileFile);
      if (licenceFile) submitData.append("licence", licenceFile);

      // Post to your API
      const res = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/deliverystaff/register/delivery_staffs",
        submitData
      );

      setLoading(false);
      if (res.data && res.data.result) {
        alert("Registration successful!");
        // cleanup temp state
        localStorage.removeItem("deliveryAgentData");
        window.deliveryAgentProfileFile = null;
        window.deliveryAgentLicenceFile = null;
        navigate("/");
      } else {
        alert(res.data?.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);

      if (error.response?.data?.message) {
        alert(`Registration failed: ${error.response.data.message}`);
      } else if (error.response?.status === 409) {
        alert("User with this email or phone number already exists.");
      } else if (error.response?.status >= 500) {
        alert("Server error. Please try again later.");
      } else {
        alert(
          "Registration failed. Please check your connection and try again."
        );
      }
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/ShopProfileLayout");
  };

  // Check if required fields are filled and valid
  const requiredFields = [
    form.primary_phone,
    form.email,
    form.password,
    form.confirm_password,
  ];
  const allFilled = requiredFields.every(
    (f) => !!f && f.toString().trim() !== ""
  );
  const hasErrors = Object.keys(errors).some((key) => errors[key]);
  const isFormValid = allFilled && !hasErrors;

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Deliveryimage21.png"
          alt="Contact Information Illustration"
        />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content3">
          <h2 className="section-title">▶ Contact Information</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="section">
              <label className="form-label">Primary Contact Number*</label>
              <div className="input-group">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="primary_phone"
                  className={`form-input ${
                    errors.primary_phone ? "error" : ""
                  }`}
                  value={form.primary_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter number"
                  maxLength="10"
                  required
                />
              </div>
              {errors.primary_phone && (
                <div style={{ color: "red", marginTop:"-18px"}}>{errors.primary_phone}</div>
              )}
            </div>

            <div className="section">
              <label className="form-label">Alternate Contact Number</label>
              <div className="input-group">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="secondary_phone"
                  className={`form-input ${
                    errors.secondary_phone ? "error" : ""
                  }`}
                  value={form.secondary_phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter number"
                  maxLength="10"
                />
              </div>
              {errors.secondary_phone && (
                <div style={{ color: "red" }}>{errors.secondary_phone}</div>
              )}
            </div>

            <div className="section">
              <label className="form-label">WhatsApp Number</label>
              <div className="input-group">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  name="whatsapp_contact"
                  className={`form-input ${
                    errors.whatsapp_contact ? "error" : ""
                  }`}
                  value={form.whatsapp_contact}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter number"
                  maxLength="10"
                />
              </div>
              {errors.whatsapp_contact && (
                <div style={{ color: "red" }}>{errors.whatsapp_contact}</div>
              )}
            </div>

            {errors.phone_duplicate && (
              <div className="error-message global-error">
                {errors.phone_duplicate}
              </div>
            )}

            <div className="section">
              <label className="form-label">Email Address*</label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <div style={{ color: "red" }}>{errors.email}</div>
              )}
            </div>

            <div className="section">
              <label className="form-label">Enter Password*</label>
              <input
                type="password"
                name="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                required
              />
              {errors.password && (
                <div style={{ color: "red" }}>{errors.password}</div>
              )}
            </div>

            <div className="section">
              <label className="form-label">Confirm Password*</label>
              <input
                type="password"
                name="confirm_password"
                className={`form-input ${
                  errors.confirm_password ? "error" : ""
                }`}
                value={form.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm password"
                required
              />
              {errors.confirm_password && (
                <div style={{ color: "red" }}>{errors.confirm_password}</div>
              )}
            </div>
          </form>
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
            <button className="next-btn2" type="button" onClick={handleSubmit}>
              {loading ? "Submitting..." : "Submit →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryContactInformation;
