import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaCamera } from "react-icons/fa";

const ProfileViewModal = ({ isOpen, onClose, userData }) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  console.log("ProfileModal render - isOpen:", isOpen, "userData:", userData);

  // All hooks first
  useEffect(() => {
    if (!isOpen || !userData?.id || !userData?.role) return;

    const fetchProfileData = async () => {
      setLoading(true);
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
                profileInfo = {
                  id: user.u_id,
                  name: user.u_name || user.name || "",
                  image: user.u_profile_pic || user.profile_image || null,
                  email: user.u_email || user.email || "",
                  phone: user.u_phone || user.phone || "",
                  location: user.u_address || user.address || "",
                  role: "User",
                };
              }
              break;
            case "deliverystaff":
              const staffList = data.list || [];
              if (staffList.length > 0) {
                const staff = staffList[0];
                profileInfo = {
                  id: staff.u_id,
                  name: staff.name || staff.u_name || "",
                  image: staff.profile_pic || staff.profile_image || null,
                  email: staff.email || "",
                  phone: staff.phone || "",
                  location: staff.address || staff.location || "",
                  role: "Delivery Staff",
                };
              }
              break;
            case "shop":
              const shopList = data.list || [];
              if (shopList.length > 0) {
                const shop = shopList[0];
                profileInfo = {
                  id: shop.sh_id,
                  name: shop.sh_name || shop.name || "",
                  image:
                    shop.shopimages && shop.shopimages.length > 0
                      ? shop.shopimages[0].si_image
                      : shop.shop_image || null,
                  email: shop.sh_email || shop.email || "",
                  phone: shop.sh_phone || shop.phone || "",
                  location: shop.sh_address || shop.address || "",
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
      phone: userData?.phone || userData?.u_phone || userData?.sh_phone || "",
      location: userData?.location || userData?.u_address || userData?.sh_address || "",
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
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          image: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log("Saving profile data:", profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
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
          <h2 style={{ 
            margin: 0, 
            fontSize: "20px", 
            fontWeight: "600",
            color: "#1F2937",
            letterSpacing: "-0.025em",
            flex: 1,
          }}>
            User Profile
          </h2>
        </div>

        {loading ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            gap: "16px",
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              border: "3px solid #F3F4F6",
              borderTop: "3px solid #059669",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
            <span style={{ color: "#6B7280", fontSize: "14px" }}>Loading profile...</span>
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
            <div style={{ 
              display: "flex", 
              justifyContent: "center", 
              alignItems: "center",
              marginBottom: "40px" 
            }}>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* Name Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#059669",
                    letterSpacing: "-0.025em"
                  }}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={profileData?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Alexis Sanchez"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.backgroundColor = "#F9FAFB";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Location Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#059669",
                    letterSpacing: "-0.025em"
                  }}
                >
                  Location
                </label>
                <input
                  type="text"
                  value={profileData?.location || ""}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Alexis Sanchez"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.backgroundColor = "#F9FAFB";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Email Address Field */}
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    fontWeight: "500",
                    fontSize: "14px",
                    color: "#059669",
                    letterSpacing: "-0.025em"
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Alexis Sanchez"
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    border: "1px solid #D1D5DB",
                    borderRadius: "12px",
                    fontSize: "16px",
                    color: "#374151",
                    backgroundColor: "#F9FAFB",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#059669";
                    e.target.style.backgroundColor = "#FFFFFF";
                    e.target.style.boxShadow = "0 0 0 3px rgba(5, 150, 105, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#D1D5DB";
                    e.target.style.backgroundColor = "#F9FAFB";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  width: "100%",
                  background: saving ? "#9CA3AF" : "#059669",
                  color: "white",
                  border: "none",
                  padding: "16px 24px",
                  borderRadius: "12px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  marginTop: "20px",
                  transition: "all 0.2s ease",
                  letterSpacing: "-0.025em"
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.background = "#047857";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 8px 25px rgba(5, 150, 105, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.background = "#059669";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "none";
                  }
                }}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileViewModal;