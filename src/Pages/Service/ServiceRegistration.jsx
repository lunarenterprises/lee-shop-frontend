import React, { useState } from "react";
import "./ServiceRegistration.css";
import { useNavigate } from "react-router-dom";

const ServiceRegistration = () => {
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    businessCategory: "",
    shopAddress: "",
    state: "",
    district: ""
  });

  const navigate = useNavigate();

  const businessCategories = [
    "Salon", "Cleaning", "Tailoring & Fashion Services", "Home Repairs",
    "Moving Services", "Health", "Education", "Events",
    "Pet Care", "Beauty", "Consulting", "Marketing", "Legal Services"
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData(prev => ({
      ...prev,
      businessCategory: category
    }));
  };

  const handleNextService = () => {
    if (!formData.shopName || !formData.ownerName || !selectedCategory) {
      alert("Please fill in all required fields and select a business category.");
      return;
    }

    localStorage.setItem("serviceInfo", JSON.stringify(formData));
    console.log("Storing serviceInfo:", formData);

    navigate("/OperationDetails");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleSkip = () => {
    navigate("/OperationDetails");
  };

  const progressSteps = [
    { id: 1, completed: false, active: true },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  return (
    <div className="service-registration-container">
      {/* Left Panel with Background Image */}
      <div className="service-hero-panel">
        <div className="service-hero-content">
          <div className="service-logo-container">
            <img src="/logo.png" alt="LeeShop" className="service-hero-logo" />
          </div>
          <div className="service-hero-quote">
            <p>"Strengthen local commerce by connecting nearby sellers, services, and customers to promote sustainability."</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="service-form-panel">
        {/* Progress Header */}
        <div className="service-progress-header">
          <div className="service-progress-label">
            <span>Business Registration.</span>
          </div>
          <div className="service-progress-steps">
            {progressSteps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className={`service-progress-dot ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                  <div className="service-progress-dot-inner"></div>
                </div>
                {index < progressSteps.length - 1 && (
                  <div className={`service-progress-line ${step.completed ? 'completed' : ''}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="service-form-content">
          <h1 className="service-form-title">Basic Service & Shop Location Info</h1>

          {/* Service Name and Owner Name Row */}
          <div className="service-input-row">
            <div className="service-input-group">
              <label>Service Name</label>
              <input
                type="text"
                name="shopName"
                value={formData.shopName}
                onChange={handleInputChange}
                placeholder="Enter your Shop Name."
                required
              />
            </div>
            <div className="service-input-group">
              <label>Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Enter Owner Name."
                required
              />
            </div>
          </div>

          {/* Business Category */}
          <div className="service-category-section">
            <label>Business Category</label>
            <div className="service-category-grid">
              {businessCategories
                .slice(0, categoriesVisible ? businessCategories.length : 12)
                .map((cat, i) => (
                  <button
                    key={i}
                    className={`service-category-btn ${selectedCategory === cat ? 'selected' : ''}`}
                    onClick={() => handleCategorySelect(cat)}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              {!categoriesVisible && (
                <button
                  className="service-category-btn view-more"
                  onClick={() => setCategoriesVisible(true)}
                  type="button"
                >
                  View more
                </button>
              )}
            </div>
          </div>

          {/* Full Address */}
          <div className="service-input-group">
            <label>Full Address</label>
            <input
              type="text"
              name="shopAddress"
              value={formData.shopAddress}
              onChange={handleInputChange}
              placeholder="Enter your Shop Address."
            />
          </div>

          {/* State and City Row */}
          <div className="service-input-row">
            <div className="service-input-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter your State your shop in."
              />
            </div>
            <div className="service-input-group">
              <label>City</label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                placeholder="Enter your City your shop in."
              />
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="service-navigation-footer">
          <div className="service-nav-left">
            <button className="service-btn-secondary" onClick={handleBack}>
              Back
            </button>
          </div>

          <div className="service-nav-right">
            <button className="service-btn-skip" onClick={handleSkip}>
              Skip
            </button>
            <button className="service-btn-primary" onClick={handleNextService}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistration;
