import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandingRegistrationForm.css"; // renamed CSS file
import ProgressSteps from "../ProgressSteps";

const BrandingRegistrationForm = () => {
  const navigate = useNavigate();

  // Initialize as empty or pre-populate if user navigates back
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: true, active: true },
    { id: 5, completed: false, active: false },
  ];

  // Load branding details from localStorage
  useEffect(() => {
    const savedBrandingDetails = localStorage.getItem("brandingDetails");
    if (savedBrandingDetails) {
      try {
        const parsedData = JSON.parse(savedBrandingDetails);
        console.log("Loading brandingDetails from localStorage:", parsedData);

        // Set description
        if (parsedData.description) {
          setDescription(parsedData.description);
        }

        // Set services array
        if (parsedData.services && Array.isArray(parsedData.services)) {
          setServices(parsedData.services);
        }
      } catch (error) {
        console.error("Error parsing localStorage brandingDetails:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("brandingDetails");
      }
    }

    // Load image files from window global if they exist
    if (window.brandingImageFiles && Array.isArray(window.brandingImageFiles)) {
      console.log(
        "Loading brandingImageFiles from window:",
        window.brandingImageFiles
      );
      const imageURLs = window.brandingImageFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages(imageURLs);
      setImageFiles(window.brandingImageFiles);
    }
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Keep only image files
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      alert("Only image files are allowed.");
      e.target.value = ""; // Clear input so user can reselect
      return;
    }

    const imageURLs = validImages.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageURLs]);
    setImageFiles((prev) => [...prev, ...validImages]);
  };

  const handleAddService = () => {
    if (newService.trim()) {
      setServices((prev) => [...prev, newService]);
      setNewService("");
    }
  };

  const handleNext = () => {
    // Save images files to a temp global var (cannot use localStorage for File objects)
    window.brandingImageFiles = imageFiles;
    // Save rest (description, services) to localStorage for next component
    localStorage.setItem(
      "brandingDetails",
      JSON.stringify({ description, services })
    );
    console.log(
      "Storing brandingDetails:",
      JSON.stringify({ description, services })
    );
    // (Optional: if you want image meta in localStorage, also do this)
    // localStorage.setItem("brandingImageMeta", JSON.stringify(imageFiles.map(f => ({ name: f.name, type: f.type }))));
    navigate("/ContactInfoform");
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/ContactInfoform");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Rectangle25.png"
          alt="Team working"
          className="left-image2"
        />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content">
          <h2 className="section-title">▶ Branding & Details</h2>

          <div className="section">
            <div className="image-upload-section">
              <p className="section-subtitle">
                Add Images to Attract Customers
              </p>
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
          </div>

          <div className="section">
            <textarea
              className="shop-description"
              placeholder="Write about your Business, the story and the goal."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="section">
            <div className="product-service-input">
              <input
                type="text"
                placeholder="Write about the product and services"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
              />
              <button
                type="button"
                className="add-btn"
                onClick={handleAddService}
              >
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
            <button className="next-btn2" type="button" onClick={handleNext}>
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandingRegistrationForm;
