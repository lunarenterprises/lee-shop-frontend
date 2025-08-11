import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceRegistrationForm.css"; // renamed CSS file
import ProgressSteps from "../ProgressSteps";

const ServiceRegistrationForm = () => {
  const navigate = useNavigate();
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

  // Load service registration data from localStorage
  useEffect(() => {
    const savedServiceRegistration = localStorage.getItem("serviceRegistration");
    if (savedServiceRegistration) {
      try {
        const parsedData = JSON.parse(savedServiceRegistration);
        console.log("Loading serviceRegistration from localStorage:", parsedData);

        // Set description
        if (parsedData.description) {
          setDescription(parsedData.description);
        }

        // Set services array
        if (parsedData.services && Array.isArray(parsedData.services)) {
          setServices(parsedData.services);
        }
      } catch (error) {
        console.error("Error parsing localStorage serviceRegistration:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("serviceRegistration");
      }
    }

    // Load image files from window global if they exist
    if (window.serviceImageFiles && Array.isArray(window.serviceImageFiles)) {
      console.log("Loading serviceImageFiles from window:", window.serviceImageFiles);
      const imageURLs = window.serviceImageFiles.map((file) => URL.createObjectURL(file));
      setImages(imageURLs);
      setImageFiles(window.serviceImageFiles);
    }
  }, []);

  // Handle image upload
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
    console.log("Storing serviceRegistration:", JSON.stringify({ description, services }));
    navigate("/ServiceContactPage");
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/ServiceContactPage");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/service-page.jpg" alt="Team working" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Service Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content">
          <h2 className="section-title">▶ Service Details & Description</h2>

          <div className="section">
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
                    <img key={i} src={img} alt={`Preview ${i + 1}`} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="section">
            <textarea
              className="shop-description"
              placeholder="Describe your service offerings, mission, and story."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="section">
            <div className="product-service-input">
              <input
                type="text"
                placeholder="Mention types of services provided"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter"
                    ? (e.preventDefault(), handleAddService())
                    : undefined
                }
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
              {services.map((service, i) => (
                <div key={i} className="product-tag">
                  {service}
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
            <button
              className="next-btn2"
              type="button"
              disabled={!allFilled}
              style={{
                opacity: allFilled ? 1 : 0.5,
                cursor: allFilled ? "pointer" : "not-allowed",
              }}
              onClick={handleNext}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistrationForm;