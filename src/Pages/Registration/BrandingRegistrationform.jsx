import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandingRegistrationForm.css";

const BrandingRegistrationForm = () => {
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageURLs]);

    const fileData = files.map((file) => ({
      name: file.name,
      type: file.type,
    }));
    localStorage.setItem("brandingImageMeta", JSON.stringify(fileData));
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices((prev) => [...prev, newService]);
      setNewService("");
    }
  };

  const handleNext = () => {
    const formData = {
      images,
      description,
      services,
    };
    localStorage.setItem("brandingDetails", JSON.stringify(formData));
    navigate("/ContactInfoform");
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
                <img key={i} src={img} alt={`Preview ${i + 1}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <textarea
            className="shop-description"
            placeholder="Write about your Business, the story and the goal."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="product-service-input">
            <input
              type="text"
              placeholder="Write about the product and services"
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
            />
            <button className="add-btn" onClick={handleAddService}>
              +
            </button>
          </div>

          <div className="product-tag-container">
            {services.map((tag, i) => (
              <div key={i} className="product-tag">
                {tag}
              </div>
            ))}
          </div>

          <div className="buttons">
            <button className="back-btn" onClick={() => navigate(-1)}>
              Back
            </button>
            <button className="skip-btn" onClick={handleNext}>
              Skip
            </button>
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
