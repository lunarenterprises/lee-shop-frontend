import { useEffect, useState } from "react";
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

  const allFilled =
    selectedDays.length > 0 &&
    openingHour &&
    openingMeridian &&
    closingHour &&
    closingMeridian &&
    selectedDelivery &&
    Object.keys(errors).length === 0;

  const handleNext = () => {
    if (!validateForm()) {
      return;
    }

    // Format and persist current step data, but DO NOT overwrite previous step's data
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
    // Next: BrandingRegistrationform always reads previous data from localStorage!

    navigate("/BrandingRegistrationform");
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

  const handleBack = () => navigate(-1);
  const handleSkip = () => {
    navigate("/BrandingRegistrationform");
  };

  console.log({ deliveryOptions });

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Rectangle-two.png"
          alt="Shop owner"
          className="left-image2"
        />
      </div>

      <div className="right-panel2">
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
            {errors.workingDays && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.workingDays}
              </div>
            )}
          </div>

          <div className="section">
            <label
              style={{
                fontWeight: "600",
                fontSize: "16px",
                marginBottom: "8px",
                display: "block",
              }}
            >
              Opening & Closing Hours*
            </label>

            {/* Header Row */}
            <div
              style={{
                backgroundColor: "#0A5C15",
                color: "white",
                width: "100%",
                padding: "15px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "6px",
              }}
            >
              <span>Opening</span>
              <span>-</span>
              <span>Closing</span>
            </div>

            {/* Time Selection Box */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
                width: "100%",
              }}
            >
              {/* Opening Time */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  border: "1px solid #0A5C15",
                  borderRadius: "6px",
                  padding: "15px 20px",
                }}
              >
                <select
                  value={openingHour}
                  onChange={(e) =>
                    handleTimeChange(setOpeningHour, e.target.value)
                  }
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#F2F2F2",
                  }}
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
                  style={{
                    padding: "8px",
                    border: "none",
                    backgroundColor: "#F2F2F2",
                    borderRadius: "4px",
                  }}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>

              <span style={{ fontWeight: "600" }}>-</span>

              {/* Closing Time */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  border: "1px solid #0A5C15",
                  borderRadius: "6px",
                  padding: "15px 20px",
                }}
              >
                <select
                  value={closingHour}
                  onChange={(e) =>
                    handleTimeChange(setClosingHour, e.target.value)
                  }
                  style={{
                    padding: "8px",
                    border: "none",
                    backgroundColor: "#F2F2F2",
                    borderRadius: "4px",
                  }}
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
                  style={{
                    padding: "8px",
                    border: "none",
                    backgroundColor: "#F2F2F2",
                    borderRadius: "4px",
                  }}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            {/* Error Message */}
            {errors.businessHours && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.businessHours}
              </div>
            )}
          </div>

          <div className="section" style={{ marginTop: "30px" }}>
            <div className="form-group">
              <label>Do you provide delivery services?</label>
              <div className="delivery-radio-options">
                <div
                  className={`delivery-radio-item ${
                    selectedDelivery === "yes" ? "selected" : ""
                  }`}
                  onClick={() => handleDeliveryChange("yes")}
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
                </div>

                <div
                  className={`delivery-radio-item ${
                    selectedDelivery === "no" ? "selected" : ""
                  }`}
                  onClick={() => handleDeliveryChange("no")}
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
                </div>

                <div
                  className={`delivery-radio-item ${
                    selectedDelivery === "instore" ? "selected" : ""
                  }`}
                  onClick={() => handleDeliveryChange("instore")}
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
                </div>
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

export default BusinessOperatingDetails;
