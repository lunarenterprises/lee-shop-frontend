import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";

const ProfileViewModal = ({ isOpen, onClose, userData }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // All hooks first
  useEffect(() => {
    if (!isOpen || !userData?.id || !userData?.role) return;

    const fetchProfileData = async () => {
      setLoading(true);
      setValidationErrors({}); // Clear validation errors when loading new data
      try {
        let endpoint = "";
        let payload = {};

        // Determine API endpoint and payload based on role
        switch (userData.role.toLowerCase()) {
          case "user":
            endpoint =
              "https://lunarsenterprises.com:6031/leeshop/user/list/user";
            payload = { u_id: userData.id.toString() };
            break;
          case "deliverystaff":
            endpoint =
              "https://lunarsenterprises.com:6031/leeshop/deliverystaff/list/delivery_staffs";
            payload = { u_id: userData.id };
            break;
          case "shop":
            endpoint =
              "https://lunarsenterprises.com:6031/leeshop/shop/list/shop";
            payload = { sh_id: userData.id.toString() };
            break;
          default:
            console.warn("Unknown user role:", userData.role);
            setLoading(false);
            return;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data) {
          let profileInfo = {};

          // Extract profile data based on role
          switch (userData.role.toLowerCase()) {
            case "user":
              const userList = data.list || [];
              if (userList.length > 0) {
                const user = userList[0];
                const userImage = user.u_profile_pic
                  ? `https://lunarsenterprises.com:6031/${user.u_profile_pic}`
                  : "/shop.png";
                profileInfo = {
                  id: user.u_id,
                  name: user.u_name || user.name || "",
                  image: userImage,
                  email: user.u_email || user.email || "",
                  phone: user.u_phone || user.phone || "",
                  location: user.u_address || user.address || "",
                  state: user.state || "",
                  role: "User",
                };
              }
              break;
            case "deliverystaff":
              const staffList = data.list || [];
              const staffImage = staffList[0].u_profile_pic
                ? `https://lunarsenterprises.com:6031/${staffList[0].u_profile_pic}`
                : "/shop.png";
              if (staffList.length > 0) {
                const staff = staffList[0];
                profileInfo = {
                  id: staff.u_id,
                  name: staff.name || staff.u_name || "",
                  image: staffImage,
                  email: staff.u_email || "",
                  phone: staff.phone || "",
                  location: staff.address || staff.location || "",
                  state: staff.state || "",
                  role: "Delivery Staff",
                };
              }
              break;
            case "shop":
              const shopList = data.list || [];
              if (shopList.length > 0) {
                const shop = shopList[0];
                const shopImage = shop.shopimages?.[0]?.si_image
                  ? `https://lunarsenterprises.com:6031/${shop.shopimages[0].si_image}`
                  : "/shop.png";
                profileInfo = {
                  id: shop.sh_id,
                  name: shop.sh_name || shop.name || "",
                  image: shopImage,
                  email: shop.sh_email || shop.email || "",
                  phone:
                    shop.sh_primary_phone || shop.sh_phone || shop.phone || "",
                  location: shop.sh_address || shop.address || "",
                  city: shop.sh_city || "",
                  state: shop.sh_state || shop.state || "",
                  role: "Shop Owner",
                };
              }
              break;
          }

          setProfileData(profileInfo);
        } else {
          console.error("Failed to fetch profile data:", data.message);
          setProfileData(createFallbackProfile(userData));
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setProfileData(createFallbackProfile(userData));
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isOpen, userData?.id, userData?.role]);

  // Helper functions
  const createFallbackProfile = (userData) => {
    return {
      id: userData?.id || userData?.u_id || userData?.sh_id,
      name: userData?.name || userData?.u_name || userData?.sh_name || "",
      image:
        userData?.image ||
        userData?.u_profile_pic ||
        userData?.profile_picture ||
        null,
      email: userData?.email || userData?.u_email || userData?.sh_email || "",
      phone:
        userData?.phone ||
        userData?.u_phone ||
        userData?.sh_phone ||
        userData?.sh_primary_phone ||
        "",
      location:
        userData?.state ||
        userData?.u_address ||
        userData?.sh_address ||
        userData?.sh_city ||
        "",
      city: userData?.sh_city || userData?.city || "",
      state: userData?.state || userData?.sh_state || "",
      role: getRoleDisplay(userData?.role || "user"),
    };
  };

  const getRoleDisplay = (role) => {
    if (!role) return "User";
    const roleMap = {
      user: "User",
      deliverystaff: "Delivery Staff",
      delivery_staff: "Delivery Staff",
      shop: "Shop Owner",
      shopowner: "Shop Owner",
    };
    return roleMap[role.toLowerCase()] || role;
  };

  // Validation functions
  const validateName = (name) => {
    if (!name || name.trim() === "") {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (name.trim().length > 50) {
      return "Name must be less than 50 characters";
    }
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }
    return null;
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === "") {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return "Please enter a valid email address";
    }
    if (email.length > 100) {
      return "Email must be less than 100 characters";
    }
    return null;
  };

  const validateLocation = (location) => {
    if (!location || location.trim() === "") {
      return "Location is required";
    }
    if (location.trim().length < 2) {
      return "Location must be at least 2 characters long";
    }
    if (location.trim().length > 100) {
      return "Location must be less than 100 characters";
    }
    return null;
  };

  const validateImage = (file) => {
    if (!file) return null;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF, or WebP)";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "Image file size must be less than 5MB";
    }

    return null;
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    const nameError = validateName(profileData?.name);
    if (nameError) errors.name = nameError;

    // Validate email
    const emailError = validateEmail(profileData?.email);
    if (emailError) errors.email = emailError;

    // Validate location
    const locationError = validateLocation(profileData?.location);
    if (locationError) errors.location = locationError;

    // Validate image if present
    if (profileData?.imageFile) {
      const imageError = validateImage(profileData.imageFile);
      if (imageError) errors.image = imageError;
    }

    return errors;
  };

  const getProfileImage = (data) => {
    if (!data) return "/api/placeholder/120/120";

    const imageFields = [
      data?.image,
      data?.u_profile_pic,
      data?.profile_picture,
      data?.profile_pic,
      data?.avatar,
    ];

    if (
      data?.shopimages &&
      Array.isArray(data.shopimages) &&
      data.shopimages.length > 0
    ) {
      imageFields.unshift(data.shopimages[0]?.si_image);
    }

    for (const imageUrl of imageFields) {
      if (imageUrl && imageUrl.trim() !== "") {
        return imageUrl;
      }
    }
    return "/api/placeholder/120/120";
  };

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Real-time validation
    let error = null;
    switch (field) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "location":
        error = validateLocation(value);
        break;
    }

    setValidationErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageError = validateImage(file);

      if (imageError) {
        setValidationErrors((prev) => ({
          ...prev,
          image: imageError,
        }));
        // Don't update the image if validation fails
        return;
      }

      // Clear image error if validation passes
      setValidationErrors((prev) => ({
        ...prev,
        image: null,
      }));

      // Store the actual file object for upload
      setProfileData((prev) => ({
        ...prev,
        image: URL.createObjectURL(file), // For display
        imageFile: file, // For upload
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userRole = userData?.role?.toLowerCase();

      validateForm();

      if (userRole === "user") {
        // User profile update
        const formData = new FormData();
        formData.append("u_id", profileData.id);
        formData.append("name", profileData.name || "");
        formData.append("email", profileData.email || "");
        formData.append("state", profileData.state || "");
        formData.append("address", profileData.location || "");
        formData.append("district", "");
        formData.append("zip_code", "");
        formData.append("mobile", profileData.phone || "");
        formData.append("image", profileData?.imageFile);

        const response = await fetch(
          "https://lunarsenterprises.com:6031/leeshop/user/edit/profile",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to update profile");
        }
        console.log("User profile updated successfully:", result);
        alert("Profile updated successfully!");
      } else if (userRole === "shop") {
        // Shop profile update
        const formData = new FormData();
        formData.append("sh_id", profileData.id);
        formData.append("sh_name", profileData.name || "");
        formData.append("sh_email", profileData.email || "");
        formData.append("sh_city", profileData.city || "");

        formData.append("sh_address", profileData.location || "");
        formData.append("sh_state", profileData.state || "");
        formData.append("sh_primary_phone", profileData.phone || "");
        formData.append("image", profileData?.imageFile);

        const response = await fetch(
          "https://lunarsenterprises.com:6031/leeshop/shop/edit/shop",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to update shop profile");
        }
        console.log("Shop profile updated successfully:", result);
        alert("Shop profile updated successfully!");
      } else if (userRole === "deliverystaff") {
        // Delivery staff profile update
        const formData = new FormData();
        formData.append("u_id", profileData.id);
        formData.append("u_name", profileData.name);
        formData.append("u_email", profileData.email);

        // Add other required fields with empty values
        formData.append("u_mobile", profileData.phone);
        formData.append("profile", profileData?.imageFile);

        const response = await fetch(
          "https://lunarsenterprises.com:6031/leeshop/deliverystaff/edit/delivery_staffs",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();
        if (!response.ok) {
          throw new Error(
            result.message || "Failed to update delivery staff profile"
          );
        }
        console.log("Delivery staff profile updated successfully:", result);
        alert("Delivery staff profile updated successfully!");
      } else {
        throw new Error("Unknown user role: " + userRole);
      }

      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Early return after hooks
  if (!isOpen) {
    console.log("Modal not open, returning null");
    return null;
  }

  console.log("Modal should be visible now", { profileData, loading });

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Back Arrow */}
        <div
          style={{
            padding: "24px 24px 0 24px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              padding: "12px",
              cursor: "pointer",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#374151",
              transition: "all 0.2s ease",
              width: "44px",
              height: "44px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#F3F4F6";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <FaArrowLeft size={18} />
          </button>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "600",
              color: "#1F2937",
              letterSpacing: "-0.025em",
              flex: 1,
            }}
          >
            User Profile
          </h2>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "60px 20px",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                border: "3px solid #F3F4F6",
                borderTop: "3px solid #059669",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <span style={{ color: "#6B7280", fontSize: "14px" }}>
              Loading profile...
            </span>
            <style>
              {`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}
            </style>
          </div>
        ) : (
          <div style={{ padding: "0 24px 32px 24px" }}>
            {/* Profile Image Section - Centered */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "40px",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={getProfileImage(profileData)}
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "4px solid #F9FAFB",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  }}
                />
                <label
                  htmlFor="profile-image-input"
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "32px",
                    height: "32px",
                    background: "#9CA3AF",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "white",
                    border: "3px solid white",
                    fontSize: "12px",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.background = "#6B7280";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.background = "#9CA3AF";
                  }}
                >
                  <FaCamera size={12} />
                </label>
                <input
                  id="profile-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Name Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: validationErrors.name ? "#DC2626" : "#059669",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Name *
                </label>
                <input
                  type="text"
                  value={profileData?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your name"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: `1px solid ${
                      validationErrors.name ? "#DC2626" : "#D1D5DB"
                    }`,
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: validationErrors.name
                      ? "#FEF2F2"
                      : "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors.name) {
                      e.target.style.borderColor = "#059669";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5, 150, 105, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors.name) {
                      e.target.style.borderColor = "#D1D5DB";
                      e.target.style.backgroundColor = "#F9FAFB";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                {validationErrors.name && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ⚠️ {validationErrors.name}
                  </div>
                )}
              </div>

              {/* Location Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: validationErrors.location ? "#DC2626" : "#059669",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Location *
                </label>
                <input
                  type="text"
                  value={profileData?.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Enter your location"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: `1px solid ${
                      validationErrors.location ? "#DC2626" : "#D1D5DB"
                    }`,
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: validationErrors.location
                      ? "#FEF2F2"
                      : "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors.location) {
                      e.target.style.borderColor = "#059669";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5, 150, 105, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors.location) {
                      e.target.style.borderColor = "#D1D5DB";
                      e.target.style.backgroundColor = "#F9FAFB";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                {validationErrors.location && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ⚠️ {validationErrors.location}
                  </div>
                )}
              </div>

              {/* Email Address Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: validationErrors.email ? "#DC2626" : "#059669",
                    letterSpacing: "-0.025em",
                  }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  value={profileData?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: `1px solid ${
                      validationErrors.email ? "#DC2626" : "#D1D5DB"
                    }`,
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: validationErrors.email
                      ? "#FEF2F2"
                      : "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    if (!validationErrors.email) {
                      e.target.style.borderColor = "#059669";
                      e.target.style.backgroundColor = "#FFFFFF";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(5, 150, 105, 0.1)";
                    }
                  }}
                  onBlur={(e) => {
                    if (!validationErrors.email) {
                      e.target.style.borderColor = "#D1D5DB";
                      e.target.style.backgroundColor = "#F9FAFB";
                      e.target.style.boxShadow = "none";
                    }
                  }}
                />
                {validationErrors.email && (
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "#DC2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    ⚠️ {validationErrors.email}
                  </div>
                )}
              </div>

              {/* Image Error Display */}
              {validationErrors.image && (
                <div
                  style={{
                    padding: "12px 16px",
                    backgroundColor: "#FEF2F2",
                    border: "1px solid #FECACA",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "#DC2626",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ⚠️ {validationErrors.image}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={
                  saving ||
                  Object.keys(validationErrors).some(
                    (key) => validationErrors[key]
                  )
                }
                style={{
                  width: "100%",
                  background:
                    saving ||
                    Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                      ? "#9CA3AF"
                      : "#059669",
                  color: "white",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor:
                    saving ||
                    Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                      ? "not-allowed"
                      : "pointer",
                  marginTop: "20px",
                  transition: "all 0.2s ease",
                  letterSpacing: "-0.025em",
                  opacity: Object.keys(validationErrors).some(
                    (key) => validationErrors[key]
                  )
                    ? 0.7
                    : 1,
                }}
                onMouseEnter={(e) => {
                  if (
                    !saving &&
                    !Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                  ) {
                    e.target.style.background = "#047857";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 8px 25px rgba(5, 150, 105, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (
                    !saving &&
                    !Object.keys(validationErrors).some(
                      (key) => validationErrors[key]
                    )
                  ) {
                    e.target.style.background = "#059669";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewModal;
