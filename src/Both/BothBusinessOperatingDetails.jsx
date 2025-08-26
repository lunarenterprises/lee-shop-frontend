import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BothBusinessOperatingDetails.css"; // renamed CSS file
import ProgressSteps from "../Pages/ProgressSteps";

const BothBusinessOperatingDetails = () => {
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
  const [selectedDelivery, setSelectedDelivery] = useState("");
  const [errors, setErrors] = useState({});

  const deliveryOptions = [
    "Yes, I have my own delivery staff",
    "No, I need freelance delivery support",
    "Only in-store service",
  ];

  const convertTo24Hour = (time, meridian) => {
    const [hours, minutes] = time.split(":").map(Number);
    if (meridian === "AM") {
      return hours === 12 ? 0 : hours;
    } else {
      return hours === 12 ? 12 : hours + 12;
    }
  };

  const validateBusinessHours = () => {
    const openingTime = convertTo24Hour(openingHour, openingMeridian);
    const closingTime = convertTo24Hour(closingHour, closingMeridian);

    if (openingTime >= closingTime) {
      return "Opening time must be before closing time";
    }

    // Check for reasonable business hours (at least 1 hour operation)
    const timeDiff = closingTime - openingTime;
    if (timeDiff < 1) {
      return "Business must be open for at least 1 hour";
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate working days
    if (selectedDays.length === 0) {
      newErrors.workingDays = "Please select at least one working day";
    }

    // Validate business hours
    const hoursError = validateBusinessHours();
    if (hoursError) {
      newErrors.businessHours = hoursError;
    }

    // Validate delivery option
    if (!selectedDelivery) {
      newErrors.deliveryOption = "Please select a delivery option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

        if (parsedData.delivery_option) {
          const deliveryIndex = deliveryOptions.findIndex(
            (option) => option === parsedData.delivery_option
          );
          if (deliveryIndex !== -1) {
            // Map index to string values for consistency
            const deliveryValues = ["yes", "no", "instore"];
            setSelectedDelivery(deliveryValues[deliveryIndex]);
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
    if (errors.workingDays) {
      setErrors((prev) => ({ ...prev, workingDays: null }));
    }
  };

  const handleTimeChange = (setter, value) => {
    setter(value);
    // Clear business hours error when user changes time
    if (errors.businessHours) {
      setErrors((prev) => ({ ...prev, businessHours: null }));
    }
  };

  const handleDeliveryChange = (value) => {
    setSelectedDelivery(value);
    // Clear delivery option error when user selects an option
    if (errors.deliveryOption) {
      setErrors((prev) => ({ ...prev, deliveryOption: null }));
    }
  };

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    // Format and persist current step data
    const formattedOpening = `${openingHour} ${openingMeridian}`;
    const formattedClosing = `${closingHour} ${closingMeridian}`;

    const deliveryMapping = {
      yes: deliveryOptions[0],
      no: deliveryOptions[1],
      instore: deliveryOptions[2],
    };

    const opDetails = {
      working_days: selectedDays,
      opening_hours: `${formattedOpening} - ${formattedClosing}`,
      delivery_option: deliveryMapping[selectedDelivery],
    };

    localStorage.setItem("operatingDetails", JSON.stringify(opDetails));
    console.log("Storing operatingDetails:", opDetails);

    navigate("/BrandingRegistrationform");
  };

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/BrandingRegistrationform");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/Rectangle-two.png" alt="Shop owner" />
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
            {errors.workingDays && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.workingDays}
              </div>
            )}
          </div>

          <div className="section">
            <label>Opening & Closing Hours*</label>
            <div className="time-box">
              <div className="time-label">Opening</div>
              <select
                value={openingHour}
                onChange={(e) =>
                  handleTimeChange(setOpeningHour, e.target.value)
                }
              >
                <option>08:00</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>12:00</option>
              </select>
              <select
                value={openingMeridian}
                onChange={(e) =>
                  handleTimeChange(setOpeningMeridian, e.target.value)
                }
              >
                <option>AM</option>
                <option>PM</option>
              </select>
              <span>-</span>
              <select
                value={closingHour}
                onChange={(e) =>
                  handleTimeChange(setClosingHour, e.target.value)
                }
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
                onChange={(e) =>
                  handleTimeChange(setClosingMeridian, e.target.value)
                }
              >
                <option>AM</option>
                <option>PM</option>
              </select>
              <div className="time-label">Closing</div>
            </div>
            {errors.businessHours && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.businessHours}
              </div>
            )}
          </div>

          <div className="section" style={{ marginTop: "30px" }}>
            <div className="form-group">
              <label>Do you provide delivery services?*</label>
              <div className="delivery-radio-options">
                <label
                  className={`delivery-radio-item ${
                    selectedDelivery === "yes" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedDelivery"
                    value="yes"
                    checked={selectedDelivery === "yes"}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                  />
                  <span className="radio-indicator">
                    {selectedDelivery === "yes" && (
                      <span className="checkmark">✓</span>
                    )}
                  </span>
                  <span className="radio-text">
                    Yes, I have my own delivery staff
                  </span>
                </label>
                <label
                  className={`delivery-radio-item ${
                    selectedDelivery === "no" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedDelivery"
                    value="no"
                    checked={selectedDelivery === "no"}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                  />
                  <span className="radio-indicator">
                    {selectedDelivery === "no" ? (
                      <span className="checkmark">✓</span>
                    ) : (
                      <span className="dot"></span>
                    )}
                  </span>
                  <span className="radio-text">
                    No, I need freelance delivery support
                  </span>
                </label>
                <label
                  className={`delivery-radio-item ${
                    selectedDelivery === "instore" ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedDelivery"
                    value="instore"
                    checked={selectedDelivery === "instore"}
                    onChange={(e) => handleDeliveryChange(e.target.value)}
                  />
                  <span className="radio-indicator">
                    {selectedDelivery === "instore" ? (
                      <span className="checkmark">✓</span>
                    ) : (
                      <span className="dot"></span>
                    )}
                  </span>
                  <span className="radio-text">Only in-store service</span>
                </label>
              </div>
              {errors.deliveryOption && (
                <div
                  style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                >
                  {errors.deliveryOption}
                </div>
              )}
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

export default BothBusinessOperatingDetails;
