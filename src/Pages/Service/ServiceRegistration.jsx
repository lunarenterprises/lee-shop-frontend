import React, { useState, useEffect } from "react";
import "./ServiceRegistration.css"; // renamed CSS file
import { useNavigate } from "react-router-dom";
import ProgressSteps from "../ProgressSteps";

const ServiceRegistration = () => {
  const [categoriesVisible, setCategoriesVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    businessCategory: "",
    shopAddress: "",
    state: "",
    district: "",
  });

  const navigate = useNavigate();

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  const businessCategories = [
    "Salon",
    "Cleaning",
    "Tailoring & Fashion Services",
    "Home Repairs",
    "Moving Services",
    "Health",
    "Education",
    "Events",
    "Pet Care",
    "Beauty",
    "Consulting",
    "Marketing",
    "Legal Services",
  ];

  // Load service info from localStorage when component mounts
  useEffect(() => {
    const savedServiceInfo = localStorage.getItem("serviceInfo");
    if (savedServiceInfo) {
      try {
        const parsedData = JSON.parse(savedServiceInfo);
        console.log("Loading serviceInfo from localStorage:", parsedData);
        
        // Set form data
        setFormData(parsedData);
        
        // Set selected category if it exists
        if (parsedData.businessCategory) {
          setSelectedCategory(parsedData.businessCategory);
        }
      } catch (error) {
        console.error("Error parsing localStorage serviceInfo:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("serviceInfo");
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFormData((prev) => ({
      ...prev,
      businessCategory: category,
    }));
  };

  const handleNextService = () => {
    if (!formData.shopName || !formData.ownerName || !selectedCategory) {
      alert(
        "Please fill in all required fields and select a business category."
      );
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

  return (
    <div className="registration-container">
      {/* Left Panel with Background Image */}
      <div className="left-panel2">
        <img
          src="/ServiceRegistration-one.png"
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
            ▶ Basic Service & Shop Location Info
          </h2>

          {/* Service Name and Owner Name Row */}
          <div className="section">
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
          </div>

          {/* Business Category */}
          <div className="section">
            <div className="service-category-section">
              <label>Business Category</label>
              <div className="service-category-grid">
                {businessCategories
                  .slice(0, categoriesVisible ? businessCategories.length : 12)
                  .map((cat, i) => (
                    <button
                      key={i}
                      className={`service-category-btn ${
                        selectedCategory === cat ? "selected" : ""
                      }`}
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
          </div>

          {/* Full Address */}
          <div className="section">
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
          </div>

          {/* State and City Row */}
          <div className="section">
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
        </div>

        {/* Navigation Footer */}
        <div className="button-row">
          <div className="left-buttons">
            <button className="back-btn2" onClick={handleBack}>
              Back
            </button>
          </div>
          <div className="right-buttons">
            <button className="skip-btn2" onClick={handleSkip}>
              Skip
            </button>
            <button className="next-btn2" onClick={handleNextService}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistration;