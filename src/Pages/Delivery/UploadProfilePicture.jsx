import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadProfilePicture.css";
import ProgressSteps from "../ProgressSteps";

const UploadProfilePicture = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    profile: null,
  });

  // State for validation
  const [errors, setErrors] = useState({
    profile: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: true, active: true },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  // Validation functions
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
      return "Invalid file type. Only JPEG, PNG, GIF, BMP, and WebP images are allowed.";
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
    // Check for valid filename length
    if (fileName.length > 255) {
      return "Filename is too long (max 255 characters)";
    }

    // Check for dangerous characters
    if (/[<>:"/\\|?*\x00-\x1f]/.test(fileName)) {
      return "Filename contains invalid characters";
    }

    // Check for proper file extension
    const validExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"];
    const fileExtension = fileName
      .toLowerCase()
      .substring(fileName.lastIndexOf("."));

    if (!validExtensions.includes(fileExtension)) {
      return "File must have a valid image extension (.jpg, .jpeg, .png, .gif, .bmp, .webp)";
    }

    return "";
  };

  const validateImageDimensions = (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        // Check minimum dimensions for profile picture
        if (img.width < 50 || img.height < 50) {
          resolve("Image dimensions are too small (minimum 50x50 pixels)");
          return;
        }

        // Check maximum dimensions
        if (img.width > 5000 || img.height > 5000) {
          resolve("Image dimensions are too large (maximum 5000x5000 pixels)");
          return;
        }

        resolve("");
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve("Invalid or corrupted image file");
      };

      // Set timeout for image loading
      setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve("Timeout loading image - file may be corrupted");
      }, 10000); // 10 second timeout

      img.src = url;
    });
  };

  const validateProfile = async (file) => {
    if (!file) {
      return "Profile picture is required";
    }

    // Validate filename
    const nameError = validateFileName(file.name);
    if (nameError) {
      return nameError;
    }

    // Validate file type
    const typeError = validateFileType(file);
    if (typeError) {
      return typeError;
    }

    // Validate file size
    const sizeError = validateFileSize(file);
    if (sizeError) {
      return sizeError;
    }

    // Validate image dimensions
    const dimensionError = await validateImageDimensions(file);
    if (dimensionError) {
      return dimensionError;
    }

    return "";
  };

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        // Note: File objects can't be stored in localStorage, so we won't restore the file

        // Check if there's a saved profile file globally
        if (window.deliveryAgentProfileFile) {
          setForm({ ...form, profile: window.deliveryAgentProfileFile });
        }
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleProfileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setForm({ ...form, profile: null });
      if (isSubmitted) {
        setErrors((prev) => ({
          ...prev,
          profile: "Profile picture is required",
        }));
      }
      return;
    }

    // Basic validation first
    const nameError = validateFileName(file.name);
    if (nameError) {
      alert(nameError);
      e.target.value = ""; // Clear the input
      return;
    }

    const typeError = validateFileType(file);
    if (typeError) {
      alert(typeError);
      e.target.value = ""; // Clear the input
      return;
    }

    const sizeError = validateFileSize(file);
    if (sizeError) {
      alert(sizeError);
      e.target.value = ""; // Clear the input
      return;
    }

    // Set the file first
    setForm({ ...form, profile: file });

    // Clear any previous errors
    if (isSubmitted) {
      setErrors((prev) => ({ ...prev, profile: "" }));
    }

    // Validate image dimensions asynchronously
    try {
      const dimensionError = await validateImageDimensions(file);
      if (dimensionError) {
        alert(dimensionError);
        setForm({ ...form, profile: null });
        e.target.value = ""; // Clear the input
        if (isSubmitted) {
          setErrors((prev) => ({ ...prev, profile: dimensionError }));
        }
        return;
      }
    } catch (error) {
      console.error("Error validating image:", error);
      alert("Error processing image. Please try again.");
      setForm({ ...form, profile: null });
      e.target.value = ""; // Clear the input
      return;
    }
  };

  // Validate all fields
  const validateAllFields = async () => {
    const profileError = await validateProfile(form.profile);
    const newErrors = {
      profile: profileError,
    };

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  // Only enable Next if a profile picture is selected and valid
  const allFilled = !!form.profile;

  const handleNext = async () => {
    setIsSubmitted(true);

    // Show loading state
    const originalButtonText = "Next →";
    const nextButton = document.querySelector(".next-btn2");
    if (nextButton) {
      nextButton.textContent = "Validating...";
      nextButton.disabled = true;
    }

    try {
      // Validate all fields
      const isValid = await validateAllFields();

      if (isValid) {
        // Additional file integrity check
        if (form.profile && form.profile.size > 0) {
          // Save data for next steps (profile picture will be stored globally)
          const saved = JSON.parse(
            localStorage.getItem("deliveryAgentData") || "{}"
          );
          const updatedData = {
            ...saved,
            hasProfilePicture: true,
            profilePictureName: form.profile.name,
            profilePictureSize: form.profile.size,
            timestamp: new Date().toISOString(),
          };

          localStorage.setItem(
            "deliveryAgentData",
            JSON.stringify(updatedData)
          );

          console.log(
            "Storing deliveryAgentData:",
            JSON.stringify(updatedData)
          );

          // Store profile file globally
          window.deliveryAgentProfileFile = form.profile;

          navigate("/DeliveryContactInformation");
        } else {
          alert(
            "Selected file appears to be invalid. Please select a different image."
          );
        }
      } else {
        // Show validation errors
        const errorMessage = errors.profile;
        if (errorMessage) {
          alert(errorMessage);
        }

        // Focus on file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
          fileInput.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => {
            if (fileInput.click) {
              // Optionally trigger file selector
              // fileInput.click();
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error("Error validating profile picture:", error);
      alert("Error validating profile picture. Please try again.");
    } finally {
      // Restore button state
      if (nextButton) {
        nextButton.textContent = originalButtonText;
        nextButton.disabled = false;
      }
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    // Add confirmation for skipping
    if (form.profile) {
      const confirmSkip = window.confirm(
        "You have selected a profile picture. Are you sure you want to skip uploading it?"
      );
      if (!confirmSkip) {
        return;
      }
    }

    // Clear any stored profile data if skipping
    if (window.deliveryAgentProfileFile) {
      delete window.deliveryAgentProfileFile;
    }

    navigate("/DeliveryContactInformation");
  };

  // Error message component
  const ErrorMessage = ({ errors, field }) => {
    if (isSubmitted && errors[field]) {
      return (
        <div
          style={{
            color: "#d32f2f",
            fontSize: "0.875rem",
            marginTop: "4px",
            textAlign: "left",
            fontWeight: 600,
          }}
        >
          {errors[field]}
        </div>
      );
    }
    return null;
  };

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/deliverygirl.png"
          alt="Profile Upload Illustration"
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
          <h2 className="section-title">▶ Upload Profile Picture</h2>

          <div className="section">
            <label className="form-label">Profile Picture*</label>
            <div className="upload-section">
              <div
                className={`upload-box ${
                  isSubmitted && errors.profile ? "error" : ""
                }`}
              >
                <div className="upload-icon">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 44 44"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M38.5728 23.7916V15.7291C38.5728 13.3532 37.629 11.0746 35.949 9.39459C34.269 7.71457 31.9904 6.77075 29.6145 6.77075H14.3853C12.0094 6.77075 9.73085 7.71457 8.05084 9.39459C6.37082 11.0746 5.427 13.3532 5.427 15.7291V28.2708C5.427 29.4472 5.65872 30.6121 6.10891 31.699C6.55911 32.7858 7.21898 33.7734 8.05084 34.6052C9.73085 36.2853 12.0094 37.2291 14.3853 37.2291H25.6012"
                      stroke="#0A5C15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.89282 30.9582L10.802 25.2248C11.4467 24.5845 12.2929 24.1866 13.1972 24.0985C14.1016 24.0103 15.0087 24.2373 15.7649 24.7411C16.5211 25.2449 17.4282 25.4719 18.3326 25.3837C19.237 25.2956 20.0831 24.8977 20.7278 24.2573L24.9024 20.0828C26.1019 18.8792 27.6901 18.141 29.3834 17.9998C31.0768 17.8587 32.7652 18.3239 34.1474 19.3123L38.5728 22.7344M14.8512 18.7211C15.2417 18.7187 15.628 18.6395 15.988 18.4878C16.3479 18.3362 16.6744 18.1152 16.949 17.8373C17.2235 17.5595 17.4406 17.2303 17.5879 16.8685C17.7352 16.5068 17.8098 16.1196 17.8074 15.729C17.8051 15.3384 17.7258 14.9522 17.5742 14.5922C17.4225 14.2323 17.2015 13.9057 16.9236 13.6312C16.6458 13.3567 16.3166 13.1396 15.9549 12.9923C15.5931 12.845 15.2059 12.7704 14.8153 12.7728C14.0265 12.7775 13.2719 13.0954 12.7175 13.6565C12.1631 14.2177 11.8543 14.976 11.8591 15.7648C11.8638 16.5536 12.1817 17.3082 12.7429 17.8626C13.304 18.4171 14.0624 18.7258 14.8512 18.7211Z"
                      stroke="#0A5C15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M34.0166 27.375V36.3333"
                      stroke="#0A5C15"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M38.125 31.1463L34.6008 27.6221C34.5242 27.5452 34.4332 27.4841 34.333 27.4425C34.2328 27.4008 34.1253 27.3794 34.0167 27.3794C33.9082 27.3794 33.8007 27.4008 33.7005 27.4425C33.6003 27.4841 33.5092 27.5452 33.4327 27.6221L29.9084 31.1463"
                      stroke="#0A5C15"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div className="upload-text">
                  <p style={{ color: "#000000" }}>
                    Please Upload a Profile picture
                  </p>
                  <small>JPEG, PNG formats up to 50 MB</small>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <label
                    style={{
                      backgroundColor: "#0A5C15",
                      color: "white",
                      maxWidth: "160px",
                      padding: "5px 10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      borderRadius: "6px",
                    }}
                  >
                    <p style={{ color: "white", margin: 0 }}>Choose a file</p>
                    <input
                      type="file"
                      name="profile"
                      hidden
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp"
                      onChange={handleProfileChange}
                      required
                    />
                  </label>
                </div>
                {form.profile && (
                  <div
                    className="file-selected"
                    style={{ marginTop: "10px", textAlign: "center" }}
                  >
                    <div style={{ color: "#0A5C15", fontWeight: "500" }}>
                      Selected: {form.profile.name}
                    </div>
                    <div style={{ color: "#666", fontSize: "0.875rem" }}>
                      Size: {formatFileSize(form.profile.size)}
                    </div>
                  </div>
                )}
              </div>
              <ErrorMessage errors={errors} field="profile" />
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

export default UploadProfilePicture;
