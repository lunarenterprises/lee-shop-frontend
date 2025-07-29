import React from "react";
import { useNavigate } from "react-router-dom";
import "./BrandingRegistrationForm.css";

const BrandingRegistrationForm = () => {
  const navigate = useNavigate(); // 👈 get navigate function

  const handleNext = () => {
    navigate("/ContactInfoform"); // 👈 navigate to the desired route
  };

  return (
    <div className="registration-container">
      <div className="left-panel">
        <img
          src="https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg"
          alt="Team working"
          className="main-image"
        />
      </div>
      <div className="right-panel">
        <p className="small-heading">Business Registration.</p>
        <div className="progress-bar">
          <div className="step done"></div>
          <div className="step done"></div>
          <div className="step current"></div>
          <div className="step"></div>
        </div>
        <h2 className="section-title">Branding & Details</h2>

        <div className="image-upload-section">
          <p className="section-subtitle">Add Images to Attract Customers</p>
          <div className="image-upload-box">
            <div className="upload-box">
              <p>Drag and drop your images anywhere or</p>
              <button className="upload-btn">Upload a Image</button>
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
            placeholder="Write about your Business, the story and the goal."
          />

          <div className="product-service-input">
            <input
              type="text"
              placeholder="Write about the product and services"
            />
            <button className="add-btn">+</button>
          </div>

          <div className="product-tag">Eggless and Sugar-free Options</div>

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

export default BrandingRegistrationForm;
