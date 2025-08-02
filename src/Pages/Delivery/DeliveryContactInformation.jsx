import React, { useState } from "react";
import "./DeliveryContactInformation.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveryContactInformation = () => {
  const navigate = useNavigate();
  // Individual input state for final contact step (so user can edit)
  const [form, setForm] = useState({
    primary_phone: "",
    secondary_phone: "",
    whatsapp_contact: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const [loading, setLoading] = useState(false);

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
      const stepData = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
      const licenceFile = window.deliveryAgentLicenceFile;
      const profileFile = window.deliveryAgentProfileFile;

      // Build FormData for file upload
      const submitData = new FormData();

      // Required API fields
      submitData.append("name", stepData.name || "");
      submitData.append("email", form.email || stepData.email || "");
      submitData.append("mobile", form.primary_phone || stepData.mobile || "");
      submitData.append("secondary_mobile", form.secondary_phone || stepData.secondary_mobile || "");
      submitData.append("whatsapp_contact", form.whatsapp_contact || stepData.whatsapp_contact || "");
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

  return (
    <div className="form-container">
      <div className="left-panel">
        <img src="/Rectangle-three.png" alt="Shop Owner" className="form-image" />
      </div>

      <div className="right-panel">
        <div className="progress-indicator">
          <div className="dots">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`dot ${i <= 4 ? "active" : ""}`}></span>
            ))}
          </div>
          <p className="step-title">Business Registration.</p>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h2 className="form-title">Add Contact Information</h2>

          <label>Primary Contact Number*</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="primary_phone"
              value={form.primary_phone}
              onChange={handleChange}
              placeholder="Enter number"
              required
            />
          </div>

          <label>Alternate Contact Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="secondary_phone"
              value={form.secondary_phone}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          <label>WhatsApp Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="whatsapp_contact"
              value={form.whatsapp_contact}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Enter Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            placeholder="Confirm password"
            required
          />

          <div className="button-group">
            <button type="button" className="btn back" onClick={() => navigate(-1)}>
              Back
            </button>
            <button type="button" className="btn skip" onClick={() => navigate("/ShopProfileLayout")}>
              Skip
            </button>
            <button type="submit" className="btn next" disabled={loading}>
              {loading ? "Submitting..." : <>Submit &rarr;</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryContactInformation;
