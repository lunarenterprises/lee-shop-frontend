// BusinessRegistrationForm.jsx
import React from 'react';
import './BusinessRegistrationForm.css';
import { useNavigate } from 'react-router-dom';


const BusinessRegistrationForm = () => {
   const navigate = useNavigate();

  const handleNext = () => {
    navigate("/BusinessOperatingDetails");
  };
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

        {/* <div className="step-indicator">
          <span className="dot" />
          <span className="dot active" />
          <span className="dot" />
          <span className="dot" />
        </div> */}

        <h2 className="section-title">Basic Business & Shop Location Info</h2>

        <div className="form-row">
          <input type="text" placeholder="Enter your Shop Name." />
          <input type="text" placeholder="Enter Owner Name." />
        </div>

        <div className="category-section">
          <label>Business Category</label>
          <div className="categories">
            {['Grocery','Bakery','Gifts & Custom Products','Pet Care','Hardware & Utilities','Fashion Accessories','Stationery & Printing','Beauty','Furniture & Decor','Kitchen'].map((category, index) => (
              <button key={index} className="category-btn">{category}</button>
            ))}
            <button className="category-btn view-more">View more</button>
          </div>
        </div>

        <textarea placeholder="Enter your Shop Address." className="address-box"></textarea>

        <div className="form-row">
          <input type="text" placeholder="Enter your State your shop in." />
          <input type="text" placeholder="Enter your State your shop in." />
        </div>

        <div className="button-row">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
         <button className="next-btn" onClick={handleNext}>
      Next →
    </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessRegistrationForm;
