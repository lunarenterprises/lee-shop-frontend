import React, { useState, useEffect } from "react";
import "./ContactInfoForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ContactInfoForm = () => {
  const navigate = useNavigate();

  // Final contact input step
  const [contact, setContact] = useState({
    primary_phone: "",
    secondary_phone: "",
    whatsapp_number: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [merged, setMerged] = useState(null);

  useEffect(() => {
    // Retrieve all prior data:
    const businessType = localStorage.getItem("businessType");
    const businessInfo = JSON.parse(localStorage.getItem("businessInfo") || "{}");
    const operatingDetails = JSON.parse(localStorage.getItem("operatingDetails") || "{}");
    const brandingDetails = JSON.parse(localStorage.getItem("brandingDetails") || "{}");
    const brandingImageFiles = window.brandingImageFiles || []; // Array of File objects

    setMerged({
      service_or_shop: businessType === "product-seller" ? "shop" :
        businessType === "service-provider" ? "service" : "both",
      shop_name: businessInfo.shop_name,
      owner_name: businessInfo.owner_name,
      shop_address: businessInfo.address,
      state: businessInfo.state,
      city: businessInfo.city,
      working_days: operatingDetails.working_days || [],
      description: brandingDetails.description,
      product_and_service: brandingDetails.services || [],
      opening_hours: operatingDetails.opening_hours,
      location: businessInfo.location || "",
      delivery_option: operatingDetails.delivery_option,
      category_id: businessInfo.category_id || 4,
      latitude: businessInfo.latitude || 12.9352,
      longitude: businessInfo.longitude || 77.6245,
      category_name: businessInfo.category || "grocery",
      image: brandingImageFiles, // Array of File objects
    });
  }, []);

  // Handle UI input
  const handleChange = (e) =>
    setContact((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!merged) { alert("Loading previous data..."); return; }

    // Validate user fields
    for (const key of [
      "primary_phone", "secondary_phone", "whatsapp_number", "email", "password", "confirm_password"
    ]) {
      if (!contact[key]) {
        alert(`Please fill in ${key.replace("_", " ")}!`);
        return;
      }
    }
    if (contact.password !== contact.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    // Compose all API fields
    const data = {
      ...merged,
      primary_phone: contact.primary_phone,
      secondary_phone: contact.secondary_phone,
      whatsapp_number: contact.whatsapp_number,
      email: contact.email,
      password: contact.password,
    };

    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "image" && Array.isArray(data.image)) {
        // send all images as 'image' fields
        data.image.forEach(file => formData.append("image", file));
      } else if (Array.isArray(data[key])) {
        // Join array fields as expected by API
        formData.append(key, data[key].join(","));
      } else {
        formData.append(key, data[key]);
      }
    });

    // DEBUG: Show all form data entries (text and image)
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`FormData: ${key}: FILE ${value.name} (type: ${value.type}, size: ${value.size})`);
      } else {
        console.log(`FormData: ${key}:`, value);
      }
    }

    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/shop",
        formData
      );
      setLoading(false);
      if (response.data && response.data.result) {
        alert("Registration successful!");
        localStorage.clear();
        window.brandingImageFiles = null;
        navigate("/ShopProfileLayout");
      } else {
        alert(response.data?.message || "Registration failed.");
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
              value={contact.primary_phone}
              onChange={handleChange}
              required
              placeholder="Enter number"
            />
          </div>
          <label>Alternate Contact Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="secondary_phone"
              value={contact.secondary_phone}
              onChange={handleChange}
              required
              placeholder="Enter number"
            />
          </div>
          <label>WhatsApp Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="whatsapp_number"
              value={contact.whatsapp_number}
              onChange={handleChange}
              required
              placeholder="Enter number"
            />
          </div>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={contact.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          <label>Enter Password</label>
          <input
            type="password"
            name="password"
            value={contact.password}
            onChange={handleChange}
            required
            placeholder="Enter password"
          />
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            value={contact.confirm_password}
            onChange={handleChange}
            required
            placeholder="Confirm password"
          />
          {/* Images already collected in previous step */}
          <div className="button-group">
            <button type="button" className="btn back" onClick={() => navigate(-1)}>Back</button>
            <button
              type="submit"
              className="btn next"
              disabled={loading}
            >
              {loading ? "Submitting..." : <>Submit ➜</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoForm;
