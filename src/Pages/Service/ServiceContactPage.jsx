import React from "react";
import "./ServiceContactPage.css"; // renamed CSS file
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../ProgressSteps";

const ServiceContactPage = () => {
  const navigate = useNavigate();

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ];

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/ShopProfileLayout");
  };

  const handleNext = () => {
    navigate("/ShopProfileLayout");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/Rectangle25.png" alt="Shop Owner" />
      </div>

      <div className="right-panel_2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Service Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNext();
          }}
        >
          <div className="form-content2">
            <h2 className="section-title">▶ Add Contact Information</h2>

            <div className="section">
              <label>Primary Contact Number*</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input type="tel" placeholder="Enter number" />
              </div>
            </div>

            <div className="section">
              <label>Alternate Contact Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input type="tel" placeholder="Enter number" />
              </div>
            </div>

            <div className="section">
              <label>WhatsApp Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input type="tel" placeholder="Enter number" />
              </div>
            </div>

            <div className="section">
              <label>Email Address</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className="section">
              <label>Enter Password</label>
              <input type="password" placeholder="Enter a password" />
            </div>

            <div className="section">
              <label>Confirm Password</label>
              <input type="password" placeholder="Enter a password" />
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
              <button className="next-btn2" type="submit">
                Next →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceContactPage;
