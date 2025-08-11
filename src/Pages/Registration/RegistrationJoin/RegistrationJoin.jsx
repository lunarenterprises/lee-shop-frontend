import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegistrationJoin.css"; // renamed CSS file
import ProgressSteps from "../../ProgressSteps";

const BusinessRegistrationForm = ({
  onNext = () => {},
  onBack = () => {},
  onSkip = () => {},
  defaultSelection = null,
  showSkip = true,
  showBack = true,
  customTitle = null,
  customOptions = null,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelection);

  const defaultOptionsData = [
    { id: "product-seller", label: "Product Seller", value: "product-seller" },
    {
      id: "service-provider",
      label: "Service Provider",
      value: "service-provider",
    },
    { id: "both", label: "Both", value: "both" },
  ];

  const options = customOptions || defaultOptionsData;
  const title = customTitle || "Who Are You Joining As?";

  const handleOptionSelect = (optionValue) => {
    setSelectedOption(optionValue);
  };

  const handleNext = () => {
    if (selectedOption) {
      localStorage.setItem("businessType", selectedOption);
      onNext(selectedOption);
    }
  };

  const progressSteps = [
    { id: 1, completed: false, active: true },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  return (
    <div className="registration-container">
      {/* Left Panel - Hero Image */}
      <div className="registration-hero" >
        <div className="hero-content">
          <div className="logo-container">
            <img src="/logo.png" alt="LeeShop" className="hero-logo" />
          </div>
        </div>
      </div>
      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Business Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content">
          <h2 className="section-title">▶ {title}</h2>

          <div className="section">
            <div className="options-container">
              {options.map((option) => (
                <label
                  key={option.id}
                  className={`option-card ${
                    selectedOption === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.value)}
                >
                  <div className="radio-button">
                    <div className="radio-inner"></div>
                  </div>
                  <span className="option-label">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="button-row">
          <div className="left-buttons">
            {showBack && (
              <button onClick={onBack} className="back-btn2">
                Back
              </button>
            )}
          </div>
          <div className="right-buttons">
            {showSkip && (
              <button onClick={onSkip} className="skip-btn2">
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`next-btn2 ${!selectedOption ? "disabled" : ""}`}
              style={{
                opacity: selectedOption ? 1 : 0.5,
                cursor: selectedOption ? "pointer" : "not-allowed",
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

// Parent Wrapper
const RegistrationJoin = () => {
  const navigate = useNavigate();

  const pathMap = {
    "product-seller": "/BusinessRegistrationForm",
    "service-provider": "/ServiceRegistration",
    both: "/BothRegistrationForm",
  };

  const handleNext = (selectedValue) => {
    localStorage.setItem("businessType", selectedValue);
    navigate(pathMap[selectedValue]);
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => navigate("/");

  return (
    <BusinessRegistrationForm
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
      defaultSelection={null}
      showSkip={true}
      showBack={true}
    />
  );
};

export default RegistrationJoin;
