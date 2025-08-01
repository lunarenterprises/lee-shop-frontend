import React, { useState, useEffect } from "react";
import "./ContactInfoForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ContactInfoForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    service_or_shop: "",
    shop_name: "",
    owner_name: "",
    shop_address: "",
    state: "",
    city: "",
    working_days: [],
    description: "",
    primary_phone: "",
    secondary_phone: "",
    whatsapp_number: "",
    email: "",
    password: "",
    product_and_service: [],
    opening_hours: "",
    location: "",
    delivery_option: "",
    category_id: "",
    latitude: "",
    longitude: "",
    category_name: "",
    image: [],
  });

  useEffect(() => {
    const businessType = localStorage.getItem("businessType");
    const businessInfo = JSON.parse(
      localStorage.getItem("businessInfo") || "{}"
    );
    const operatingDetails = JSON.parse(
      localStorage.getItem("operatingDetails") || "{}"
    );
    const brandingImageMeta = JSON.parse(
      localStorage.getItem("brandingImageMeta") || "[]"
    );
    const brandingDetails = JSON.parse(
      localStorage.getItem("brandingDetails") || "{}"
    );

    setFormData({
      service_or_shop: businessType,
      shop_name: businessInfo.shop_name,
      owner_name: businessInfo.owner_name,
      shop_address: businessInfo.address,
      state: businessInfo.state,
      city: businessInfo.city,
      working_days: operatingDetails.working_days,
      description: brandingDetails.description,
      primary_phone: "",
      secondary_phone: "",
      whatsapp_number: "",
      email: "",
      password: "",
      product_and_service: ["egg", "milk"],
      opening_hours: operatingDetails.opening_hours,
      location: "kerala",
      delivery_option: operatingDetails.delivery_option,
      category_id: 2,
      latitude: 1.222222,
      longitude: 2.22222,
      category_name: businessInfo.category,
      image: brandingImageMeta,
    });

    // const serviceDetails =
    //   JSON.parse(localStorage.getItem("serviceDetails")) || {};
    // const brandingDetails =
    //   JSON.parse(localStorage.getItem("brandingDetails")) || {};
    // const operatingDetails =
    //   JSON.parse(localStorage.getItem("bothOperatingDetails")) ||
    //   JSON.parse(localStorage.getItem("operatingDetails")) ||
    //   {};

    // setFormData((prev) => ({
    //   ...prev,
    //   ...serviceDetails,
    //   ...brandingDetails,
    //   ...operatingDetails,
    // }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      const submitData = new FormData();

      for (const key in formData) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((item) => {
            submitData.append(`${key}`, item);
          });
        } else if (key === "image") {
          const imageInput = document.getElementById("realImageUploadInput");
          if (imageInput && imageInput.files.length > 0) {
            Array.from(imageInput.files).forEach((file) => {
              submitData.append("image", file);
            });
          }
        } else if (key === "working_days") {
          submitData.append("working_days", formData.working_days);
        } else if (key === "product_and_service") {
          submitData.append(
            "product_and_service",
            formData.product_and_service
          );
        } else {
          submitData.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/shop",
        submitData
      );

      console.log("Success:", response.data);
      alert("Registration successful!");
      navigate("/ShopProfileLayout");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <div className="left-panel">
        <img
          src="/Rectangle-three.png"
          alt="Shop Owner"
          className="form-image"
        />
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
              value={formData.primary_phone}
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
              value={formData.secondary_phone}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          <label>WhatsApp Number</label>
          <div className="phone-input">
            <span className="country-code">🇮🇳 +91</span>
            <input
              type="tel"
              name="whatsapp_number"
              value={formData.whatsapp_number}
              onChange={handleChange}
              placeholder="Enter number"
            />
          </div>

          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />

          <label>Enter Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter a password"
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            value={formData.confirm_password || ""}
            onChange={handleChange}
            placeholder="Enter a password"
          />

          <label>Upload Images</label>
          <input
            type="file"
            id="realImageUploadInput"
            multiple
            accept="image/*"
          />

          <div className="button-group">
            <button
              type="button"
              className="btn back"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
            <button
              type="button"
              className="btn skip"
              onClick={() => navigate("/ShopProfileLayout")}
            >
              Skip
            </button>
            <button type="submit" className="btn next">
              Submit ➜
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoForm;
