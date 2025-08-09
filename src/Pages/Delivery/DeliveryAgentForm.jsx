import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAgentForm.css";
import { ChevronRight, MapPin } from "lucide-react";

const DeliveryAgentForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    whatsapp_contact: "",
    secondary_mobile: "",
    location: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Fields that are required (adjust keys if needed)
  const requiredFields = [
    form.name,
    form.email,
    form.mobile,
    form.whatsapp_contact,
    form.secondary_mobile,
    form.location
  ];
  const allFilled = requiredFields.every(f => !!f && f.toString().trim() !== "");

  const handleNext = () => {
    // Save data for next steps
    const saved = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
    localStorage.setItem("deliveryAgentData", JSON.stringify({ ...saved, ...form }));
    navigate("/DeliveryDetails");
  };

  return (
    <div className="form-container">
      <div className="left-panel2">
        <img
          src="/DeliveryImage.png"
          alt="Delivery Agent Illustration"
        />
      </div>
      <div className="right-panel_2">
        {/* ...progress, section-title... */}
        <form className="form-fields" onSubmit={e => e.preventDefault()}>
          <label>
            Full Name*
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your Name."
              required
            />
          </label>
          <label>
            Email Address*
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mobile Number*
            <div className="input-group">
              <span className="country-code">+91</span>
              <input
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                required
                placeholder="Mobile Number"
              />
            </div>
          </label>
          <label>
            WhatsApp Number*
            <input
              name="whatsapp_contact"
              type="tel"
              value={form.whatsapp_contact}
              onChange={handleChange}
              required
              placeholder="WhatsApp Number"
            />
          </label>
          <label>
            Alternate Number*
            <input
              name="secondary_mobile"
              type="tel"
              value={form.secondary_mobile}
              onChange={handleChange}
              required
              placeholder="Alternate Number"
            />
          </label>
          <label>
            Location*
            <div className="input-group">
              <MapPin size={18} />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="Enter your Location"
              />
            </div>
          </label>
          <div className="form-buttons">
            <button
              type="button"
              className="next-btn"
              onClick={handleNext}
              disabled={!allFilled}
              style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryAgentForm;
