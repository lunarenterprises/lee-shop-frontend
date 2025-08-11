import React, { useState, useEffect } from "react";
import "./DeliveryContactInformation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProgressSteps from "../ProgressSteps";

const DeliveryContactInformation = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    primary_phone: "",
    secondary_phone: "",
    whatsapp_contact: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);

  // Define progress steps for delivery agent registration
  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("deliveryAgentData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Loading deliveryAgentData from localStorage:", parsedData);
        setForm((prevForm) => ({
          ...prevForm,
          primary_phone: parsedData.mobile || "",
          secondary_phone: parsedData.secondary_mobile || "",
          whatsapp_contact: parsedData.whatsapp_contact || "",
          email: parsedData.email || "",
        }));
      } catch (error) {
        console.error("Error parsing localStorage deliveryAgentData:", error);
        localStorage.removeItem("deliveryAgentData");
      }
    }
  }, []);

  // Generic input handler
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Merge all step data and files and submit to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      // Collect previous step data & files
      const stepData = JSON.parse(
        localStorage.getItem("deliveryAgentData") || "{}"
      );
      const licenceFile = window.deliveryAgentLicenceFile;
      const profileFile = window.deliveryAgentProfileFile;

      // Build FormData for file upload
      const submitData = new FormData();

      // Required API fields
      submitData.append("name", stepData.name || "");
      submitData.append("email", form.email || stepData.email || "");
      submitData.append("mobile", form.primary_phone || stepData.mobile || "");
      submitData.append(
        "secondary_mobile",
        form.secondary_phone || stepData.secondary_mobile || ""
      );
      submitData.append(
        "whatsapp_contact",
        form.whatsapp_contact || stepData.whatsapp_contact || ""
      );
      submitData.append("location", stepData.location || "");
      submitData.append("vehicle_type", stepData.vehicle_type || "");
      submitData.append("work_type", stepData.work_type || "");
      submitData.append("password", form.password);

      // Images
      if (profileFile) submitData.append("profile", profileFile);
      if (licenceFile) submitData.append("licence", licenceFile);

      // Post to your API
      const res = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/deliverystaff/register/delivery_staffs",
        submitData
      );

      setLoading(false);
      if (res.data && res.data.result) {
        alert("Registration successful!");
        // cleanup temp state
        localStorage.removeItem("deliveryAgentData");
        window.deliveryAgentProfileFile = null;
        window.deliveryAgentLicenceFile = null;
        navigate("/ShopProfileLayout");
      } else {
        alert(res.data?.message || "Registration failed.");
      }
    } catch (error) {
      setLoading(false);
      alert("Registration failed. Please try again.");
    }
  };

  const handleBack = () => navigate(-1);

  const handleSkip = () => {
    navigate("/ShopProfileLayout");
  };

  // Check if required fields are filled
  const requiredFields = [
    form.primary_phone,
    form.email,
    form.password,
    form.confirm_password,
  ];
  const allFilled = requiredFields.every(
    (f) => !!f && f.toString().trim() !== ""
  );

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img
          src="/Deliveryimage21.png"
          alt="Contact Information Illustration"
        />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps
          title={"Delivery Agent Registration."}
          progressSteps={progressSteps}
        />

        {/* Form Content */}
        <div className="form-content3">
          <h2 className="section-title">▶ Contact Information</h2>

          <form onSubmit={handleSubmit}>
            <div className="section">
              <label className="form-label">
                Primary Contact Number*
                <div className="input-group">
                  <span className="country-code">🇮🇳 +91</span>
                  <input
                    type="tel"
                    name="primary_phone"
                    className="form-input"
                    value={form.primary_phone}
                    onChange={handleChange}
                    placeholder="Enter number"
                    required
                  />
                </div>
              </label>
            </div>

            <div className="section">
              <label className="form-label">
                Alternate Contact Number
                <div className="input-group">
                  <span className="country-code">🇮🇳 +91</span>
                  <input
                    type="tel"
                    name="secondary_phone"
                    className="form-input"
                    value={form.secondary_phone}
                    onChange={handleChange}
                    placeholder="Enter number"
                  />
                </div>
              </label>
            </div>

            <div className="section">
              <label className="form-label">
                WhatsApp Number
                <div className="input-group">
                  <span className="country-code">🇮🇳 +91</span>
                  <input
                    type="tel"
                    name="whatsapp_contact"
                    className="form-input"
                    value={form.whatsapp_contact}
                    onChange={handleChange}
                    placeholder="Enter number"
                  />
                </div>
              </label>
            </div>

            <div className="section">
              <label className="form-label">
                Email Address*
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </label>
            </div>

            <div className="section">
              <label className="form-label">
                Enter Password*
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </label>
            </div>

            <div className="section">
              <label className="form-label">
                Confirm Password*
                <input
                  type="password"
                  name="confirm_password"
                  className="form-input"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </label>
            </div>
          </form>
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
              onClick={handleSubmit}
              disabled={!allFilled || loading}
              style={{
                opacity: allFilled && !loading ? 1 : 0.5,
                cursor: allFilled && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Submitting..." : "Submit →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryContactInformation;
