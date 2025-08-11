import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAgentForm.css";
import { MapPin } from "lucide-react";
import ProgressSteps from "../ProgressSteps";

const DeliveryAgentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp_contact: "",
    secondary_mobile: "",
    location: "",
  });

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: true, active: true },
    { id: 2, completed: false, active: false },
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
        setForm((prevForm) => ({ ...prevForm, ...parsedData }));
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Fields that are required - removed secondary_mobile as it's not in the design
  const requiredFields = [
    form.name,
    form.email,
    form.mobile,
    form.whatsapp_contact,
    form.location,
  ];
  const allFilled = requiredFields.every(
    (f) => !!f && f.toString().trim() !== ""
  );

  const handleNext = () => {
    // Save data for next steps
    const saved = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
    localStorage.setItem(
      "deliveryAgentData",
      JSON.stringify({ ...saved, ...form })
    );
    console.log(
      "Storing deliveryAgentData:",
      JSON.stringify({ ...saved, ...form })
    );
    navigate("/DeliveryDetails");
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/DeliveryDetails");
  };

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/DeliveryImage.png" alt="Delivery Agent Illustration" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content3">
          <h2 className="section-title">▶ Personal Information</h2>

          <div className="section">
            <label className="form-label">
              Full Name*
              <input
                name="name"
                className="form-input"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your Name"
                required
              />
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              Mobile Number*
              <div className="input-group">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  name="mobile"
                  type="tel"
                  className="form-input"
                  value={form.mobile}
                  onChange={handleChange}
                  required
                  placeholder=""
                />
              </div>
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              What's app Number*
              <input
                name="whatsapp_contact"
                type="tel"
                className="form-input"
                value={form.whatsapp_contact}
                onChange={handleChange}
                required
                placeholder=""
              />
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              Email Address*
              <input
                name="email"
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                required
              />
            </label>
          </div>

          <div className="section">
            <label className="form-label">
              Choose your Location*
              <div className="input-group">
                <MapPin
                  size={18}
                  className="input-icon"
                  style={{ color: "#666" }}
                />
                <select
                  name="location"
                  className="form-input"
                  value={form.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Enter your Location</option>
                  <option value="Autraval">Autraval</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
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

export default DeliveryAgentForm;
