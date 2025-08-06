import React, { useState } from "react";
import "./BusinessRegistrationForm.css";
import { useNavigate } from "react-router-dom";

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

  // All required fields check
  const allFilled = Object.values(formData).every(v => v && v.toString().trim() !== "");

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

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    // Optionally: set what you have, or leave last data
    localStorage.setItem("businessInfo", JSON.stringify(formData));
    navigate("/BusinessOperatingDetails");
  };

  const categories = [
    "Grocery", "Bakery", "Gifts & Custom Products", "Pet Care", "Hardware & Utilities",
    "Fashion Accessories", "Stationery & Printing", "Beauty", "Furniture & Decor", "Kitchen"
  ];

  return (
    <div className="registration-container">
      <div className="left-panel">
        <img
          src="/Rectangle-one.png"
          alt="Business Owner"
          className="left-image"
        />
      </div>
      <div className="right-panel">
        <div className="registration-step">Business Registration.</div>
        <h2 className="section-title">Basic Business & Shop Location Info</h2>

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

        <div className="category-section">
          <label>Business Category</label>
          <div className="categories">
            {categories.map((category, index) => (
              <button
                type="button"
                key={index}
                className={`category-btn ${formData.category === category ? "selected" : ""}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <textarea
          name="address"
          placeholder="Enter your Shop Address."
          className="address-box"
          value={formData.address}
          onChange={handleChange}
          required
        ></textarea>

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

        <div className="button-row">
          <button className="back-button" type="button" onClick={handleBack}>
            Back
          </button>
          <button className="skip-btn" type="button" onClick={handleSkip}>
            Skip
          </button>
          <button
            className="next-btn"
            type="button"
            onClick={handleNext}
            disabled={!allFilled}
            style={{
              opacity: allFilled ? 1 : 0.5,
              cursor: allFilled ? "pointer" : "not-allowed"
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;
