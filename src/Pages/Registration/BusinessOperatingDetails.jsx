import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BusinessOperatingDetails.css"; // renamed CSS file
import ProgressSteps from "../ProgressSteps";

const BusinessOperatingDetails = () => {
  const navigate = useNavigate();



  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: true, active: true },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ];

  const [selectedDays, setSelectedDays] = useState([]);
  const [openingHour, setOpeningHour] = useState("08:00");
  const [openingMeridian, setOpeningMeridian] = useState("AM");
  const [closingHour, setClosingHour] = useState("10:00");
  const [closingMeridian, setClosingMeridian] = useState("PM");
  const [selectedDelivery, setSelectedDelivery] = useState(0);

  const deliveryOptions = [
    "Yes, I have my own delivery staff",
    "No, I need freelance delivery support",
    "Only in-store service",
  ];

  useEffect(() => {
    // Load operating details from localStorage
    const savedOperatingDetails = localStorage.getItem("operatingDetails");
    if (savedOperatingDetails) {
      try {
        const parsedData = JSON.parse(savedOperatingDetails);
        console.log("Loading operatingDetails from localStorage:", parsedData);

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
      } catch (error) {
        console.error("Error parsing localStorage operatingDetails:", error);
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("operatingDetails");
      }
    }
  }, []);

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  // Enable Next button only if every required field of this step is filled
  const allFilled =
    selectedDays.length > 0 &&
    openingHour &&
    openingMeridian &&
    closingHour &&
    closingMeridian &&
    deliveryOptions[selectedDelivery];

  const handleNext = () => {
    // Format and persist current step data, but DO NOT overwrite previous step's data
    const formattedOpening = `${openingHour} ${openingMeridian}`;
    const formattedClosing = `${closingHour} ${closingMeridian}`;

    const opDetails = {
      working_days: selectedDays,
      opening_hours: `${formattedOpening} - ${formattedClosing}`,
      delivery_option: deliveryOptions[selectedDelivery],
    };

    localStorage.setItem("operatingDetails", JSON.stringify(opDetails));
    console.log("Storing operatingDetails:", opDetails);
    // Next: BrandingRegistrationform always reads previous data from localStorage!

    navigate("/BrandingRegistrationform");
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/BrandingRegistrationform");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/Rectangle-two.png" alt="Shop owner" className="left-image2" />
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
            <label>Working Days*</label>
            <div className="days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={selectedDays.includes(day) ? "selected" : ""}
                  onClick={() => toggleDay(day)}
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

          <div className="section">
            <label>Do you provide delivery services?*</label>
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

export default BusinessOperatingDetails;