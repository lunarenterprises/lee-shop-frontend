import React, { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./RegistrationJoin.css";

const BusinessRegistrationForm = ({
  onNext = () => { },
  onBack = () => { },
  onSkip = () => { },
  defaultSelection = null,
  showSkip = true,
  showBack = true,
  customTitle = null,
  customOptions = null,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultSelection);

  const defaultOptionsData = [
    { id: "product-seller", label: "Product Seller", value: "product-seller" },
    { id: "service-provider", label: "Service Provider", value: "service-provider" },
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
    { id: 1, completed: true, active: false },
    { id: 2, completed: false, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  return (
    <div className="registration-container">
      {/* Left Panel - Hero Image */}
      <div className="registration-hero">
        <div className="hero-content">
          <div className="logo-container">
            <img src="/logo.png" alt="LeeShop" className="hero-logo" />
          </div>
          <div className="hero-quote">
            <p>"Help small businesses and professionals grow by giving them an easy, affordable way to sell online and reach local customers."</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="registration-form-panel">
        {/* Progress Header */}
        <div className="progress-header">
          <div className="progress-label">
            <span>Business Registration.</span>
          </div>
          <div className="progress-steps">
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`progress-dot ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                  <div className="progress-dot-inner"></div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`progress-line ${step.completed ? 'completed' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="form-content">
          <h1 className="form-title">{title}</h1>

          <div className="options-container">
            {options.map((option) => (
              <label
                key={option.id}
                className={`option-card ${selectedOption === option.value ? 'selected' : ''}`}
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

        {/* Navigation Footer */}
        <div className="navigation-footer">
          <div className="nav-left">
            {showBack && (
              <button onClick={onBack} className="btn-secondary">
                <ArrowLeft size={18} />
                Back
              </button>
            )}
          </div>

          <div className="nav-right">
            {showSkip && (
              <button onClick={onSkip} className="btn-skip">
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`btn-primary ${!selectedOption ? 'disabled' : ''}`}
            >
              Next
              <ArrowRight size={18} />
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
