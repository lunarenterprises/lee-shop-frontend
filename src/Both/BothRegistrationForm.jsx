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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategorySelect = (category) =>
    setForm((prev) => ({ ...prev, category }));

  const allFilled = Object.values(form).every(
    (f) => f && f.toString().trim() !== ""
  );

  const handleNext = () => {
    localStorage.setItem("bothInfo", JSON.stringify(form));
    console.log("Storing bothInfo:", form);
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

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Rectangle-one.png"
          alt="Business Owner"
        />
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
            <input
              type="text"
              name="shop_name"
              placeholder="Enter your Shop Name."
              value={form.shop_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="owner_name"
              placeholder="Enter Owner Name."
              value={form.owner_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="category-section">
            <label>Business Category</label>
            <div className="categories">
              {categories.map((category, index) => (
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
              <button type="button" className="category-btn view-more">
                View more
              </button>
            </div>
          </div>
          <textarea
            name="address"
            placeholder="Enter your Shop Address."
            className="address-box"
            value={form.address}
            onChange={handleChange}
            required
          ></textarea>
          <div className="form-row">
            <input
              type="text"
              name="state"
              placeholder="Enter your State your shop in."
              value={form.state}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="Enter your City."
              value={form.city}
              onChange={handleChange}
              required
            />
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

export default BothRegistrationForm;