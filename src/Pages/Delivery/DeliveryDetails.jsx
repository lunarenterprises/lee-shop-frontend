import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryDetails.css";
import { ChevronDown } from "lucide-react";
import ProgressSteps from "../ProgressSteps";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    vehicle_type: "",
    work_type: "Full-time",
    licence: null,
  });

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: true, active: true },
    { id: 3, completed: false, active: false },
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
        setForm((prevForm) => ({
          ...prevForm,
          vehicle_type: parsedData.vehicle_type || "",
          work_type: parsedData.work_type || "Full-time",
        }));
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleVehicleTypeChange = (e) =>
    setForm({ ...form, vehicle_type: e.target.value });

  const handleWorkTypeChange = (value) =>
    setForm({ ...form, work_type: value });

  const handleLicenceChange = (e) =>
    setForm({ ...form, licence: e.target.files[0] });

  // Required fields validation
  const allFilled = form.vehicle_type && form.work_type && form.licence;

  const handleNext = () => {
    // Save data for next steps
    const saved = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
    localStorage.setItem(
      "deliveryAgentData",
      JSON.stringify({
        ...saved,
        vehicle_type: form.vehicle_type,
        work_type: form.work_type,
      })
    );
    console.log(
      "Storing deliveryAgentData:",
      JSON.stringify({
        ...saved,
        vehicle_type: form.vehicle_type,
        work_type: form.work_type,
      })
    );

    // Store licence file globally
    window.deliveryAgentLicenceFile = form.licence;

    navigate("/uploadProfilePicture");
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/uploadProfilePicture");
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
            <label className="form-label">
              Vehicle Type*
              <div className="input-group">
                <input
                  name="vehicle_type"
                  className="form-input"
                  value={form.vehicle_type}
                  onChange={handleVehicleTypeChange}
                  placeholder="e.g. Motorcycle"
                  required
                />
              </div>
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              Are you available full-time or part-time?*
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="work_type"
                    checked={form.work_type === "Full-time"}
                    onChange={() => handleWorkTypeChange("Full-time")}
                    required
                  />
                  <span className="radio-text">Full-time</span>
                </label>
                <label className="radio-option">
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
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              Upload Driving License*
              <input
                type="file"
                name="licence"
                accept="image/*,application/pdf"
                style={{ paddingLeft: "20px" }}
                onChange={handleLicenceChange}
                required
              />
              {form.licence && (
                <span className="file-selected">
                  File selected: {form.licence.name}
                </span>
              )}
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

export default DeliveryDetails;
