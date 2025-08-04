import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceRegistrationForm.css";

const ServiceRegistrationForm = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices((prev) => [...prev, newService]);
      setNewService("");
    }
  };

  // Are all fields filled?
  const allFilled = description && services.length > 0 && imageFiles.length > 0;

  const handleNext = () => {
    // Save image files to window (cannot store Files in localStorage)
    window.serviceImageFiles = imageFiles;
    // Store other details in localStorage
    localStorage.setItem(
      "serviceRegistration",
      JSON.stringify({ description, services })
    );
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
              <label className="upload-btn">
                Upload an Image
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="image-gallery">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Preview ${i + 1}`}
                  style={{ width: 60, height: 60, objectFit: "cover", marginRight: 8 }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <textarea
            className="shop-description"
            placeholder="Describe your service offerings, mission, and story."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <div className="product-service-input">
            <input
              type="text"
              placeholder="Mention types of services provided"
              value={newService}
              onChange={e => setNewService(e.target.value)}
              onKeyDown={e => (e.key === "Enter" ? (e.preventDefault(), handleAddService()) : undefined)}
            />
            <button className="add-btn" type="button" onClick={handleAddService}>+</button>
          </div>

          <div style={{ marginBottom: 10 }}>
            {services.map((service, i) => (
              <span key={i} className="product-tag">{service}</span>
            ))}
          </div>

          <div className="buttons">
            <button className="back-btn" type="button" onClick={() => navigate(-1)}>Back</button>
            <button className="skip-btn" type="button" onClick={handleNext}>Skip</button>
            <button
              className="next-btn"
              type="button"
              disabled={!allFilled}
              style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;
