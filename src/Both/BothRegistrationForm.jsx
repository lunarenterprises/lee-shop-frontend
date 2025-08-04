import React, { useState } from 'react';
import './BothRegistrationForm.css';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategorySelect = (category) => setForm((prev) => ({ ...prev, category }));

  const allFilled = Object.values(form).every(f => f && f.toString().trim() !== "");

  const handleNext = () => {
    localStorage.setItem("bothInfo", JSON.stringify(form));
    navigate("/BothBusinessOperatingDetails");
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    localStorage.setItem("bothInfo", JSON.stringify(form));
    navigate("/BothBusinessOperatingDetails");
  };

  const categories = [
    'Grocery',
    'Bakery',
    'Gifts & Custom Products',
    'Pet Care',
    'Hardware & Utilities',
    'Fashion Accessories',
    'Stationery & Printing',
    'Beauty',
    'Furniture & Decor',
    'Kitchen',
  ];

  return (
    <div className="registration-container">
      <div className="left-panel">
        <img
          src="/Rectangle-one.png"
          alt="Business Owner"
          className="left-image"
        />
        {/* <div className="left-logo">LeeShop</div>
        <p className="quote">
          “Strengthen local commerce by connecting nearby sellers, services,
          and customers to promote sustainability.”
        </p> */}
      </div>

      <div className="right-panel">
        <div className="registration-step">Business Registration.</div>
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
                className={`category-btn ${form.category === category ? "selected" : ""}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </button>
            ))}
            <button type="button" className="category-btn view-more">View more</button>
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
        <div className="button-row">
          <button className="back-btn" type="button" onClick={handleBack}>Back</button>
          <button className="skip-btn" type="button" onClick={handleSkip}>Skip</button>
          <button
            className="next-btn"
            type="button"
            onClick={handleNext}
            disabled={!allFilled}
            style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default BothRegistrationForm;
