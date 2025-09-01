import React, { useState, useEffect } from "react";
import "./BothRegistrationForm.css";
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../Pages/ProgressSteps";

const BothRegistrationForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shop_name: "",
    owner_name: "",
    address: "",
    state: "",
    city: "",
    category: "",
  });

  const [errors, setErrors] = useState({});
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Load both info from localStorage when component mounts
  useEffect(() => {
    const savedBothInfo = localStorage.getItem("bothInfo");
    if (savedBothInfo) {
      try {
        const parsedData = JSON.parse(savedBothInfo);
        console.log("Loading bothInfo from localStorage:", parsedData);
        setForm(parsedData);
      } catch (error) {
        console.error("Error parsing localStorage bothInfo:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("bothInfo");
      }
    }
  }, []);

  // Validation functions
  const validateShopName = (shopName) => {
    const errors = [];

    if (!shopName.trim()) {
      errors.push("Service name is required");
      return errors;
    }

    if (shopName.trim().length < 2) {
      errors.push("Service name must be at least 2 characters long");
    }

    if (shopName.trim().length > 100) {
      errors.push("Service name must not exceed 100 characters");
    }

    // Check for valid characters (allow letters, numbers, spaces, and common business punctuation)
    const validNameRegex = /^[a-zA-Z0-9\s\-&,.()'"]+$/;
    if (!validNameRegex.test(shopName.trim())) {
      errors.push("Service name contains invalid characters");
    }

    // Check for inappropriate content
    const inappropriateWords = ["test", "dummy", "fake", "spam"];
    if (
      inappropriateWords.some((word) => shopName.toLowerCase().includes(word))
    ) {
      errors.push("Please enter a valid service name");
    }

    return errors;
  };

  const validateOwnerName = (ownerName) => {
    const errors = [];

    if (!ownerName.trim()) {
      errors.push("Owner name is required");
      return errors;
    }

    if (ownerName.trim().length < 2) {
      errors.push("Owner name must be at least 2 characters long");
    }

    if (ownerName.trim().length > 50) {
      errors.push("Owner name must not exceed 50 characters");
    }

    // Check for valid characters (only letters, spaces, dots, apostrophes)
    const validNameRegex = /^[a-zA-Z\s.'-]+$/;
    if (!validNameRegex.test(ownerName.trim())) {
      errors.push(
        "Owner name can only contain letters, spaces, dots, and apostrophes"
      );
    }

    // Check for minimum number of letters (at least 2 alphabetic characters)
    const letterCount = (ownerName.match(/[a-zA-Z]/g) || []).length;
    if (letterCount < 2) {
      errors.push("Owner name must contain at least 2 letters");
    }

    return errors;
  };

  const validateAddress = (address) => {
    const errors = [];

    if (!address.trim()) {
      errors.push("Full address is required");
      return errors;
    }

    if (address.trim().length < 10) {
      errors.push("Address must be at least 10 characters long");
    }

    if (address.trim().length > 500) {
      errors.push("Address must not exceed 500 characters");
    }

    // Check for valid characters (allow letters, numbers, spaces, and common address punctuation)
    const validAddressRegex = /^[a-zA-Z0-9\s\-,./()#&'"]+$/;
    if (!validAddressRegex.test(address.trim())) {
      errors.push("Address contains invalid characters");
    }

    // Check if address has some structure (contains at least one number or common address words)
    const hasNumber = /\d/.test(address);
    const hasAddressWords =
      /\b(street|st|road|rd|avenue|ave|lane|ln|plot|house|no|building|floor|area|sector|block|near|opp|opposite)\b/i.test(
        address
      );

    if (!hasNumber && !hasAddressWords) {
      errors.push("Please enter a complete address with street/area details");
    }

    return errors;
  };

  const validateState = (state) => {
    const errors = [];

    if (!state.trim()) {
      errors.push("State is required");
      return errors;
    }

    if (state.trim().length < 2) {
      errors.push("State name must be at least 2 characters long");
    }

    if (state.trim().length > 50) {
      errors.push("State name must not exceed 50 characters");
    }

    // Check for valid characters (only letters, spaces, dots, hyphens)
    const validStateRegex = /^[a-zA-Z\s.-]+$/;
    if (!validStateRegex.test(state.trim())) {
      errors.push(
        "State name can only contain letters, spaces, dots, and hyphens"
      );
    }

    return errors;
  };

  const validateCity = (city) => {
    const errors = [];

    if (!city.trim()) {
      errors.push("City is required");
      return errors;
    }

    if (city.trim().length < 2) {
      errors.push("City name must be at least 2 characters long");
    }

    if (city.trim().length > 50) {
      errors.push("City name must not exceed 50 characters");
    }

    // Check for valid characters (only letters, spaces, dots, hyphens)
    const validCityRegex = /^[a-zA-Z\s.-]+$/;
    if (!validCityRegex.test(city.trim())) {
      errors.push(
        "City name can only contain letters, spaces, dots, and hyphens"
      );
    }

    return errors;
  };

  const validateCategory = (category) => {
    const errors = [];

    if (!category) {
      errors.push("Please select a business category");
    }

    return errors;
  };

  const validateField = (name, value) => {
    let fieldErrors = [];

    switch (name) {
      case "shop_name":
        fieldErrors = validateShopName(value);
        break;
      case "owner_name":
        fieldErrors = validateOwnerName(value);
        break;
      case "address":
        fieldErrors = validateAddress(value);
        break;
      case "state":
        fieldErrors = validateState(value);
        break;
      case "city":
        fieldErrors = validateCity(value);
        break;
      case "category":
        fieldErrors = validateCategory(value);
        break;
      default:
        break;
    }

    return fieldErrors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    Object.keys(form).forEach((key) => {
      const fieldErrors = validateField(key, form[key]);
      if (fieldErrors.length > 0) {
        newErrors[key] = fieldErrors;
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

    // Trim leading/trailing spaces for name fields
    if (["shop_name", "owner_name", "state", "city"].includes(name)) {
      // Remove leading spaces and limit consecutive spaces to one
      processedValue = value.replace(/^\s+/, "").replace(/\s{2,}/g, " ");
    }

    setForm({ ...form, [name]: processedValue });

    // Real-time validation - clear errors when user starts typing
    if (processedValue.trim()) {
      clearError(name);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Validate field on blur
    const fieldErrors = validateField(name, value);
    if (fieldErrors.length > 0) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors }));
    }
  };

  const handleCategorySelect = (category) => {
    setForm((prev) => ({ ...prev, category }));

    // Clear category error when selected
    clearError("category");
  };

  const allFilled = Object.values(form).every(
    (f) => f && f.toString().trim() !== ""
  );

  const handleNext = () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Trim all string values before saving
    const trimmedForm = {
      ...form,
      shop_name: form.shop_name.trim(),
      owner_name: form.owner_name.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      city: form.city.trim(),
    };

    localStorage.setItem("bothInfo", JSON.stringify(trimmedForm));
    console.log("Storing bothInfo:", trimmedForm);
    navigate("/BothBusinessOperatingDetails");
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    localStorage.setItem("bothInfo", JSON.stringify(form));
    navigate("/BothBusinessOperatingDetails");
  };

  const categories = [
    "Grocery",
    "Bakery",
    "Gifts & Custom Products",
    "Pet Care",
    "Hardware & Utilities",
    "Fashion Accessories",
    "Stationery & Printing",
    "Beauty",
    "Furniture & Decor",
    "Kitchen",
  ];

  const additionalCategories = [
    "Electronics",
    "Books & Education",
    "Sports & Fitness",
    "Health & Medical",
    "Automotive",
    "Photography",
    "Music & Instruments",
    "Toys & Games",
    "Travel & Tourism",
    "Real Estate",
    "Legal Services",
    "Financial Services",
    "Construction",
    "Agriculture",
    "Textile & Clothing",
  ];

  const allCategories = [...categories, ...additionalCategories];
  const displayedCategories = showAllCategories ? allCategories : categories;

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

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
      <div className="left-panel2">
        <img src="/Rectangle-one.png" alt="Business Owner" />
        {/* <div className="left-logo">LeeShop</div>
        <p className="quote">
          "Strengthen local commerce by connecting nearby sellers, services,
          and customers to promote sustainability."
        </p> */}
      </div>

      <div className="right-panel_2">
        {/* Progress Header - Added to fix the gap */}
        <ProgressSteps
          title={"Business Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content2">
          <h2 className="section-title">Basic Business & Shop Location Info</h2>
          <div className="form-row">
            <div className="input-wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 700, // 700 = Bold
                    fontSize: "20px",
                    color: "#0A5C15",
                  }}
                >
                  Shop Name
                </span>
                <input
                  type="text"
                  name="shop_name"
                  placeholder="Enter your Shop Name."
                  value={form.shop_name}
                  onChange={handleChange}
                  required
                />
                {errors.shop_name && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.shop_name}
                  </div>
                )}
              </div>
            </div>
            <div className="input-wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#0A5C15",
                  }}
                >
                  Owner Name
                </span>
                <input
                  type="text"
                  name="owner_name"
                  placeholder="Enter Owner Name."
                  value={form.owner_name}
                  onChange={handleChange}
                  required
                />
                {errors.owner_name && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.owner_name}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="category-section">
            <label>Business Category</label>
            <div className="categories">
              {displayedCategories.map((category, index) => (
                <button
                  key={index}
                  type="button"
                  className={`category-btn ${
                    form.category === category ? "selected" : ""
                  }`}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </button>
              ))}
              <button
                type="button"
                className="category-btn view-more"
                onClick={() => setShowAllCategories(!showAllCategories)}
              >
                {showAllCategories ? "View less" : "View more"}
              </button>
            </div>
            <ErrorMessage errors={errors} field="category" />
          </div>
          <span
            style={{
              fontFamily: "Raleway",
              fontWeight: 700,
              fontSize: "20px",
              color: "#0A5C15",
            }}
          >
            Full Address
          </span>
          <textarea
            name="address"
            placeholder="Enter your Shop Address."
            className="address-box"
            value={form.address}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={500}
            required
          ></textarea>
          <ErrorMessage errors={errors} field="address" />
          <div className="form-row">
            <div className="input-wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#0A5C15",
                  }}
                >
                  State
                </span>
                <input
                  type="text"
                  name="state"
                  placeholder="Enter the State your shop is in."
                  value={form.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.state && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.state}
                  </div>
                )}
              </div>
            </div>
            <div className="input-wrapper">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Raleway",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "#0A5C15",
                  }}
                >
                  City
                </span>

                <input
                  type="text"
                  name="city"
                  placeholder="Enter your City."
                  value={form.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.city && (
                  <div
                    style={{
                      color: "red",
                      fontSize: "14px",
                      marginTop: "4px",
                    }}
                  >
                    {errors.city}
                  </div>
                )}
              </div>
            </div>
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

export default BothRegistrationForm;
