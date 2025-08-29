import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OperatingDetails.css";
import ProgressSteps from "../ProgressSteps";

const OperatingDetails = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(0);
  const [selectedServiceArea, setSelectedServiceArea] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [openingHour, setOpeningHour] = useState("08:00");
  const [openingMeridian, setOpeningMeridian] = useState("AM");
  const [closingHour, setClosingHour] = useState("10:00");
  const [closingMeridian, setClosingMeridian] = useState("PM");
  const [deliveryService, setDeliveryService] = useState("yes");

  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    // Validate working days
    if (selectedDays.length === 0) {
      newErrors.workingDays = "Please select at least one working day";
    }

    // Validate opening/closing hours
    const openingTime = convertTo24Hour(openingHour, openingMeridian);
    const closingTime = convertTo24Hour(closingHour, closingMeridian);

    if (openingTime >= closingTime) {
      newErrors.hours = "Closing time must be after opening time";
    }

    // Validate service area selection
    if (selectedServiceArea === null || selectedServiceArea === undefined) {
      newErrors.serviceArea = "Please select a service area option";
    }

    // Validate delivery service selection
    if (!deliveryService) {
      newErrors.deliveryService = "Please select a delivery service option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const convertTo24Hour = (time, meridian) => {
    const [hours, minutes] = time.split(":").map(Number);
    let hour24 = hours;

    if (meridian === "AM" && hours === 12) {
      hour24 = 0;
    } else if (meridian === "PM" && hours !== 12) {
      hour24 = hours + 12;
    }

    return hour24 * 60 + minutes; // Convert to minutes for easier comparison
  };

  // Add the missing handleTimeChange function
  const handleTimeChange = (setter, value) => {
    setter(value);
    // Clear hours error when user changes time
    if (errors.hours) {
      setErrors((prev) => ({ ...prev, hours: null }));
    }
  };

  useEffect(() => {
    if (showErrors) {
      validateForm();
    }
  }, [
    selectedDays,
    openingHour,
    openingMeridian,
    closingHour,
    closingMeridian,
    deliveryService,
    selectedServiceArea,
    showErrors,
  ]);

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
            
            // Map back to the short values used by deliveryService state
            const deliveryValueMapping = {
              "Yes, I have my own delivery staff": "yes",
              "No, I need freelance delivery support": "no",
              "Only in-store service": "instore"
            };
            
            const shortValue = deliveryValueMapping[parsedData.delivery_option];
            if (shortValue) {
              setDeliveryService(shortValue);
            }
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
    setShowErrors(true);

    if (!validateForm()) {
      // Scroll to first error or show alert
      const firstError = Object.values(errors)[0];
      if (firstError) {
        alert(`Please fix the following error: ${firstError}`);
      }
      return;
    }

    // Format and save all operating details
    const formattedOpening = `${openingHour} ${openingMeridian}`;
    const formattedClosing = `${closingHour} ${closingMeridian}`;

    // Create proper mapping for delivery options
    const deliveryMapping = {
      yes: deliveryOptions[0],  // "Yes, I have my own delivery staff"
      no: deliveryOptions[1],   // "No, I need freelance delivery support"
      instore: deliveryOptions[2] // "Only in-store service"
    };

    const serviceOpDetails = {
      working_days: selectedDays,
      opening_hours: `${formattedOpening} - ${formattedClosing}`,
      delivery_option: deliveryMapping[deliveryService],
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
            {showErrors && errors.workingDays && (
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
            {showErrors && errors.hours && (
              <div style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                {errors.hours}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "30px",
              gap: "20px",
              justifyContent: "space-between",
            }}
          >
            {/* Service Area Section */}
            <div className="section two-columns">
              <div className="form-group">
                <label>Service Area Coverage</label>
                <div className="delivery-radio-options">
                  <div
                    className={`delivery-radio-item ${
                      selectedServiceArea === 0 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedServiceArea(0)}
                  >
                    <input
                      type="radio"
                      name="serviceArea"
                      value="0"
                      checked={selectedServiceArea === 0}
                      onChange={(e) =>
                        setSelectedServiceArea(Number.parseInt(e.target.value))
                      }
                    />
                    <span className="radio-indicator">
                      {selectedServiceArea === 0 && (
                        <span className="checkmark">✓</span>
                      )}
                    </span>
                    <span className="radio-text">In-shop Only</span>
                  </div>

                  <div
                    className={`delivery-radio-item ${
                      selectedServiceArea === 1 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedServiceArea(1)}
                  >
                    <input
                      type="radio"
                      name="serviceArea"
                      value="1"
                      checked={selectedServiceArea === 1}
                      onChange={(e) =>
                        setSelectedServiceArea(Number.parseInt(e.target.value))
                      }
                    />
                    <span className="radio-indicator">
                      {selectedServiceArea === 1 ? (
                        <span className="checkmark">✓</span>
                      ) : (
                        <span className="dot"></span>
                      )}
                    </span>
                    <span className="radio-text">Home Service</span>
                  </div>

                  <div
                    className={`delivery-radio-item ${
                      selectedServiceArea === 2 ? "selected" : ""
                    }`}
                    onClick={() => setSelectedServiceArea(2)}
                  >
                    <input
                      type="radio"
                      name="serviceArea"
                      value="2"
                      checked={selectedServiceArea === 2}
                      onChange={(e) =>
                        setSelectedServiceArea(Number.parseInt(e.target.value))
                      }
                    />
                    <span className="radio-indicator">
                      {selectedServiceArea === 2 ? (
                        <span className="checkmark">✓</span>
                      ) : (
                        <span className="dot"></span>
                      )}
                    </span>
                    <span className="radio-text">Both</span>
                  </div>
                </div>
                {showErrors && errors.serviceArea && (
                  <div
                    style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                  >
                    {errors.serviceArea}
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Service Section */}
            <div className="section two-columns">
              <div className="form-group">
                <label>Do you provide delivery services?</label>
                <div className="delivery-radio-options">
                  <div
                    className={`delivery-radio-item ${
                      deliveryService === "yes" ? "selected" : ""
                    }`}
                    onClick={() => setDeliveryService("yes")}
                  >
                    <input
                      type="radio"
                      name="deliveryService"
                      value="yes"
                      checked={deliveryService === "yes"}
                      onChange={(e) => setDeliveryService(e.target.value)}
                    />
                    <span className="radio-indicator">
                      {deliveryService === "yes" && (
                        <span className="checkmark">✓</span>
                      )}
                    </span>
                    <span className="radio-text">
                      Yes, I have my own delivery staff
                    </span>
                  </div>

                  <div
                    className={`delivery-radio-item ${
                      deliveryService === "no" ? "selected" : ""
                    }`}
                    onClick={() => setDeliveryService("no")}
                  >
                    <input
                      type="radio"
                      name="deliveryService"
                      value="no"
                      checked={deliveryService === "no"}
                      onChange={(e) => setDeliveryService(e.target.value)}
                    />
                    <span className="radio-indicator">
                      {deliveryService === "no" ? (
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
                      deliveryService === "instore" ? "selected" : ""
                    }`}
                    onClick={() => setDeliveryService("instore")}
                  >
                    <input
                      type="radio"
                      name="deliveryService"
                      value="instore"
                      checked={deliveryService === "instore"}
                      onChange={(e) => setDeliveryService(e.target.value)}
                    />
                    <span className="radio-indicator">
                      {deliveryService === "instore" ? (
                        <span className="checkmark">✓</span>
                      ) : (
                        <span className="dot"></span>
                      )}
                    </span>
                    <span className="radio-text">Only in-store service</span>
                  </div>
                </div>
                {showErrors && errors.deliveryService && (
                  <div
                    style={{ color: "red", fontSize: "14px", marginTop: "5px" }}
                  >
                    {errors.deliveryService}
                  </div>
                )}
              </div>
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