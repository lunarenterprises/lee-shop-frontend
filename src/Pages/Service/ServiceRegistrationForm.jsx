// ServiceRegistrationForm.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceRegistrationForm.css";

const ServiceRegistrationForm = () => {
  const navigate = useNavigate();

  const handleNext = () => {
    navigate("/ServiceContactPage");
  };

  return (
    <div className="registration-container">
      <div className="left-panel">
        <img
          src="/service-page.jpg"
          alt="Team working"
          className="main-image"
        />
      </div>
      <div className="right-panel">
        <p className="small-heading">Service Registration</p>
        <div className="progress-bar">
          <div className="step done"></div>
          <div className="step done"></div>
          <div className="step current"></div>
          <div className="step"></div>
        </div>
        <h2 className="section-title">Service Details & Description</h2>

        <div className="image-upload-section">
          <p className="section-subtitle">Showcase Your Work with Images</p>
          <div className="image-upload-box">
            <div className="upload-box">
              <p>Drag and drop your service images here or</p>
              <button className="upload-btn">Upload an Image</button>
            </div>
            <div className="image-gallery">
              {[...Array(8)].map((_, i) => (
                <img
                  key={i}
                  src="/UploadImage-one.png"
                  alt={`Preview ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <textarea
            className="shop-description"
            placeholder="Describe your service offerings, mission, and story."
          />

          <div className="product-service-input">
            <input
              type="text"
              placeholder="Mention types of services provided"
            />
            <button className="add-btn">+</button>
          </div>

          <div className="product-tag">Home Visits & Weekend Services Available</div>

          <div className="buttons">
            <button className="back-btn">Back</button>
            <button className="skip-btn">Skip</button>
            <button className="next-btn" onClick={handleNext}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;
