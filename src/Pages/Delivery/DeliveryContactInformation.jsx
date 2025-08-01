import React from "react";
import "./DeliveryContactInformation.css";
import { useNavigate } from "react-router-dom";

const DeliveryContactInformation = () => {
  const navigate = useNavigate();
  return (
    <div className="form-container">
      <div className="left-panel">
        <img
          src="/Rectangle-three.png"
          alt="Shop Owner"
          className="form-image"
        />
        {/* <div className="image-text">
          <h2>Lower barriers for shop owners to go online with easy signup, simple marketing, and delivery support.</h2>
        </div> */}
      </div>

      <div className="right-panel">
        <div className="progress-indicator">
          <div className="dots">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`dot ${i <= 4 ? "active" : ""}`}></span>
            ))}
          </div>
          <p className="step-title">Business Registration.</p>
        </div>

        <form className="contact-form">
          <h2 className="form-title">Add Contact Information</h2>

          <label>Primary Contact Number*</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input type="tel" placeholder="Enter number" />
          </div>

          <label>Alternate Contact Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input type="tel" placeholder="Enter number" />
          </div>

          <label>WhatsApp Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input type="tel" placeholder="Enter number" />
          </div>

          <label>Email Address</label>
          <input type="email" placeholder="Enter your email" />

          <label>Enter Password</label>
          <input type="password" placeholder="Enter a password" />

          <label>Confirm Password</label>
          <input type="password" placeholder="Enter a password" />

          <div className="button-group">
            <button type="button" className="btn back">
              Back
            </button>
            <button type="button" className="btn skip">
              Skip
            </button>
            <button
              type="submit"
              className="btn next"
              onClick={() => navigate("/ShopProfileLayout")}
            >
              Submit ➜
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryContactInformation;
