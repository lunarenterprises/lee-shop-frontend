"use client";

import { useState } from "react";
import "./EditShopModal.css";

const EditShopModal = ({ isOpen, onClose, shopData, onSave }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [formData, setFormData] = useState({
    businessType: shopData?.sh_category_name || "Product Seller",
    shopName: shopData?.sh_name || shopData?.name || "CakeZone",
    ownerName: shopData?.sh_owner_name || shopData?.owner || "Aurobindo",
    selectedCategories: [
      "Grocery",
      "Bakery",
      "Gifts & Custom Products",
      "Pet Care",
    ],
    shopAddress: "",
    state: "",
    city: "",
    workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    openingTime: "08:00",
    openingPeriod: "AM",
    closingTime: "08:00",
    closingPeriod: "AM",
    deliveryType: "own",
    phoneNumbers: [
      "+91 8934814581",
      "+91 8934814581",
      "+91 8934814581",
      "+91 8934814581",
    ],
    galleryImages: [
      "/cozy-bakery.png",
      "/cake-display.png",
      "/bakery-counter.png",
      "/fresh-bread.png",
      "/pastry-selection.png",
      "/cozy-coffee-nook.png",
    ],
  });

  const businessCategories = [
    "Grocery",
    "Bakery",
    "Gifts & Custom Products",
    "Pet Care",
    "Hardware & Utilities",
    "Fashion Accessories",
    "Stationery & Printing",
    "Beauty",
    "Furniture & Decor",
    "Kitchen",
    "Electronics",
    "Books & Media",
    "Sports & Fitness",
    "Health & Wellness",
    "Automotive",
    "Home & Garden",
    "Toys & Games",
    "Jewelry & Accessories",
  ];

  const categoriesToShow = showAllCategories
    ? businessCategories
    : businessCategories.slice(0, 10);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const timeOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = i === 0 ? 12 : i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter((cat) => cat !== category)
        : [...prev.selectedCategories, category],
    }));
  };

  const toggleWorkingDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const updatePhoneNumber = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) =>
        i === index ? value : phone
      ),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    // Handle image upload logic here
    console.log("Uploading images:", files);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "basic":
        return "Edit Profile - Basic info";
      case "location":
        return "Edit Profile - Location & Working Hours";
      case "gallery":
        return "Edit Profile - Gallery";
      case "delivery":
        return "Edit Profile - Delivery & contact info";
      default:
        return "Edit Profile - Basic info";
    }
  };

  const toggleViewMore = () => {
    setShowAllCategories(!showAllCategories);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="edit-modal">
        <div className="modal-header">
          <div className="header-left">
            <div className="profile-edit-section">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.58312 19.2498L4.58312 2.7498C4.58364 2.58274 4.62971 2.419 4.71638 2.27618C4.80304 2.13336 4.92702 2.01689 5.07495 1.93929C5.22289 1.86169 5.3892 1.8259 5.55596 1.83579C5.72272 1.84567 5.88363 1.90085 6.02137 1.99538L17.938 10.2454C18.4321 10.5873 18.4321 11.4105 17.938 11.7533L6.02137 20.0033C5.88392 20.0988 5.72293 20.1548 5.55589 20.1652C5.38885 20.1756 5.22214 20.1401 5.07389 20.0624C4.92564 19.9847 4.80151 19.8679 4.71498 19.7247C4.62846 19.5814 4.58285 19.4172 4.58312 19.2498Z"
                  fill="#0A5C15"
                />
              </svg>
              <h2>Profile Edit</h2>
            </div>
          </div>
          <div className="header-actions">
            <button className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="modal-tabs">
          <button
            className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </button>
          <button
            className={`tab-button ${activeTab === "location" ? "active" : ""}`}
            onClick={() => setActiveTab("location")}
          >
            Location & Working Hours
          </button>
          <button
            className={`tab-button ${activeTab === "gallery" ? "active" : ""}`}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
          <button
            className={`tab-button ${activeTab === "delivery" ? "active" : ""}`}
            onClick={() => setActiveTab("delivery")}
          >
            Delivery & Contact Info
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-content">
          {activeTab === "basic" && (
            <div className="basic-info-form">
              {/* Business Type */}
              <div className="form-group">
                <label>Business Type</label>
                <select
                  value={formData.businessType}
                  onChange={(e) =>
                    handleInputChange("businessType", e.target.value)
                  }
                  className="form-select"
                >
                  <option value="Product Seller">Product Seller</option>
                  <option value="Service Provider">Service Provider</option>
                  <option value="Both">Both</option>
                </select>
              </div>

              {/* Shop Name and Owner Name */}
              <div className="form-row">
                <div className="form-group">
                  <label>Shop Name</label>
                  <input
                    type="text"
                    value={formData.shopName}
                    onChange={(e) =>
                      handleInputChange("shopName", e.target.value)
                    }
                    className="form-input"
                    placeholder="Enter shop name"
                  />
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
                    }
                    className="form-input"
                    placeholder="Enter owner name"
                  />
                </div>
              </div>

              {/* Business Category */}
              <div className="form-group">
                <label>Business Category</label>
                <div className="category-tags">
                  {categoriesToShow.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={`category-tag ${
                        formData.selectedCategories.includes(category)
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <button
                  className="view-more-btn"
                  type="button"
                  onClick={toggleViewMore}
                >
                  {showAllCategories ? "View less" : "View more"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="location-form">
              {/* Address Fields */}
              <div className="form-group">
                <label>Shop Address</label>
                <textarea
                  value={formData.shopAddress}
                  onChange={(e) =>
                    handleInputChange("shopAddress", e.target.value)
                  }
                  className="form-textarea"
                  placeholder="Enter your Shop Address"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="form-input"
                    placeholder="Enter your State your shop in"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="form-input"
                    placeholder="Enter your State your shop in"
                  />
                </div>
              </div>

              {/* Working Days */}
              <div className="form-group">
                <label>Working Days</label>
                <div className="working-days">
                  {weekDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`day-button ${
                        formData.workingDays.includes(day) ? "selected" : ""
                      }`}
                      onClick={() => toggleWorkingDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Opening & Closing Hours */}
              <div className="form-group">
                <label>Opening & Closing Hours</label>
                <div className="time-selector">
                  <div className="time-section opening">
                    <span className="time-label">Opening</span>
                    <div className="time-inputs">
                      <select
                        value={formData.openingTime}
                        onChange={(e) =>
                          handleInputChange("openingTime", e.target.value)
                        }
                        className="time-select"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.openingPeriod}
                        onChange={(e) =>
                          handleInputChange("openingPeriod", e.target.value)
                        }
                        className="period-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                  <span className="time-separator">-</span>
                  <div className="time-section closing">
                    <span className="time-label">Closing</span>
                    <div className="time-inputs">
                      <select
                        value={formData.closingTime}
                        onChange={(e) =>
                          handleInputChange("closingTime", e.target.value)
                        }
                        className="time-select"
                      >
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.closingPeriod}
                        onChange={(e) =>
                          handleInputChange("closingPeriod", e.target.value)
                        }
                        className="period-select"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "gallery" && (
            <div className="gallery-form">
              <div className="gallery-content">
                {/* Upload Area */}
                <div className="upload-area">
                  <div className="upload-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <p className="upload-text">
                    Drag and drop your images anywhere or
                  </p>
                  <label className="upload-button">
                    Upload a Image
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {/* Existing Images */}
                <div className="existing-images">
                  <div className="images-grid">
                    {formData.galleryImages.map((image, index) => (
                      <div key={index} className="image-item">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "delivery" && (
            <div className="delivery-form">
              {/* Delivery Type */}
              <div className="form-group">
                <label>Delivery Type</label>
                <div className="delivery-options">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="own"
                      checked={formData.deliveryType === "own"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="radio-text">
                      I have my own delivery staff
                    </span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="freelance"
                      checked={formData.deliveryType === "freelance"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="radio-text">
                      I need freelance delivery support
                    </span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="instore"
                      checked={formData.deliveryType === "instore"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="radio-text">Only In-store service</span>
                  </label>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="phone-numbers-section">
                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumbers[0]}
                      onChange={(e) => updatePhoneNumber(0, e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Primary Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumbers[1]}
                      onChange={(e) => updatePhoneNumber(1, e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Primary Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumbers[2]}
                      onChange={(e) => updatePhoneNumber(2, e.target.value)}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Primary Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phoneNumbers[3]}
                      onChange={(e) => updatePhoneNumber(3, e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditShopModal;
