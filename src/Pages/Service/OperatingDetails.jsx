import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OperatingDetails.css";

const OperatingDetails = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [selectedServiceArea, setSelectedServiceArea] = useState(0);
  const navigate = useNavigate();

  const deliveryOptions = [
    "Yes, I have my own delivery staff",
    "No, I need freelance delivery support",
    "Only in-store service",
  ];

  const serviceAreaOptions = ["In-shop Only", "Home Service", "Both"];

  return (
    <div className="business-container">
      <div className="left-panel">
        <img src="/operationdetails.png" alt="Shop owner" />
        {/* <p>“Make it easier for traditional shop owners to go online with simple registration, basic marketing, and delivery support.”</p> */}
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
          <label>Start Time & End Time</label>

          <div className="time-label-box">
            <span className="left">Opening</span>
            <span className="right">Closing</span>
          </div>

          <div className="time-box">
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
          </div>
        </div>

        <div className="section two-columns">
          <div>
            <label>Service Area Coverage</label>
            <ul className="delivery-options">
              {serviceAreaOptions.map((opt, index) => (
                <li
                  key={opt}
                  className={selectedServiceArea === index ? "selected" : ""}
                  onClick={() => setSelectedServiceArea(index)}
                >
                  <span className="dot"></span> {opt}
                </li>
              ))}
            </ul>
          </div>

          <div>
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

        <div className="buttons">
          <button className="back">Back</button>
          <button className="skip">Skip</button>
          <button
            className="next"
            onClick={() => navigate("/ServiceRegistrationForm")}
          >
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OperatingDetails;
