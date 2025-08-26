import { useState, useEffect } from "react";
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

  const [errors, setErrors] = useState({
    images: "",
    description: "",
    services: "",
    newService: "",
  });

  const VALIDATION_RULES = {
    MAX_IMAGES: 10,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_DESCRIPTION_LENGTH: 500,
    MIN_SERVICES: 1,
    MAX_SERVICES: 20,
    MAX_SERVICE_LENGTH: 50,
    MIN_SERVICE_LENGTH: 2,
  };

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: true, active: true },
    { id: 5, completed: false, active: false },
  ];

  const validateImages = (files) => {
    const errors = [];

    if (files.length === 0) {
      errors.push("At least one image is required");
    }

    if (files.length > VALIDATION_RULES.MAX_IMAGES) {
      errors.push(`Maximum ${VALIDATION_RULES.MAX_IMAGES} images allowed`);
    }

    files.forEach((file, index) => {
      if (!file.type.startsWith("image/")) {
        errors.push(`File ${index + 1} is not a valid image`);
      }

      if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
        errors.push(`File ${index + 1} exceeds 5MB size limit`);
      }
    });

    return errors;
  };

  const validateDescription = (desc) => {
    const errors = [];
    const trimmedDesc = desc.trim();

    if (!trimmedDesc) {
      errors.push("Service description is required");
    } else if (trimmedDesc.length < VALIDATION_RULES.MIN_DESCRIPTION_LENGTH) {
      errors.push(
        `Description must be at least ${VALIDATION_RULES.MIN_DESCRIPTION_LENGTH} characters`
      );
    } else if (trimmedDesc.length > VALIDATION_RULES.MAX_DESCRIPTION_LENGTH) {
      errors.push(
        `Description must not exceed ${VALIDATION_RULES.MAX_DESCRIPTION_LENGTH} characters`
      );
    }

    return errors;
  };

  const validateServices = (servicesList) => {
    const errors = [];

    if (servicesList.length < VALIDATION_RULES.MIN_SERVICES) {
      errors.push("At least one service is required");
    }

    if (servicesList.length > VALIDATION_RULES.MAX_SERVICES) {
      errors.push(`Maximum ${VALIDATION_RULES.MAX_SERVICES} services allowed`);
    }

    return errors;
  };

  const validateNewService = (service) => {
    const errors = [];
    const trimmedService = service.trim();

    if (
      trimmedService &&
      trimmedService.length < VALIDATION_RULES.MIN_SERVICE_LENGTH
    ) {
      errors.push(
        `Service name must be at least ${VALIDATION_RULES.MIN_SERVICE_LENGTH} characters`
      );
    }

    if (trimmedService.length > VALIDATION_RULES.MAX_SERVICE_LENGTH) {
      errors.push(
        `Service name must not exceed ${VALIDATION_RULES.MAX_SERVICE_LENGTH} characters`
      );
    }

    if (
      trimmedService &&
      services.some((s) => s.toLowerCase() === trimmedService.toLowerCase())
    ) {
      errors.push("This service already exists");
    }

    return errors;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Load service registration data from localStorage
  useEffect(() => {
    const savedServiceRegistration = localStorage.getItem(
      "serviceRegistration"
    );
    if (savedServiceRegistration) {
      try {
        const parsedData = JSON.parse(savedServiceRegistration);
        console.log(
          "Loading serviceRegistration from localStorage:",
          parsedData
        );

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
      console.log(
        "Loading serviceImageFiles from window:",
        window.serviceImageFiles
      );
      const imageURLs = window.serviceImageFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setImages(imageURLs);
      setImageFiles(window.serviceImageFiles);
    }
  }, []);

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    clearError("images");

    const totalFiles = [...imageFiles, ...files];
    const imageErrors = validateImages(totalFiles);

    if (imageErrors.length > 0) {
      setErrors((prev) => ({ ...prev, images: imageErrors.join(". ") }));
      e.target.value = ""; // Clear input
      return;
    }

    // Keep only image files
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        images: "Only image files are allowed",
      }));
      e.target.value = ""; // Clear input so user can reselect
      return;
    }

    const imageURLs = validImages.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...imageURLs]);
    setImageFiles((prev) => [...prev, ...validImages]);
  };

  const handleAddService = () => {
    const trimmedService = newService.trim();
    clearError("newService");
    clearError("services");

    if (!trimmedService) {
      setErrors((prev) => ({
        ...prev,
        newService: "Service name cannot be empty",
      }));
      return;
    }

    const serviceErrors = validateNewService(trimmedService);
    if (serviceErrors.length > 0) {
      setErrors((prev) => ({ ...prev, newService: serviceErrors.join(". ") }));
      return;
    }

    if (services.length >= VALIDATION_RULES.MAX_SERVICES) {
      setErrors((prev) => ({
        ...prev,
        services: `Maximum ${VALIDATION_RULES.MAX_SERVICES} services allowed`,
      }));
      return;
    }

    setServices((prev) => [...prev, trimmedService]);
    setNewService("");
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setDescription(value);
    clearError("description");

    const descErrors = validateDescription(value);
    if (descErrors.length > 0) {
      setErrors((prev) => ({ ...prev, description: descErrors.join(". ") }));
    }
  };

  const handleServiceInputChange = (e) => {
    const value = e.target.value;
    setNewService(value);
    clearError("newService");

    if (value.trim()) {
      const serviceErrors = validateNewService(value);
      if (serviceErrors.length > 0) {
        setErrors((prev) => ({
          ...prev,
          newService: serviceErrors.join(". "),
        }));
      }
    }
  };

  const validateForm = () => {
    const imageErrors = validateImages(imageFiles);
    const descErrors = validateDescription(description);
    const serviceErrors = validateServices(services);

    const newErrors = {
      images: imageErrors.join(". "),
      description: descErrors.join(". "),
      services: serviceErrors.join(". "),
      newService: "",
    };

    setErrors(newErrors);

    return !imageErrors.length && !descErrors.length && !serviceErrors.length;
  };

  // Are all fields filled and valid?
  const allFilled = description && services.length > 0 && imageFiles.length > 0;
  const hasErrors = Object.values(errors).some((error) => error !== "");

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    // Save image files to window (cannot store Files in localStorage)
    window.serviceImageFiles = imageFiles;
    // Store other details in localStorage
    localStorage.setItem(
      "serviceRegistration",
      JSON.stringify({ description, services })
    );
    console.log(
      "Storing serviceRegistration:",
      JSON.stringify({ description, services })
    );
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
          <h2 className="section-title">▶ Branding & Details</h2>

          <div className="section">
            <div className="image-upload-section">
              <p className="section-subtitle">
                Add Images to Attract Customers
              </p>
              <div className="image-upload-box">
                <div className="upload-box">
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="44"
                      height="43"
                      viewBox="0 0 44 43"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M38.5728 23.2918V15.2293C38.5728 12.8534 37.629 10.5748 35.949 8.89483C34.269 7.21482 31.9904 6.271 29.6145 6.271H14.3853C12.0094 6.271 9.73085 7.21482 8.05084 8.89483C6.37082 10.5748 5.427 12.8534 5.427 15.2293V27.771C5.427 28.9474 5.65872 30.1123 6.10891 31.1992C6.55911 32.2861 7.21898 33.2736 8.05084 34.1055C9.73085 35.7855 12.0094 36.7293 14.3853 36.7293H25.6012"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.89282 30.4584L10.802 24.7251C11.4467 24.0848 12.2929 23.6869 13.1972 23.5987C14.1016 23.5105 15.0087 23.7376 15.7649 24.2413C16.5211 24.7451 17.4282 24.9721 18.3326 24.884C19.237 24.7958 20.0831 24.3979 20.7278 23.7576L24.9024 19.583C26.1019 18.3794 27.6901 17.6412 29.3834 17.5001C31.0768 17.359 32.7652 17.8241 34.1474 18.8126L38.5728 22.2347M14.8512 18.2213C15.2417 18.219 15.628 18.1397 15.988 17.9881C16.3479 17.8364 16.6744 17.6154 16.949 17.3376C17.2235 17.0597 17.4406 16.7305 17.5879 16.3688C17.7352 16.007 17.8098 15.6198 17.8074 15.2293C17.8051 14.8387 17.7258 14.4524 17.5742 14.0925C17.4225 13.7325 17.2015 13.406 16.9236 13.1314C16.6458 12.8569 16.3166 12.6398 15.9549 12.4925C15.5931 12.3452 15.2059 12.2707 14.8153 12.273C14.0265 12.2778 13.2719 12.5957 12.7175 13.1568C12.1631 13.7179 11.8543 14.4763 11.8591 15.2651C11.8638 16.0539 12.1817 16.8085 12.7429 17.3629C13.304 17.9173 14.0624 18.2261 14.8512 18.2213Z"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M34.0166 26.875V35.8333"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M38.125 30.6468L34.6008 27.1226C34.5242 27.0457 34.4332 26.9846 34.333 26.943C34.2328 26.9013 34.1253 26.8799 34.0167 26.8799C33.9082 26.8799 33.8007 26.9013 33.7005 26.943C33.6003 26.9846 33.5092 27.0457 33.4327 27.1226L29.9084 30.6468"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
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
                      src={img || "/placeholder.svg"}
                      alt={`Preview ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
              {errors.images && (
                <div
                  style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                >
                  {errors.images}
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <p className="section-subtitle">Add a short Service description </p>
            <textarea
              className="shop-description"
              placeholder="Write about your Business ,the story and the goal."
              value={description}
              onChange={handleDescriptionChange}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.description}
              </div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                {description.length}/{VALIDATION_RULES.MAX_DESCRIPTION_LENGTH}
              </div>
            </div>
          </div>

          <div className="section">
            <p className="section-subtitle">services</p>

            <div className="product-service-input">
              <input
                type="text"
                placeholder="Write about the product and services"
                value={newService}
                onChange={handleServiceInputChange}
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
            {errors.newService && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.newService}
              </div>
            )}

            <div className="product-tag-container">
              {services.map((service, i) => (
                <div key={i} className="product-tag">
                  {service}
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "5px",
              }}
            >
              <div style={{ color: "red", fontSize: "14px" }}>
                {errors.services}
              </div>
              <div style={{ color: "#666", fontSize: "12px" }}>
                {services.length}/{VALIDATION_RULES.MAX_SERVICES} services
              </div>
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

export default ServiceRegistrationForm;
