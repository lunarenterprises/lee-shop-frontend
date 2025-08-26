import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryDetails.css";
import ProgressSteps from "../ProgressSteps";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    vehicle_type: "",
    work_type: "Full-time",
    licence: null,
  });

  // State for image upload
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({
    vehicle_type: "",
    work_type: "",
    images: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  // Enhanced validation functions
  const validateVehicleType = (vehicleType) => {
    const trimmed = vehicleType.trim();

    if (!trimmed) {
      return "Vehicle type is required";
    }

    if (trimmed.length < 2) {
      return "Vehicle type must be at least 2 characters long";
    }

    if (trimmed.length > 50) {
      return "Vehicle type must not exceed 50 characters";
    }

    // Allow letters, numbers, spaces, hyphens, and common punctuation
    if (!/^[a-zA-Z0-9\s\-_.]+$/.test(trimmed)) {
      return "Vehicle type contains invalid characters";
    }

    // Check if it's not just spaces or special characters
    if (!/[a-zA-Z0-9]/.test(trimmed)) {
      return "Vehicle type must contain at least one letter or number";
    }

    return "";
  };

  const validateImages = (imageArray) => {
    if (imageArray.length === 0) {
      return "Driving license image is required";
    }

    if (imageArray.length > 10) {
      return "Maximum 10 images allowed";
    }

    return "";
  };

  const validateFileType = (file) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type.toLowerCase())) {
      return `Invalid file type. Only JPEG, PNG, GIF, BMP, and WebP are allowed.`;
    }

    return "";
  };

  const validateFileSize = (file) => {
    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB as mentioned in UI

    if (file.size > maxSizeInBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `File size (${sizeMB}MB) exceeds 50MB limit`;
    }

    if (file.size < 1024) {
      // Less than 1KB might be corrupted
      return "File appears to be corrupted or too small";
    }

    return "";
  };

  const validateFileName = (fileName) => {
    // Check for valid filename
    if (fileName.length > 255) {
      return "Filename is too long";
    }

    // Check for dangerous characters
    if (/[<>:"/\\|?*\x00-\x1f]/.test(fileName)) {
      return "Filename contains invalid characters";
    }

    return "";
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {
      vehicle_type: validateVehicleType(form.vehicle_type),
      work_type: "", // Work type always has a default value, but let's validate it
      images: validateImages(images),
    };

    // Additional work type validation
    if (
      !form.work_type ||
      !["Full-time", "Part-time"].includes(form.work_type)
    ) {
      newErrors.work_type = "Please select a valid work type";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Validate single field
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "vehicle_type":
        error = validateVehicleType(value);
        break;
      case "work_type":
        if (!value || !["Full-time", "Part-time"].includes(value)) {
          error = "Please select a valid work type";
        }
        break;
      case "images":
        error = validateImages(images);
        break;
      default:
        break;
    }
    return error;
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        setForm((prevForm) => ({
          ...prevForm,
          vehicle_type: parsedData.vehicle_type || "",
          work_type: parsedData.work_type || "Full-time",
        }));

        // Load saved images if any
        const savedImages = localStorage.getItem("deliveryAgentImages");
        if (savedImages) {
          try {
            const parsedImages = JSON.parse(savedImages);
            if (Array.isArray(parsedImages)) {
              setImages(parsedImages);
            }
          } catch (error) {
            console.error("Error parsing saved images:", error);
            localStorage.removeItem("deliveryAgentImages");
          }
        }
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleVehicleTypeChange = (e) => {
    const value = e.target.value;

    // Prevent extremely long input
    if (value.length > 50) {
      return;
    }

    setForm({ ...form, vehicle_type: value });

    // Clear error when user starts typing (if form was submitted)
    if (isSubmitted) {
      const error = validateVehicleType(value);
      setErrors((prev) => ({ ...prev, vehicle_type: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (isSubmitted || value.trim() !== "") {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleWorkTypeChange = (value) => {
    // Validate the work type value
    if (["Full-time", "Part-time"].includes(value)) {
      setForm({ ...form, work_type: value });

      // Clear any work type errors
      if (isSubmitted) {
        setErrors((prev) => ({ ...prev, work_type: "" }));
      }
    }
  };

  const handleLicenceChange = (e) =>
    setForm({ ...form, licence: e.target.files[0] });

  // Image upload functions
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validationErrors = [];

    // Check total image count
    if (images.length + files.length > 10) {
      alert(
        `Cannot upload ${files.length} files. Maximum 10 images allowed. You currently have ${images.length} images.`
      );
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => {
      // Validate filename
      const nameError = validateFileName(file.name);
      if (nameError) {
        validationErrors.push(`${file.name}: ${nameError}`);
        return false;
      }

      // Validate file type
      const typeError = validateFileType(file);
      if (typeError) {
        validationErrors.push(`${file.name}: ${typeError}`);
        return false;
      }

      // Validate file size
      const sizeError = validateFileSize(file);
      if (sizeError) {
        validationErrors.push(`${file.name}: ${sizeError}`);
        return false;
      }

      return true;
    });

    // Show validation errors if any
    if (validationErrors.length > 0) {
      alert(
        "Some files could not be uploaded:\n\n" + validationErrors.join("\n")
      );
    }

    if (validFiles.length === 0) {
      return;
    }

    // Process valid files
    let processedCount = 0;
    const totalFilesToProcess = validFiles.length;

    validFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Validate the image data
        try {
          const result = e.target.result;
          if (!result || typeof result !== "string") {
            throw new Error("Invalid image data");
          }

          setImages((prev) => [...prev, result]);
          processedCount++;

          // Set the first file as the license file for form data
          if (processedCount === 1) {
            setForm((prevForm) => ({ ...prevForm, licence: file }));
          }

          // Clear error when image is uploaded
          if (isSubmitted) {
            const currentImageCount = images.length + processedCount;
            const error = validateImages([...Array(currentImageCount)]);
            setErrors((prev) => ({ ...prev, images: error }));
          }

          // Save to localStorage after all files are processed
          if (processedCount === totalFilesToProcess) {
            setTimeout(() => {
              const currentImages = images.concat(validFiles.map(() => result));
              localStorage.setItem(
                "deliveryAgentImages",
                JSON.stringify(currentImages)
              );
            }, 100);
          }
        } catch (error) {
          console.error("Error processing image:", error);
          alert(`Error processing ${file.name}. Please try again.`);
        }
      };

      reader.onerror = () => {
        alert(`Error reading ${file.name}. The file may be corrupted.`);
      };

      // Add timeout for file reading
      setTimeout(() => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
          alert(
            `Timeout reading ${file.name}. File may be too large or corrupted.`
          );
        }
      }, 30000); // 30 second timeout

      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    if (indexToRemove < 0 || indexToRemove >= images.length) {
      return; // Invalid index
    }

    const newImages = images.filter((_, index) => index !== indexToRemove);
    setImages(newImages);

    if (newImages.length === 0) {
      setForm((prevForm) => ({ ...prevForm, licence: null }));
    }

    // Validate images after removal if form was submitted
    if (isSubmitted) {
      const error = validateImages(newImages);
      setErrors((prev) => ({ ...prev, images: error }));
    }

    // Update localStorage
    try {
      localStorage.setItem("deliveryAgentImages", JSON.stringify(newImages));
    } catch (error) {
      console.error("Error saving images to localStorage:", error);
    }
  };

  // Enhanced drag and drop functions
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if the dragged items contain files
    if (e.dataTransfer.types && e.dataTransfer.types.includes("Files")) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set to false if we're leaving the drag area completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragActive(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Provide visual feedback for valid drop
    if (e.dataTransfer.types && e.dataTransfer.types.includes("Files")) {
      e.dataTransfer.dropEffect = "copy";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    try {
      const files = Array.from(e.dataTransfer.files);

      // Filter for image files only
      const imageFiles = files.filter((file) => file.type.startsWith("image/"));

      if (imageFiles.length === 0) {
        alert("No valid image files found. Please drop image files only.");
        return;
      }

      if (imageFiles.length !== files.length) {
        alert(
          `${
            files.length - imageFiles.length
          } non-image files were ignored. Only image files are allowed.`
        );
      }

      processFiles(imageFiles);
    } catch (error) {
      console.error("Error processing dropped files:", error);
      alert("Error processing dropped files. Please try again.");
    }
  };

  // Enhanced required fields validation
  const allFilled =
    form.vehicle_type.trim() &&
    form.work_type &&
    ["Full-time", "Part-time"].includes(form.work_type) &&
    images.length > 0;

  const handleNext = () => {
    setIsSubmitted(true);

    // Validate all fields
    if (validateAllFields()) {
      try {
        // Save data for next steps
        const saved = JSON.parse(
          localStorage.getItem("deliveryAgentData") || "{}"
        );
        const updatedData = {
          ...saved,
          vehicle_type: form.vehicle_type.trim(),
          work_type: form.work_type,
          timestamp: new Date().toISOString(), // Add timestamp for tracking
        };

        localStorage.setItem("deliveryAgentData", JSON.stringify(updatedData));
        localStorage.setItem("deliveryAgentImages", JSON.stringify(images));

        console.log("Storing deliveryAgentData:", JSON.stringify(updatedData));

        // Store licence file globally with additional validation
        if (form.licence) {
          window.deliveryAgentLicenceFile = form.licence;
        }
        window.deliveryAgentLicenceImages = images;

        navigate("/uploadProfilePicture");
      } catch (error) {
        console.error("Error saving form data:", error);
        alert("Error saving form data. Please try again.");
      }
    } else {
      // Enhanced error handling
      const firstErrorField = Object.keys(errors).find((key) => errors[key]);
      if (firstErrorField) {
        let element = document.querySelector(`[name="${firstErrorField}"]`);
        if (!element && firstErrorField === "images") {
          element = document.querySelector(".upload-box");
        }

        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          // Focus on the element if possible
          setTimeout(() => {
            if (element.focus && typeof element.focus === "function") {
              element.focus();
            }
          }, 100);
        }
      }

      // Show summary of errors
      const errorMessages = Object.entries(errors)
        .filter(([key, value]) => value)
        .map(([key, value]) => `${key.replace("_", " ")}: ${value}`);

      if (errorMessages.length > 0) {
        console.warn("Form validation errors:", errorMessages);
      }
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    // Add confirmation for skipping with unsaved data
    if (form.vehicle_type.trim() || images.length > 0) {
      const confirmSkip = window.confirm(
        "You have unsaved data. Are you sure you want to skip this step?"
      );
      if (!confirmSkip) {
        return;
      }
    }
    navigate("/uploadProfilePicture");
  };

  // Error message component
  const ErrorMessage = ({ errors, field, style }) => {
    if (isSubmitted && errors[field]) {
      return (
        <div
          style={{
            color: "#d32f2f",
            fontSize: "0.875rem",
            marginTop: "4px",
            ...style,
          }}
        >
          {errors[field]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Deliveryimage2.png"
          alt="Delivery Agent Details"
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
        <div className="form-content3">
          <h2 className="section-title">▶ Delivery Details</h2>

          <div className="section">
            <label className="form-label">Vehicle Type*</label>
            <div className="input-group">
              <input
                name="vehicle_type"
                className={`form-input ${
                  isSubmitted && errors.vehicle_type ? "error" : ""
                }`}
                value={form.vehicle_type}
                onChange={handleVehicleTypeChange}
                onBlur={handleBlur}
                placeholder="e.g. Motorcycle"
                required
                maxLength="50"
                autoComplete="off"
              />
            </div>
            <ErrorMessage
              errors={errors}
              field="vehicle_type"
              style={{ marginTop: "-14px" }}
            />
          </div>

          <div className="section">
            <label className="form-label">
              Are you available full-time or part-time?*
            </label>
            <div className="radio-group">
              <label className="radio-option2">
                <input
                  type="radio"
                  name="work_type"
                  checked={form.work_type === "Full-time"}
                  onChange={() => handleWorkTypeChange("Full-time")}
                  required
                />
                <span className="radio-text">Full-time</span>
              </label>
              <label className="radio-option2">
                <input
                  type="radio"
                  name="work_type"
                  checked={form.work_type === "Part-time"}
                  onChange={() => handleWorkTypeChange("Part-time")}
                  required
                />
                <span className="radio-text">Part-time</span>
              </label>
            </div>
            <ErrorMessage errors={errors} field="work_type" />
          </div>

          <div className="section">
            <div className="image-upload-section">
              <label className="form-label">Upload Driving License*</label>
              <div className="image-upload-box">
                <div
                  className={`upload-box ${isDragActive ? "drag-active" : ""} ${
                    isSubmitted && errors.images ? "error" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: `2px dashed ${
                      isDragActive ? "#0A5C15" : "#0A5C15"
                    }`,
                    borderRadius: "8px",
                    padding: "40px 20px",
                    textAlign: "center",
                    backgroundColor: isDragActive ? "#f8f9fa" : "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    minWidth: "200px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "Raleway",
                      fontWeight: 500,
                      fontStyle: "normal",
                      fontSize: "16px",
                      lineHeight: "100%",
                      letterSpacing: "0",
                      textAlign: "center",
                      color: "#000000",
                    }}
                  >
                    Drag and drop your Driving Licenes or
                  </p>
                  <p
                    style={{
                      fontFamily: "Raleway",
                      fontWeight: 400,
                      fontStyle: "normal",
                      fontSize: "12px",
                      lineHeight: "100%",
                      letterSpacing: "0",
                      textAlign: "center",
                      color: "#858585",
                    }}
                  >
                    JPEG, PNG, PDF & formats, upto 50 MB
                  </p>
                  <span
                    className="upload-btn"
                    onClick={handleUploadClick}
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      fontSize: "16px",
                      fontWeight: "500",
                    }}
                  >
                    Choose a file
                  </span>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                </div>
                {images.length > 0 && (
                  <div
                    className="image-gallery"
                    style={{
                      marginTop: "20px",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(120px, 1fr))",
                      gap: "10px",
                    }}
                  >
                    {images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          position: "relative",
                          display: "inline-block",
                          borderRadius: "8px",
                          overflow: "hidden",
                          border: "2px solid #e0e0e0",
                        }}
                      >
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`License Preview ${i + 1}`}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                        <button
                          onClick={() => handleRemoveImage(i)}
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            background: "rgba(220, 53, 69, 0.9)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "24px",
                            height: "24px",
                            cursor: "pointer",
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "bold",
                          }}
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <ErrorMessage errors={errors} field="images" />
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

export default DeliveryDetails;
