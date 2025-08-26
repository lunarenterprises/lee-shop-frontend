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
    primaryPhone: "+91 8934814581",
    whatsappNumber: "+91 8934814581",
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
            <div
              style={{
                padding: "10px",
                backgroundColor: "#F9F9F9",
                borderRadius: "10px",
                stroke: "#DADADA",
                strokeWidth: "1px",
              }}
            >
              <div className="gallery-form">
                <div className="gallery-content">
                  {/* Upload Area */}
                  <div className="upload-area">
                    <div className="upload-icon">
                      <svg
                        width="44"
                        height="43"
                        viewBox="0 0 44 43"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M38.5726 23.2918V15.2293C38.5726 12.8534 37.6288 10.5748 35.9488 8.89483C34.2687 7.21482 31.9902 6.271 29.6143 6.271H14.3851C12.0092 6.271 9.73061 7.21482 8.05059 8.89483C6.37058 10.5748 5.42676 12.8534 5.42676 15.2293V27.771C5.42676 28.9474 5.65847 30.1123 6.10867 31.1992C6.55887 32.2861 7.21873 33.2736 8.05059 34.1055C9.73061 35.7855 12.0092 36.7293 14.3851 36.7293H25.6009"
                          stroke="#0A5C15"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5.89258 30.4584L10.8017 24.7251C11.4465 24.0848 12.2926 23.6869 13.197 23.5987C14.1014 23.5105 15.0084 23.7376 15.7647 24.2413C16.5209 24.7451 17.428 24.9721 18.3323 24.884C19.2367 24.7958 20.0829 24.3979 20.7276 23.7576L24.9022 19.583C26.1017 18.3794 27.6898 17.6412 29.3832 17.5001C31.0766 17.359 32.765 17.8241 34.1472 18.8126L38.5726 22.2347M14.8509 18.2213C15.2415 18.219 15.6278 18.1397 15.9877 17.9881C16.3477 17.8364 16.6742 17.6154 16.9487 17.3376C17.2232 17.0597 17.4403 16.7305 17.5876 16.3688C17.7349 16.007 17.8095 15.6198 17.8072 15.2293C17.8048 14.8387 17.7255 14.4524 17.5739 14.0925C17.4223 13.7325 17.2012 13.406 16.9234 13.1314C16.6455 12.8569 16.3163 12.6398 15.9546 12.4925C15.5929 12.3452 15.2057 12.2707 14.8151 12.273C14.0263 12.2778 13.2717 12.5957 12.7173 13.1568C12.1629 13.7179 11.8541 14.4763 11.8588 15.2651C11.8636 16.0539 12.1815 16.8085 12.7426 17.3629C13.3037 17.9173 14.0621 18.2261 14.8509 18.2213Z"
                          stroke="#0A5C15"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M34.0166 26.875V35.8333"
                          stroke="#0A5C15"
                          stroke-width="2"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                        />
                        <path
                          d="M38.1248 30.6468L34.6006 27.1226C34.524 27.0457 34.433 26.9846 34.3327 26.943C34.2325 26.9013 34.125 26.8799 34.0165 26.8799C33.908 26.8799 33.8005 26.9013 33.7002 26.943C33.6 26.9846 33.509 27.0457 33.4324 27.1226L29.9082 30.6468"
                          stroke="#0A5C15"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
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
                          <img src={image || "/placeholder.svg"} alt={``} />
                        </div>
                      ))}
                    </div>
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
                  <label className="custom-radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="own"
                      checked={formData.deliveryType === "own"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="custom-radio"></span>
                    <span className="radio-text">
                      I have my own delivery staff
                    </span>
                  </label>
                  <label className="custom-radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="freelance"
                      checked={formData.deliveryType === "freelance"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="custom-radio"></span>
                    <span className="radio-text">
                      I need freelance delivery support
                    </span>
                  </label>
                  <label className="custom-radio-option">
                    <input
                      type="radio"
                      name="deliveryType"
                      value="instore"
                      checked={formData.deliveryType === "instore"}
                      onChange={(e) =>
                        handleInputChange("deliveryType", e.target.value)
                      }
                    />
                    <span className="custom-radio"></span>
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
                      value={formData.primaryPhone}
                      onChange={(e) =>
                        handleInputChange("primaryPhone", e.target.value)
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Whatsapp Number</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
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
