import { useState, useEffect } from "react";
import "./EditShopModal.css";

// Utility: fetch image URL -> File object
async function urlToFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}

const EditShopModal = ({ isOpen, onClose, shopData, onSave }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  console.log({ shopData }, "shopdata");

  // Helper function to clean and format phone numbers (for initial load and final save)
  const cleanPhoneNumber = (phone) => {
    if (!phone) return "";

    // Convert to string and extract only digits
    let digitsOnly = String(phone).replace(/\D/g, "");

    // If it starts with 91, remove it (country code)
    if (digitsOnly.startsWith("91") && digitsOnly.length > 10) {
      digitsOnly = digitsOnly.substring(2);
    }

    // Ensure it's exactly 10 digits (Indian mobile number)
    if (digitsOnly.length > 10) {
      digitsOnly = digitsOnly.substring(digitsOnly.length - 10);
    }

    // Only return if we have a valid 10-digit number
    if (digitsOnly.length === 10 && digitsOnly.match(/^[6-9]/)) {
      return `+91${digitsOnly}`;
    }

    // If less than 10 digits, return as is with +91 for display
    if (digitsOnly.length > 0) {
      return `+91${digitsOnly}`;
    }

    return "";
  };

  // Helper function for formatting during editing (less aggressive)
  const formatPhoneForEditing = (phone) => {
    if (!phone) return "";

    // Just remove obvious duplicates but allow free editing
    let cleaned = String(phone);

    // Remove multiple consecutive +91 prefixes
    while (cleaned.includes("+91+91")) {
      cleaned = cleaned.replace("+91+91", "+91");
    }

    return cleaned;
  };

  // Helper function to parse working hours
  const parseWorkingHours = (openingHours) => {
    if (!openingHours) {
      return {
        openingTime: "",
        openingPeriod: "AM",
        closingTime: "",
        closingPeriod: "PM",
      };
    }

    // remove "Open Daily:" or any prefix
    const cleaned = openingHours.replace(/Open\s+Daily:\s*/i, "").trim();

    // Match formats like "08:00 to 10:00 PM" or "08:00 AM to 10:00 PM"
    const timeMatch = cleaned.match(
      /(\d{1,2}:\d{2})(?:\s*(AM|PM))?\s*to\s*(\d{1,2}:\d{2})\s*(AM|PM)/i
    );

    if (timeMatch) {
      return {
        openingTime: timeMatch[1],
        openingPeriod: timeMatch[2] || "AM", // default to AM if missing
        closingTime: timeMatch[3],
        closingPeriod: timeMatch[4],
      };
    }

    return {
      openingTime: "",
      openingPeriod: "AM",
      closingTime: "",
      closingPeriod: "PM",
    };
  };

  // Helper function to parse working days
  const parseWorkingDays = (workingDaysStr) => {
    if (!workingDaysStr) return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // If it's already an array, return it directly
    if (Array.isArray(workingDaysStr)) {
      return workingDaysStr;
    }

    // If it's not a string, convert to string first
    if (typeof workingDaysStr !== "string") {
      workingDaysStr = String(workingDaysStr);
    }

    try {
      const parsed = JSON.parse(workingDaysStr);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // Now we know workingDaysStr is definitely a string
      const cleanStr = workingDaysStr.replace(/[\[\]]/g, "");
      const fullDays = cleanStr.split(" ").filter((day) => day.trim());

      const dayMap = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
      };

      return fullDays.map((day) => dayMap[day] || day).filter(Boolean);
    }

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  };

  // Helper function to parse location into address components
  const parseLocation = (address, location) => {
    const fullAddress = address || "";
    const locationParts = location ? location.split(", ") : [];

    return {
      shopAddress: fullAddress,
      city: locationParts[1] || "",
      state: locationParts[2] || "",
    };
  };

  // Helper function to initialize gallery images
  const initializeGalleryImages = async (previousImages) => {
    if (!previousImages || !Array.isArray(previousImages)) return [];

    const previews = await Promise.all(
      previousImages.map(async (img, index) => {
        const url = img.url;
        const file = await urlToFile(url, `image_${img.id}_${index}.jpg`);

        return {
          id: img.id, // or img.id depending on your API
          url: url,
          file,
          isNew: false,
        };
      })
    );

    return previews;
  };

  const workingHours = parseWorkingHours(shopData?.openingHours);
  const workingDays = parseWorkingDays(shopData?.workingDays);
  const locationInfo = parseLocation(shopData?.address, shopData?.location);

  const [formData, setFormData] = useState({
    shopId: shopData?.shopId,
    businessType: "Product Seller",
    shopName: shopData?.name,
    ownerName: shopData?.owner,
    selectedCategory: shopData?.category || "Grocery",
    shopAddress: locationInfo.shopAddress,
    state: locationInfo.state,
    city: locationInfo.city,
    workingDays: workingDays,
    openingTime: workingHours.openingTime,
    openingPeriod: workingHours.openingPeriod,
    closingTime: workingHours.closingTime,
    closingPeriod: workingHours.closingPeriod,
    deliveryType: shopData?.deliveryAvailable ? "own" : "instore",
    primaryPhone: cleanPhoneNumber(shopData?.phone),
    whatsappNumber: cleanPhoneNumber(shopData?.whatsapp || shopData?.phone),
    phoneNumbers: [
      cleanPhoneNumber(shopData?.phone),
      cleanPhoneNumber(shopData?.whatsapp),
      "",
      "",
    ],
    description: shopData?.description,
    email: shopData?.email,
  });

  // Separate state for gallery images to track new vs existing - initialize with empty array
  const [imagePreviews, setImagePreviews] = useState([]);

  // Use useEffect to load initial images asynchronously
  useEffect(() => {
    const loadInitialImages = async () => {
      if (shopData?.previousImages) {
        try {
          const initialImages = await initializeGalleryImages(shopData.previousImages);
          setImagePreviews(initialImages);
        } catch (error) {
          console.error("Error loading initial images:", error);
          setImagePreviews([]);
        }
      }
    };

    loadInitialImages();
  }, [shopData?.previousImages]);

  console.log({ imagePreviews }, "image previews");

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

  // Validation functions
  const validatePhoneNumber = (phone) => {
    if (!phone) return false;
    const cleaned = cleanPhoneNumber(phone);
    const phoneRegex = /^(\+91\s?)?[6-9]\d{9}$/;
    return phoneRegex.test(cleaned.replace(/\s/g, ""));
  };

  const validateField = (field, value) => {
    const errors = {};

    switch (field) {
      case "shopName":
        if (!value || value.trim().length < 2) {
          errors.shopName =
            "Shop name is required and must be at least 2 characters";
        }
        break;
      case "ownerName":
        if (!value || value.trim().length < 2) {
          errors.ownerName =
            "Owner name is required and must be at least 2 characters";
        }
        break;
      case "shopAddress":
        if (!value || value.trim().length < 10) {
          errors.shopAddress =
            "Shop address is required and must be at least 10 characters";
        }
        break;
      case "state":
        if (!value || value.trim().length < 2) {
          errors.state = "State is required";
        }
        break;
      case "city":
        if (!value || value.trim().length < 2) {
          errors.city = "City is required";
        }
        break;
      case "primaryPhone":
        if (!value || !validatePhoneNumber(value)) {
          errors.primaryPhone = "Please enter a valid Indian phone number";
        }
        break;
      case "whatsappNumber":
        if (!value || !validatePhoneNumber(value)) {
          errors.whatsappNumber = "Please enter a valid Indian phone number";
        }
        break;
      case "workingDays":
        if (!value || value.length === 0) {
          errors.workingDays = "Please select at least one working day";
        }
        break;
      case "time":
        const openingHour = parseInt(formData.openingTime.split(":")[0]);
        const closingHour = parseInt(formData.closingTime.split(":")[0]);
        const openingIs12 = openingHour === 12;
        const closingIs12 = closingHour === 12;

        let opening24 = openingHour;
        let closing24 = closingHour;

        if (formData.openingPeriod === "PM" && !openingIs12) opening24 += 12;
        if (formData.openingPeriod === "AM" && openingIs12) opening24 = 0;
        if (formData.closingPeriod === "PM" && !closingIs12) closing24 += 12;
        if (formData.closingPeriod === "AM" && closingIs12) closing24 = 0;

        if (opening24 >= closing24) {
          errors.time = "Closing time must be after opening time";
        }
        break;
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {
      ...validateField("shopName", formData.shopName),
      ...validateField("ownerName", formData.ownerName),
      ...validateField("shopAddress", formData.shopAddress),
      ...validateField("state", formData.state),
      ...validateField("city", formData.city),
      ...validateField("primaryPhone", formData.primaryPhone),
      ...validateField("whatsappNumber", formData.whatsappNumber),
      ...validateField("workingDays", formData.workingDays),
      ...validateField("time", null),
    };

    if (!formData.selectedCategory) {
      errors.selectedCategory = "Please select a business category";
    }

    return errors;
  };

  const handleInputChange = (field, value) => {
    // Special handling for phone number fields - less aggressive during editing
    if (field === "primaryPhone" || field === "whatsappNumber") {
      value = formatPhoneForEditing(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    const fieldErrors = validateField(field, value);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));
    }
  };

  // Handle phone number blur (when user finishes editing)
  const handlePhoneBlur = (field) => {
    const cleanedValue = cleanPhoneNumber(formData[field]);
    if (cleanedValue !== formData[field]) {
      setFormData((prev) => ({
        ...prev,
        [field]: cleanedValue,
      }));
    }
  };

  const selectCategory = (category) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategory: category,
    }));

    if (validationErrors.selectedCategory) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.selectedCategory;
        return newErrors;
      });
    }
  };

  const toggleWorkingDay = (day) => {
    const newWorkingDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter((d) => d !== day)
      : [...formData.workingDays, day];

    setFormData((prev) => ({
      ...prev,
      workingDays: newWorkingDays,
    }));

    const fieldErrors = validateField("workingDays", newWorkingDays);
    if (Object.keys(fieldErrors).length > 0) {
      setValidationErrors((prev) => ({
        ...prev,
        ...fieldErrors,
      }));
    } else if (validationErrors.workingDays) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.workingDays;
        return newErrors;
      });
    }
  };

  const updatePhoneNumber = (index, value) => {
    const cleanedValue = cleanPhoneNumber(value);
    setFormData((prev) => ({
      ...prev,
      phoneNumbers: prev.phoneNumbers.map((phone, i) =>
        i === index ? cleanedValue : phone
      ),
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);

    const newImages = files.map((file, index) => ({
      id: `new_${Date.now()}_${index}`,
      url: URL.createObjectURL(file),
      isNew: true,
      file: file,
    }));

    setImagePreviews((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);

      if (errors.shopName || errors.ownerName || errors.selectedCategory) {
        setActiveTab("basic");
      } else if (
        errors.shopAddress ||
        errors.state ||
        errors.city ||
        errors.workingDays ||
        errors.time
      ) {
        setActiveTab("location");
      } else if (errors.primaryPhone || errors.whatsappNumber) {
        setActiveTab("delivery");
      }

      return;
    }

    // Prepare FormData for backend
    const formDataToSend = new FormData();

    if (formData.shopId) {
      formDataToSend.append("sh_id", formData.shopId);
    }
    formDataToSend.append(
      "sh_shop_or_service",
      formData.businessType || "Product Seller"
    );
    formDataToSend.append("sh_name", formData.shopName);
    formDataToSend.append("sh_owner_name", formData.ownerName);
    formDataToSend.append("sh_category_name", formData.selectedCategory);
    formDataToSend.append("sh_address", formData.shopAddress);
    formDataToSend.append("sh_state", formData.state);
    formDataToSend.append("sh_city", formData.city);
    formDataToSend.append("sh_location", formData.location || ""); // keep separate

    formDataToSend.append(
      "sh_primary_phone",
      cleanPhoneNumber(formData.primaryPhone) || ""
    );
    formDataToSend.append(
      "sh_secondary_phone",
      cleanPhoneNumber(formData.phoneNumbers?.[2]) || ""
    );
    formDataToSend.append(
      "sh_whatsapp_number",
      cleanPhoneNumber(formData.whatsappNumber) || ""
    );
    formDataToSend.append("sh_email", formData.email || "");
    formDataToSend.append("sh_description", formData.description || "");
    formDataToSend.append(
      "sh_delivery_option",
      formData.deliveryType !== "instore"
        ? "Delivery Available"
        : "Instore Only"
    );
    formDataToSend.append(
      "sh_service_area_coverage",
      formData.serviceAreaCoverage || ""
    );
    // Working Days
    formDataToSend.append(
      "sh_working_days",
      `[${formData.workingDays
        .map((day) => {
          const dayMap = {
            Mon: "Monday",
            Tue: "Tuesday",
            Wed: "Wednesday",
            Thu: "Thursday",
            Fri: "Friday",
            Sat: "Saturday",
            Sun: "Sunday",
          };
          return dayMap[day];
        })
        .join(" ")}]`
    );

    // Opening Hours
    formDataToSend.append(
      "sh_opening_hours",
      `Open Daily: ${formData.openingTime} ${formData.openingPeriod} to ${formData.closingTime} ${formData.closingPeriod}`
    );

    // Handle images
    imagePreviews.forEach((img) => {
      if (img.isNew && img.file instanceof File) {
        formDataToSend.append("image", img.file);
      } else if (img.id && img.file instanceof File) {
        formDataToSend.append(`${img.id}`, img.file); // e.g. "23": file
      }
    });

    // Local updatedShopData (frontend state shape preserved)
    const updatedShopData = {
      ...shopData,
      shopId: formData.shopId,
      businessType: formData.businessType,
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      selectedCategory: formData.selectedCategory,
      shopAddress: formData.shopAddress,
      state: formData.state,
      city: formData.city,
      location: formData.location || "",
      workingDays: formData.workingDays,
      openingTime: formData.openingTime,
      openingPeriod: formData.openingPeriod,
      closingTime: formData.closingTime,
      closingPeriod: formData.closingPeriod,
      deliveryType: formData.deliveryType,
      primaryPhone: cleanPhoneNumber(formData.primaryPhone),
      whatsappNumber: cleanPhoneNumber(formData.whatsappNumber),
      phoneNumbers: formData.phoneNumbers.map((phone) =>
        cleanPhoneNumber(phone)
      ),
      description: formData.description,
      email: formData.email,
      images: imagePreviews,
    };

    onSave(updatedShopData, formDataToSend);
    onClose();
  };

  const handleTimeChange = (field, value) => {
    handleInputChange(field, value);

    setTimeout(() => {
      const timeErrors = validateField("time", null);
      if (Object.keys(timeErrors).length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          ...timeErrors,
        }));
      } else if (validationErrors.time) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.time;
          return newErrors;
        });
      }
    }, 100);
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
            {(validationErrors.shopName ||
              validationErrors.ownerName ||
              validationErrors.selectedCategory) && (
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            )}
          </button>
          <button
            className={`tab-button ${activeTab === "location" ? "active" : ""}`}
            onClick={() => setActiveTab("location")}
          >
            Location & Working Hours
            {(validationErrors.shopAddress ||
              validationErrors.state ||
              validationErrors.city ||
              validationErrors.workingDays ||
              validationErrors.time) && (
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            )}
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
            {(validationErrors.primaryPhone ||
              validationErrors.whatsappNumber) && (
              <span style={{ color: "red", marginLeft: "4px" }}>*</span>
            )}
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
                    className={`form-input ${
                      validationErrors.shopName ? "error" : ""
                    }`}
                    placeholder="Enter shop name"
                  />
                  {validationErrors.shopName && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.shopName}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>Owner Name</label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) =>
                      handleInputChange("ownerName", e.target.value)
                    }
                    className={`form-input ${
                      validationErrors.ownerName ? "error" : ""
                    }`}
                    placeholder="Enter owner name"
                  />
                  {validationErrors.ownerName && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.ownerName}
                    </div>
                  )}
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
                        formData.selectedCategory === category ? "selected" : ""
                      }`}
                      onClick={() => selectCategory(category)}
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
                {validationErrors.selectedCategory && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {validationErrors.selectedCategory}
                  </div>
                )}
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
                  className={`form-textarea ${
                    validationErrors.shopAddress ? "error" : ""
                  }`}
                  placeholder="Enter your Shop Address"
                  rows="3"
                />
                {validationErrors.shopAddress && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {validationErrors.shopAddress}
                  </div>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className={`form-input ${
                      validationErrors.state ? "error" : ""
                    }`}
                    placeholder="Enter your State"
                  />
                  {validationErrors.state && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.state}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className={`form-input ${
                      validationErrors.city ? "error" : ""
                    }`}
                    placeholder="Enter your City"
                  />
                  {validationErrors.city && (
                    <div
                      style={{
                        color: "red",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {validationErrors.city}
                    </div>
                  )}
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
                {validationErrors.workingDays && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {validationErrors.workingDays}
                  </div>
                )}
              </div>

              {/* Opening & Closing Hours */}
              <div className="form-group">
                <label
                  style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "8px",
                    display: "block",
                    maxWidth: "200px",
                  }}
                >
                  Opening & Closing Hours
                </label>

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
                    maxWidth: "400px",
                  }}
                >
                  <span>Opening</span>
                  <span>-</span>
                  <span>Closing</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "10px",
                    maxWidth: "400px",
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
                      value={formData.openingTime}
                      onChange={(e) =>
                        handleTimeChange("openingTime", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#F2F2F2",
                      }}
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
                        handleTimeChange("openingPeriod", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        border: "none",
                        backgroundColor: "#F2F2F2",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
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
                      value={formData.closingTime}
                      onChange={(e) =>
                        handleTimeChange("closingTime", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: "none",
                        backgroundColor: "#F2F2F2",
                      }}
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
                        handleTimeChange("closingPeriod", e.target.value)
                      }
                      style={{
                        padding: "8px",
                        border: "none",
                        backgroundColor: "#F2F2F2",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>

                {validationErrors.time && (
                  <div
                    style={{ color: "red", fontSize: "12px", marginTop: "4px" }}
                  >
                    {validationErrors.time}
                  </div>
                )}
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
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.89258 30.4584L10.8017 24.7251C11.4465 24.0848 12.2926 23.6869 13.197 23.5987C14.1014 23.5105 15.0084 23.7376 15.7647 24.2413C16.5209 24.7451 17.428 24.9721 18.3323 24.884C19.2367 24.7958 20.0829 24.3979 20.7276 23.7576L24.9022 19.583C26.1017 18.3794 27.6898 17.6412 29.3832 17.5001C31.0766 17.359 32.765 17.8241 34.1472 18.8126L38.5726 22.2347M14.8509 18.2213C15.2415 18.219 15.6278 18.1397 15.9877 17.9881C16.3477 17.8364 16.6742 17.6154 16.9487 17.3376C17.2232 17.0597 17.4403 16.7305 17.5876 16.3688C17.7349 16.007 17.8095 15.6198 17.8072 15.2293C17.8048 14.8387 17.7255 14.4524 17.5739 14.0925C17.4223 13.7325 17.2012 13.406 16.9234 13.1314C16.6455 12.8569 16.3163 12.6398 15.9546 12.4925C15.5929 12.3452 15.2057 12.2707 14.8151 12.273C14.0263 12.2778 13.2717 12.5957 12.7173 13.1568C12.1629 13.7179 11.8541 14.4763 11.8588 15.2651C11.8636 16.0539 12.1815 16.8085 12.7426 17.3629C13.3037 17.9173 14.0621 18.2261 14.8509 18.2213Z"
                          stroke="#0A5C15"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M34.0166 26.875V35.8333"
                          stroke="#0A5C15"
                          strokeWidth="2"
                          strokeMiterlimit="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M38.1248 30.6468L34.6006 27.1226C34.524 27.0457 34.433 26.9846 34.3327 26.943C34.2325 26.9013 34.125 26.8799 34.0165 26.8799C33.908 26.8799 33.8005 26.9013 33.7002 26.943C33.6 26.9846 33.509 27.0457 33.4324 27.1226L29.9082 30.6468"
                          stroke="#0A5C15"
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
                      {imagePreviews.length > 0 &&
                        imagePreviews?.map((image, index) => (
                          <div
                            key={index}
                            className="image-item"
                            style={{ position: "relative" }}
                          >
                            <img
                              src={image.url || "/placeholder.svg"}
                              alt={`Gallery item ${index + 1}`}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <button
                              className="remove-image-btn"
                              onClick={() => removeImage(index)}
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                background: "rgba(255, 0, 0, 0.7)",
                                color: "white",
                                border: "none",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                cursor: "pointer",
                                fontSize: "12px",
                              }}
                            >
                              ×
                            </button>
                            {image.isNew && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "5px",
                                  left: "5px",
                                  background: "rgba(0, 128, 0, 0.8)",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "10px",
                                }}
                              >
                                New
                              </div>
                            )}
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

              {/* Contact Information */}
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
                      onBlur={() => handlePhoneBlur("primaryPhone")}
                      className={`form-input ${
                        validationErrors.primaryPhone ? "error" : ""
                      }`}
                      placeholder="Enter phone number"
                    />
                    {validationErrors.primaryPhone && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {validationErrors.primaryPhone}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Whatsapp Number</label>
                    <input
                      type="tel"
                      value={formData.whatsappNumber}
                      onChange={(e) =>
                        handleInputChange("whatsappNumber", e.target.value)
                      }
                      onBlur={() => handlePhoneBlur("whatsappNumber")}
                      className={`form-input ${
                        validationErrors.whatsappNumber ? "error" : ""
                      }`}
                      placeholder="Enter WhatsApp number"
                    />
                    {validationErrors.whatsappNumber && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "4px",
                        }}
                      >
                        {validationErrors.whatsappNumber}
                      </div>
                    )}
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