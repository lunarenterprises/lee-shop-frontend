import React from "react";
import "./BrandingDetails.css";

const BrandingDetails = () => {
  return (
    <div className="branding-container">
      <div className="branding-left">
        <img src="https://via.placeholder.com/400x600" alt="Preview" className="branding-image" />
        <div className="branding-quote">
          <h2>
            "Lower barriers for shop owners to go online with easy signup, simple
            marketing, and delivery support."
          </h2>
        </div>
      </div>

      <div className="branding-right">
        <p className="registration-progress">Business Registration.</p>
        {/* <div className="progress-indicator">
          <div className="dot done" />
          <div className="dot done" />
          <div className="dot done" />
          <div className="dot current" />
          <div className="dot" />
        </div> */}

        <h2 className="section-title">Branding & Details</h2>

        <div className="upload-section">
          <h4>Add Images to Attract Customers</h4>
          <div className="upload-box">
            <div className="upload-placeholder">
              <p>Drag and drop your images anywhere or</p>
              <button className="upload-btn">Upload a Image</button>
            </div>
            <div className="upload-thumbnails">
              {[...Array(6)].map((_, index) => (
                <img
                  key={index}
                  src={`https://via.placeholder.com/100`}
                  alt={`thumb-${index}`}
                  className="thumb"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <label>Add a short shop description</label>
          <textarea
            className="text-area"
            placeholder="Write about your Business, the story and the goal."
          ></textarea>

          <label>Products and services</label>
          <div className="input-add">
            <input
              type="text"
              placeholder="Write about the product and services"
            />
            <button className="add-btn">+</button>
          </div>

          <div className="tag">Eggless and Sugar-free Options</div>
        </div>

        <div className="button-group">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
          <button className="next-btn">Next →</button>
        </div>
      </div>
    </div>
  );
};

export default BrandingDetails;
