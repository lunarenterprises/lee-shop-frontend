import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BusinessOperatingDetails.css";

const BusinessOperatingDetails = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const navigate = useNavigate();

  const deliveryOptions = [
    "Yes, I have my own delivery staff",
    "No, I need freelance delivery support",
    "Only in-store service",
  ];

  return (
    <div className="business-container">
      <div className="left-panel">
        <img src="/Rectangle-two.png" alt="Shop owner" />
      </div>

      <div className="right-panel">
        <div className="progress">
          <div className="steps">
            <span></span>
            <span></span>
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>
          <div className="title">Business Registration.</div>
        </div>

        <h2>▶ Operating Details</h2>

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
            <select><option>08:00</option></select>
            <select><option>AM</option></select>
            <span>-</span>
            <select><option>10:00</option></select>
            <select><option>PM</option></select>
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

        <div className="buttons">
          <button className="back">Back</button>
          <button className="skip">Skip</button>
          <button className="next" onClick={() => navigate("/BrandingRegistrationform")}>
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessOperatingDetails;
