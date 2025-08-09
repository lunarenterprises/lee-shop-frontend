import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OperatingDetails.css"; // renamed CSS file
import ProgressSteps from "../ProgressSteps";

const OperatingDetails = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [selectedServiceArea, setSelectedServiceArea] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [openingHour, setOpeningHour] = useState("08:00");
  const [openingMeridian, setOpeningMeridian] = useState("AM");
  const [closingHour, setClosingHour] = useState("10:00");
  const [closingMeridian, setClosingMeridian] = useState("PM");

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

  const serviceAreaOptions = ["In-shop Only", "Home Service", "Both"];
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Load operating details from localStorage when component mounts
  useEffect(() => {
    const savedOperatingDetails = localStorage.getItem(
      "serviceOperatingDetails"
    );
    if (savedOperatingDetails) {
      try {
        const parsedData = JSON.parse(savedOperatingDetails);
        console.log(
          "Loading serviceOperatingDetails from localStorage:",
          parsedData
        );

        // Set working days
        if (parsedData.working_days && Array.isArray(parsedData.working_days)) {
          setSelectedDays(parsedData.working_days);
        }

        // Parse opening hours (format: "08:00 AM - 10:00 PM")
        if (parsedData.opening_hours) {
          const hoursMatch = parsedData.opening_hours.match(
            /(\d{1,2}:\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}:\d{2})\s*(AM|PM)/i
          );
          if (hoursMatch) {
            setOpeningHour(hoursMatch[1]);
            setOpeningMeridian(hoursMatch[2].toUpperCase());
            setClosingHour(hoursMatch[3]);
            setClosingMeridian(hoursMatch[4].toUpperCase());
          }
        }

        // Set delivery option
        if (parsedData.delivery_option) {
          const deliveryIndex = deliveryOptions.findIndex(
            (option) => option === parsedData.delivery_option
          );
          if (deliveryIndex !== -1) {
            setSelectedDelivery(deliveryIndex);
          }
        }

        // Set service area option
        if (parsedData.service_area) {
          const serviceAreaIndex = serviceAreaOptions.findIndex(
            (option) => option === parsedData.service_area
          );
          if (serviceAreaIndex !== -1) {
            setSelectedServiceArea(serviceAreaIndex);
          }
        }
      } catch (error) {
        console.error(
          "Error parsing localStorage serviceOperatingDetails:",
          error
        );
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("serviceOperatingDetails");
      }
    }

    // Also check for legacy working days storage
    const legacyWorkingDays = localStorage.getItem("workingDays");
    if (legacyWorkingDays && !savedOperatingDetails) {
      try {
        const parsedDays = JSON.parse(legacyWorkingDays);
        if (Array.isArray(parsedDays)) {
          setSelectedDays(parsedDays);
        }
      } catch (error) {
        console.error("Error parsing legacy workingDays:", error);
        localStorage.removeItem("workingDays");
      }
    }
  }, []);

  // Toggle day button
  const toggleDay = (day) => {
    setSelectedDays((prevDays) => {
      if (prevDays.includes(day)) {
        return prevDays.filter((d) => d !== day);
      } else {
        return [...prevDays, day];
      }
    });
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/ServiceRegistrationForm");
  };

  const handleNext = () => {
    // Format and save all operating details
    const formattedOpening = `${openingHour} ${openingMeridian}`;
    const formattedClosing = `${closingHour} ${closingMeridian}`;

    const serviceOpDetails = {
      working_days: selectedDays,
      opening_hours: `${formattedOpening} - ${formattedClosing}`,
      delivery_option: deliveryOptions[selectedDelivery],
      service_area: serviceAreaOptions[selectedServiceArea],
    };

    localStorage.setItem(
      "serviceOperatingDetails",
      JSON.stringify(serviceOpDetails)
    );
    console.log("Storing serviceOperatingDetails:", serviceOpDetails);

    // Remove legacy storage if it exists
    localStorage.removeItem("workingDays");

    navigate("/ServiceRegistrationForm");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/operationdetails.png" alt="Shop owner" />
      </div>

      <div className="right-panel_2">
        {/* Progress Header */}
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
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  className={selectedDays.includes(day) ? "day-selected" : ""}
                  onClick={() => toggleDay(day)}
                  type="button"
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
          <div className="section">
            <label>Opening & Closing Hours*</label>
            <div className="time-box">
              <div className="time-label">Opening</div>
              <select
                value={openingHour}
                onChange={(e) => setOpeningHour(e.target.value)}
              >
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
              </select>
              <select
                value={openingMeridian}
                onChange={(e) => setOpeningMeridian(e.target.value)}
              >
                <option>AM</option>
                <option>PM</option>
              </select>

              <span>-</span>

              <select
                value={closingHour}
                onChange={(e) => setClosingHour(e.target.value)}
              >
                <option>05:00</option>
                <option>06:00</option>
                <option>07:00</option>
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
              </select>
              <select
                value={closingMeridian}
                onChange={(e) => setClosingMeridian(e.target.value)}
              >
                <option>AM</option>
                <option>PM</option>
              </select>

              <div className="time-label">Closing</div>
            </div>
          </div>

          <div className="section two-columns">
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

export default OperatingDetails;
