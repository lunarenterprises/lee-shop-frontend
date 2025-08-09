import React, { useEffect, useState } from "react";
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

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

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
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleNext = () => {
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
              <input
                type="text"
                name="shop_name"
                placeholder="Enter your Shop Name."
                value={formData.shop_name}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="owner_name"
                placeholder="Enter Owner Name."
                value={formData.owner_name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="section">
            <div className="category-section">
              <label>Business Category</label>
              <div className="categories">
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
            </div>
          </div>

          <div className="section">
            <textarea
              name="address"
              placeholder="Enter your Shop Address."
              className="address-box"
              value={formData.address}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="section">
            <div className="form-row">
              <input
                type="text"
                name="state"
                placeholder="Enter the State your shop is in."
                value={formData.state}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="city"
                placeholder="Enter your City."
                value={formData.city}
                onChange={handleChange}
                required
              />
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
            <button
              className="next-btn2"
              type="button"
              onClick={handleNext}
              disabled={!allFilled}
              style={{
                opacity: allFilled ? 1 : 0.5,
                cursor: allFilled ? "pointer" : "not-allowed",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;
