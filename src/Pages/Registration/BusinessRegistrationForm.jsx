import { useEffect, useState } from "react";
import "./BusinessRegistrationForm.css"; // renamed CSS file
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../ProgressSteps";

const BusinessRegistrationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shop_name: "",
    owner_name: "",
    address: "",
    state: "",
    city: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    shop_name: "",
    owner_name: "",
    address: "",
    state: "",
    city: "",
    category: "",
  });

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "shop_name":
        if (!value.trim()) {
          error = "Shop name is required";
        } else if (value.trim().length < 2) {
          error = "Shop name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Shop name must not exceed 50 characters";
        } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(value.trim())) {
          error = "Shop name contains invalid characters";
        }
        break;

      case "owner_name":
        if (!value.trim()) {
          error = "Owner name is required";
        } else if (value.trim().length < 2) {
          error = "Owner name must be at least 2 characters";
        } else if (value.trim().length > 30) {
          error = "Owner name must not exceed 30 characters";
        } else if (!/^[a-zA-Z\s.]+$/.test(value.trim())) {
          error = "Owner name should only contain letters";
        }
        break;

      case "address":
        if (!value.trim()) {
          error = "Address is required";
        } else if (value.trim().length < 10) {
          error = "Address must be at least 10 characters";
        } else if (value.trim().length > 200) {
          error = "Address must not exceed 200 characters";
        }
        break;

      case "state":
        if (!value.trim()) {
          error = "State is required";
        } else if (value.trim().length < 2) {
          error = "State name must be at least 2 characters";
        } else if (value.trim().length > 30) {
          error = "State name must not exceed 30 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "State name should only contain letters";
        }
        break;

      case "city":
        if (!value.trim()) {
          error = "City is required";
        } else if (value.trim().length < 2) {
          error = "City name must be at least 2 characters";
        } else if (value.trim().length > 30) {
          error = "City name must not exceed 30 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value.trim())) {
          error = "City name should only contain letters";
        }
        break;

      case "category":
        if (!value) {
          error = "Please select a business category";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      newErrors[key] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  // All required fields check
  const allFilled = Object.values(formData).every(
    (v) => v && v.toString().trim() !== ""
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));

    // Clear category error when selected
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      return; // Don't proceed if validation fails
    }

    // Save to localStorage
    localStorage.setItem("businessInfo", JSON.stringify(formData));
    console.log("Storing businessInfo:", formData);
    navigate("/BusinessOperatingDetails");
  };

  useEffect(() => {
    const savedBusinessInfo = localStorage.getItem("businessInfo");
    if (savedBusinessInfo) {
      try {
        const parsedData = JSON.parse(savedBusinessInfo);
        console.log("Loading businessInfo from localStorage:", parsedData);
        setFormData(parsedData);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("businessInfo");
      }
    }
  }, []);

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    // Optionally: set what you have, or leave last data
    localStorage.setItem("businessInfo", JSON.stringify(formData));
    navigate("/BusinessOperatingDetails");
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

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Rectangle-one.png"
          alt="Business Owner"
          className="left-image2"
        />
      </div>

      <div className="right-panel_2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Business Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content2">
          <h2 className="section-title">
            ▶ Basic Business & Shop Location Info
          </h2>

          <div className="section">
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
                    value={formData.shop_name}
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
                    value={formData.owner_name}
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
          </div>
          <div className="section">
            <div className="category-section">
              <label>Business Category</label>
              <div className="categories" style={{ marginTop: "10px" }}>
                {categories.map((category, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`category-btn ${
                      formData.category === category ? "selected" : ""
                    }`}
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              {errors.category && (
                <div
                  style={{ color: "red", fontSize: "14px", marginTop: "4px" }}
                >
                  {errors.category}
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <div className="input-wrapper">
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
                value={formData.address}
                onChange={handleChange}
                required
              ></textarea>
              {errors.address && (
                <div style={{ color: "red", fontSize: "14px" }}>
                  {errors.address}
                </div>
              )}
            </div>
          </div>

          <div className="section">
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
                    value={formData.state}
                    onChange={handleChange}
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
                    value={formData.city}
                    onChange={handleChange}
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

export default BusinessRegistrationForm;
