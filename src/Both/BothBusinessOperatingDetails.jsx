import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BothBusinessOperatingDetails.css"; // renamed CSS file
import ProgressSteps from "../Pages/ProgressSteps";

const BothBusinessOperatingDetails = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const navigate = useNavigate();

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: true, active: true },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  const deliveryOptions = [
    "Yes, I have my own delivery staff",
    "No, I need freelance delivery support",
    "Only in-store service",
  ];

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/BrandingRegistrationform");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Rectangle-two.png"
          alt="Shop owner"
        />
      </div>

      <div className="right-panel2">
        {/* Progress Header - Added to fix the gap */}
        <ProgressSteps
          title={"Business Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content2">
          <h2 className="section-title">▶ Operating Details</h2>
          
          <div className="section">
            <label>Working Days</label>
            <div className="days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button key={day}>{day}</button>
              ))}
            </div>
          </div>

          <div className="section">
            <label>Opening & Closing Hours</label>
            <div className="time-box">
              <div className="time-label">Opening</div>
              <select>
                <option>08:00</option>
              </select>
              <select>
                <option>AM</option>
              </select>
              <span>-</span>
              <select>
                <option>10:00</option>
              </select>
              <select>
                <option>PM</option>
              </select>
              <div className="time-label">Closing</div>
            </div>
          </div>

          <div className="section">
            <label>Do you provide delivery services?</label>
            <ul className="delivery-options">
              {deliveryOptions.map((opt, index) => (
                <li
                  key={opt}
                  className={selectedDelivery === index ? "selected" : ""}
                  onClick={() => setSelectedDelivery(index)}
                >
                  <span className="dot"></span> {opt}
                </li>
              ))}
            </ul>
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
              onClick={() => navigate("/BrandingRegistrationform")}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BothBusinessOperatingDetails;