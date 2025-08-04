import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BusinessOperatingDetails.css";

const BusinessOperatingDetails = () => {
  const navigate = useNavigate();

  // For all flows, get previous data — if both/service/product flow, store under compatible key in previous component
  const [prevInfo, setPrevInfo] = useState({});

  useEffect(() => {
    // Try reading each possible previous registration step's data
    const businessInfo = JSON.parse(localStorage.getItem("businessInfo") || "{}");
    const serviceInfo = JSON.parse(localStorage.getItem("serviceInfo") || "{}");
    const bothInfo = JSON.parse(localStorage.getItem("bothInfo") || "{}");

    // Prioritize in order: both, business, service
    setPrevInfo(Object.keys(bothInfo).length ? bothInfo : (Object.keys(businessInfo).length ? businessInfo : serviceInfo));
  }, []);

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
    // Next: BrandingRegistrationform always reads previous data from localStorage!

    navigate("/BrandingRegistrationform");
  };

  return (
    <div className="business-container">
      <div className="left-panel">
        <img src="/Rectangle-two.png" alt="Shop owner" />
        {/* Optional: Preview previous step info
        <pre>{JSON.stringify(prevInfo, null, 2)}</pre>
         */}
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

        <div className="buttons">
          <button className="back" type="button" onClick={() => navigate(-1)}>
            Back
          </button>
          <button
            className="skip"
            type="button"
            onClick={handleNext}
          // Optionally: mark as filled to avoid empty transfer when skipping!
          >
            Skip
          </button>
          <button
            className="next"
            type="button"
            onClick={handleNext}
            disabled={!allFilled}
            style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
          >
            Next <span>&rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessOperatingDetails;
