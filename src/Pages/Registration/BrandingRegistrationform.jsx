import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./BrandingRegistrationForm.css";
import ProgressSteps from "../ProgressSteps";

const BrandingRegistrationForm = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [description, setDescription] = useState("");
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState("");
  const [errors, setErrors] = useState({});

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: true, active: true },
    { id: 5, completed: false, active: false },
  ];

  useEffect(() => {
    const savedBrandingDetails = localStorage.getItem("brandingDetails");
    if (savedBrandingDetails) {
      try {
        const parsedData = JSON.parse(savedBrandingDetails);
        console.log("Loading brandingDetails from localStorage:", parsedData);

        if (parsedData.description) {
          setDescription(parsedData.description);
        }

        if (parsedData.services && Array.isArray(parsedData.services)) {
          setServices(parsedData.services);
        }
      } catch (error) {
        console.error("Error parsing localStorage brandingDetails:", error);
        localStorage.removeItem("brandingDetails");
      }
    }

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

  // Validation functions
  const validateImages = (files) => {
    const errors = [];

    if (files.length === 0) {
      errors.push("At least one image is required");
      return errors;
    }

    if (files.length > 10) {
      errors.push("Maximum 10 images allowed");
    }

    files.forEach((file, index) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`File ${index + 1} is not a valid image format`);
      }

      if (file.size > 5 * 1024 * 1024) {
        errors.push(`Image ${index + 1} exceeds 5MB size limit`);
      }

      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        errors.push(
          `Image ${index + 1} must be JPEG, PNG, GIF, or WebP format`
        );
      }
    });

    return errors;
  };

  const validateDescription = (desc) => {
    const errors = [];

    if (!desc.trim()) {
      errors.push("Business description is required");
      return errors;
    }

    if (desc.trim().length < 50) {
      errors.push("Description must be at least 50 characters long");
    }

    if (desc.trim().length > 1000) {
      errors.push("Description must not exceed 1000 characters");
    }

    // Check for inappropriate content (basic check)
    const inappropriateWords = ["spam", "scam", "fake", "illegal"];
    const lowerDesc = desc.toLowerCase();
    if (inappropriateWords.some((word) => lowerDesc.includes(word))) {
      errors.push("Description contains inappropriate content");
    }

    return errors;
  };

  const validateServices = (serviceList) => {
    const errors = [];

    if (serviceList.length === 0) {
      errors.push("At least one service is required");
      return errors;
    }

    if (serviceList.length > 20) {
      errors.push("Maximum 20 services allowed");
    }

    serviceList.forEach((service, index) => {
      if (!service.trim()) {
        errors.push(`Service ${index + 1} cannot be empty`);
      } else if (service.trim().length < 2) {
        errors.push(`Service ${index + 1} must be at least 2 characters long`);
      } else if (service.trim().length > 50) {
        errors.push(`Service ${index + 1} must not exceed 50 characters`);
      }
    });

    // Check for duplicates
    const uniqueServices = [
      ...new Set(serviceList.map((s) => s.trim().toLowerCase())),
    ];
    if (uniqueServices.length !== serviceList.length) {
      errors.push("Duplicate services are not allowed");
    }

    return errors;
  };

  const validateNewService = (service) => {
    const errors = [];

    if (service.trim().length < 2) {
      errors.push("Service must be at least 2 characters long");
    }

    if (service.trim().length > 50) {
      errors.push("Service must not exceed 50 characters");
    }

    if (
      services.some((s) => s.toLowerCase() === service.trim().toLowerCase())
    ) {
      errors.push("This service already exists");
    }

    // Check for special characters (allow only alphanumeric, spaces, hyphens, and common punctuation)
    const validServiceRegex = /^[a-zA-Z0-9\s\-&,.()]+$/;
    if (!validServiceRegex.test(service.trim())) {
      errors.push("Service contains invalid characters");
    }

    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate images
    const imageErrors = validateImages(imageFiles);
    if (imageErrors.length > 0) {
      newErrors.images = imageErrors;
    }

    // Validate description
    const descErrors = validateDescription(description);
    if (descErrors.length > 0) {
      newErrors.description = descErrors;
    }

    // Validate services
    const serviceErrors = validateServices(services);
    if (serviceErrors.length > 0) {
      newErrors.services = serviceErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    const combinedFiles = [...imageFiles, ...files];
    const imageErrors = validateImages(combinedFiles);

    if (imageErrors.length > 0) {
      setErrors((prev) => ({ ...prev, images: imageErrors }));
      e.target.value = "";
      return;
    }

    clearError("images");
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const imageURLs = validImages.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageURLs]);
    setImageFiles((prev) => [...prev, ...validImages]);
    e.target.value = "";
  };

  const handleAddService = () => {
    if (!newService.trim()) return;

    const serviceErrors = validateNewService(newService);
    if (serviceErrors.length > 0) {
      setErrors((prev) => ({ ...prev, newService: serviceErrors }));
      return;
    }

    if (services.length >= 20) {
      setErrors((prev) => ({
        ...prev,
        services: ["Maximum 20 services allowed"],
      }));
      return;
    }

    clearError("newService");
    clearError("services");
    setServices((prev) => [...prev, newService.trim()]);
    setNewService("");
  };

  const handleServiceKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddService();
    }
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);

    // Real-time validation for description
    if (value.trim()) {
      clearError("description");
    }
  };

  const handleNewServiceChange = (e) => {
    const value = e.target.value;
    setNewService(value);

    // Clear new service errors when user starts typing
    if (errors.newService) {
      clearError("newService");
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    window.brandingImageFiles = imageFiles;
    localStorage.setItem(
      "brandingDetails",
      JSON.stringify({ description: description.trim(), services })
    );
    console.log(
      "Storing brandingDetails:",
      JSON.stringify({ description: description.trim(), services })
    );
    navigate("/ContactInfoform");
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/ContactInfoform");
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    const newImageFiles = imageFiles.filter(
      (_, index) => index !== indexToRemove
    );

    setImages(newImages);
    setImageFiles(newImageFiles);

    // Re-validate images after removal
    if (newImageFiles.length === 0) {
      setErrors((prev) => ({
        ...prev,
        images: ["At least one image is required"],
      }));
    } else {
      clearError("images");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const combinedFiles = [...imageFiles, ...files];
    const imageErrors = validateImages(combinedFiles);

    if (imageErrors.length > 0) {
      setErrors((prev) => ({ ...prev, images: imageErrors }));
      return;
    }

    clearError("images");
    const validImages = files.filter((file) => file.type.startsWith("image/"));
    const imageURLs = validImages.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageURLs]);
    setImageFiles((prev) => [...prev, ...validImages]);
  };

  const handleRemoveService = (indexToRemove) => {
    const newServices = services.filter((_, index) => index !== indexToRemove);
    setServices(newServices);

    // Re-validate services after removal
    if (newServices.length === 0) {
      setErrors((prev) => ({
        ...prev,
        services: ["At least one service is required"],
      }));
    } else {
      clearError("services");
    }
  };

  const ErrorMessage = ({ errors, field, style }) => {
    if (!errors[field]) return null;
    return (
      <div
        style={{
          color: "red",
          fontSize: "12px",
          marginTop: "5px",
          ...style, // 👈 custom styles override defaults
        }}
      >
        {errors[field].map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    );
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
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        <div className="form-content">
          <h2 className="section-title">▶ Branding & Details</h2>
          <div className="section">
            <div className="image-upload-section">
              <p className="section-subtitle">
                Add Images to Attract Customers
              </p>
              <div className="image-upload-box">
                <div
                  className="upload-box"
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <p>Drag and drop your images anywhere or</p>
                  <span
                    className="upload-btn"
                    onClick={handleUploadClick}
                    style={{ cursor: "pointer" }}
                  >
                    Upload an Image
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </span>
                </div>
                <div className="image-gallery2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      style={{ position: "relative", display: "inline-block" }}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Preview ${i + 1}`}
                      />
                      <button
                        onClick={() => handleRemoveImage(i)}
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          background: "rgba(255, 0, 0, 0.7)",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <ErrorMessage errors={errors} field="images" />
            </div>
          </div>
          <div className="section">
            <label>Add a short shop description</label>
            <textarea
              className="shop-description"
              placeholder="Write about your Business, the story and the goal."
              value={description}
              onChange={handleDescriptionChange}
              maxLength={1000}
            />
            <ErrorMessage errors={errors} field="description" />
          </div>
          <div className="section">
            <label>Products and services</label>
            <div className="service-input-container">
              <input
                type="text"
                placeholder="Write about the product and services"
                value={newService}
                onChange={handleNewServiceChange}
                onKeyPress={handleServiceKeyPress}
                maxLength={50}
              />
              <button
                type="button"
                className="add-btn"
                onClick={handleAddService}
              >
                +
              </button>
            </div>
            <ErrorMessage errors={errors} field="newService"/>

            <div className="product-tag-container">
              {services.map((tag, i) => (
                <div key={i} className="product-tag">
                  <span className="product-tag-text" title={tag}>
                    {tag}
                  </span>
                  <button
                    className="product-tag-remove"
                    onClick={() => handleRemoveService(i)}
                    aria-label={`Remove ${tag}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <ErrorMessage errors={errors} field="services" style={{marginTop:"-10px"}} />
          </div>
        </div>

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
