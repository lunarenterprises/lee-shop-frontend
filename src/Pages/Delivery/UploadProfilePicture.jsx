import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import "./UploadProfilePicture.css";
import ProgressSteps from "../ProgressSteps";

const UploadProfilePicture = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    profile: null,
  });

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: true, active: true },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        // Note: File objects can't be stored in localStorage, so we won't restore the file
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, profile: file });
  };

  // Only enable Next if a profile picture is selected
  const allFilled = !!form.profile;

  const handleNext = () => {
    // Save data for next steps (profile picture will be stored globally)
    const saved = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
    localStorage.setItem(
      "deliveryAgentData",
      JSON.stringify({
        ...saved,
        hasProfilePicture: !!form.profile,
      })
    );
    console.log(
      "Storing deliveryAgentData:",
      JSON.stringify({
        ...saved,
        hasProfilePicture: !!form.profile,
      })
    );

    // Store profile file globally
    window.deliveryAgentProfileFile = form.profile;

    navigate("/DeliveryContactInformation");
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/DeliveryContactInformation");
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
            <label className="form-label">
              Profile Picture*
              <div className="upload-section">
                <div className="upload-box">
                  <div className="upload-icon">
                    <Upload size={32} style={{ color: "#666" }} />
                  </div>
                  <div className="upload-text">
                    <p>Please Upload a Profile picture</p>
                    <small>JPEG, PNG formats up to 50 MB</small>
                  </div>
                  <label className="choose-file-btn">
                    Choose a file
                    <input
                      type="file"
                      name="profile"
                      hidden
                      accept="image/*"
                      onChange={handleProfileChange}
                      required
                    />
                  </label>
                  {form.profile && (
                    <div className="file-selected">
                      Selected: {form.profile.name}
                    </div>
                  )}
                </div>
              </div>
            </label>
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
              onClick={handleNext}
              disabled={!allFilled}
              style={{
                opacity: allFilled ? 1 : 0.5,
                cursor: allFilled ? "pointer" : "not-allowed",
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
