import { ChevronRight, Eye, EyeOff, Play, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const SettingsModal = ({
  isOpen,
  onClose,
  onLogout, 
  userData = { id: "user123", email: "amaldev5568@gmail.com" },
}) => {
  const [profileData, setProfileData] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);

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

  const handlePasswordChange = (field, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/user/ResetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: profileData.email,
            password: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.result) {
        alert("Password changed successfully! You will be logged out.");
        
             // Reset form
        setShowChangePassword(false);
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
        
        // Close modal
        onClose();
        
        // Logout user
        if (onLogout) {
          onLogout();
        } else {
          // Fallback: redirect to login page or reload
          window.location.href = '/'; // Adjust path as needed
        }
      } else {
        alert(data.message || "Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      let endpoint = "";
      let payload = {};

      // Determine API endpoint and payload based on role
      switch (userData.role.toLowerCase()) {
        case "user":
          endpoint = "https://lunarsenterprises.com:6031/leeshop/user/delete/user";
          payload = { u_id: userData.id.toString() };
          break;
        case "deliverystaff":
          endpoint = "https://lunarsenterprises.com:6031/leeshop/deliverystaff/delete/delivery_staffs";
          payload = { u_id: userData.id };
          break;
        case "shop":
          endpoint = "https://lunarsenterprises.com:6031/leeshop/shop/delete/shop";
          payload = { sh_id: userData.id };
          break;
        default:
          console.warn("Unknown user role:", userData.role);
          alert("Unable to delete account: Unknown user role");
          setLoading(false);
          setShowDeleteConfirm(false);
          return;
      }

      console.log("Deleting account for user:", userData.id, "Role:", userData.role);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account deleted successfully!");
        onClose();
        // Logout user after successful deletion
        if (onLogout) {
          onLogout();
        } else {
          // Fallback: redirect to login page or reload
          window.location.href = '/'; // Adjust path as needed
        }
      } else {
        alert(data.message || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const resetModal = () => {
    setShowChangePassword(false);
    setShowDeleteConfirm(false);
    setPasswordData({
      newPassword: "",
      confirmPassword: "",
    });
    setShowPasswords({
      new: false,
      confirm: false,
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  };

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "1rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    width: "100%",
    maxWidth: "28rem",
    minHeight: "300px",
    maxHeight: "75vh",
    overflow: "hidden",
  };

  const contentStyle = {
    padding: "2rem",
  };

  const buttonStyle = {
    background: "none",
    border: "none",
    cursor: "pointer",
    outline: "none",
  };

  const closeButtonStyle = {
    ...buttonStyle,
    padding: "0.25rem",
    borderRadius: "50%",
    transition: "background-color 0.2s",
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem 1rem",
    paddingRight: "3rem",
    border: "1px solid #e5e5e5",
    borderRadius: "0.75rem",
    outline: "none",
    fontSize: "1rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const inputFocusStyle = {
    borderColor: "#10b981",
    boxShadow: "0 0 0 3px rgba(16, 185, 129, 0.1)",
  };

  const primaryButtonStyle = {
    width: "100%",
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    outline: "none",
  };

  const secondaryButtonStyle = {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    outline: "none",
  };

  const dangerButtonStyle = {
    flex: 1,
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.75rem 1rem",
    border: "none",
    borderRadius: "0.75rem",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "background-color 0.2s",
    outline: "none",
    alignItems: "center",
  };

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={handleOverlayClick}>
      <div style={modalStyle}>
        {!showChangePassword && !showDeleteConfirm ? (
          // Main Settings Menu
          <div style={contentStyle}>
            {/* Close button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "2rem",
              }}
            >
              <button
                onClick={handleClose}
                style={closeButtonStyle}
                aria-label="Close modal"
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <X
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    color: "#6b7280",
                  }}
                />
              </button>
            </div>

            {/* Settings Title */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "2.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "1rem",
                  height: "1rem",
                  marginRight: "0.75rem",
                }}
              >
                <Play
                  style={{
                    width: "1rem",
                    height: "1rem",
                    color: "#10b981",
                    fill: "currentColor",
                  }}
                />
              </div>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "500",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Settings
              </h2>
            </div>

            {/* Menu Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <button
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "1rem 0",
                  textAlign: "left",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
                onClick={() => setShowChangePassword(true)}
              >
                <span style={{ color: "#111827", fontWeight: "500" }}>
                  Change password
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "1.125rem",
                      letterSpacing: "0.1em",
                    }}
                  >
                    ••••••••
                  </span>
                  <ChevronRight
                    style={{ width: "1rem", height: "1rem", color: "#9ca3af" }}
                  />
                </div>
              </button>

              <div
                style={{
                  borderTop: "1px solid #f3f4f6",
                  paddingTop: "1rem",
                  alignItems: "center",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    width: "100%",
                    padding: "1rem 0",
                    textAlign: "center",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <span style={{ color: "#ef4444", fontWeight: "500" }}>
                    Delete Account
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : showChangePassword ? (
          // Change Password Form
          <div style={contentStyle}>
            {/* Header with back button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <button
                onClick={() => setShowChangePassword(false)}
                style={closeButtonStyle}
                aria-label="Back"
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <X
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    color: "#6b7280",
                  }}
                />
              </button>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  color: "#111827",
                  margin: 0,
                }}
              >
                Change Password
              </h2>
              <div style={{ width: "1.5rem" }}></div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div>
                <label
                  htmlFor="new-password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="new-password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    placeholder="Enter new password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#10b981";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(16, 185, 129, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e5e5";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingRight: "1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    {showPasswords.new ? (
                      <EyeOff
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#9ca3af",
                        }}
                      />
                    ) : (
                      <Eye
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#9ca3af",
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Confirm New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirm-password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    placeholder="Confirm new password"
                    style={inputStyle}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#10b981";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(16, 185, 129, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e5e5e5";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      paddingRight: "1rem",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      outline: "none",
                    }}
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#9ca3af",
                        }}
                      />
                    ) : (
                      <Eye
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          color: "#9ca3af",
                        }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <button
                style={{
                  ...primaryButtonStyle,
                  backgroundColor:
                    loading ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                      ? "#d1d5db"
                      : "#10b981",
                  cursor:
                    loading ||
                    !passwordData.newPassword ||
                    !passwordData.confirmPassword
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleChangePassword}
                disabled={
                  loading ||
                  !passwordData.newPassword ||
                  !passwordData.confirmPassword
                }
                onMouseEnter={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#059669";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.target.disabled) {
                    e.target.style.backgroundColor = "#10b981";
                  }
                }}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
          </div>
        ) : (
          // Delete Account Confirmation
          <div style={contentStyle}>
            {/* Header with back button */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={closeButtonStyle}
                aria-label="Back"
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                <X
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    color: "#6b7280",
                  }}
                />
              </button>
              <h2
                style={{
                  fontSize: "1.125rem",
                  fontWeight: "500",
                  color: "#111827",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Delete Account
              </h2>
              <div style={{ width: "1.5rem" }}></div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div style={{ textAlign: "center", padding: "1rem 0" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    color: "#111827",
                    marginBottom: "0.75rem",
                  }}
                >
                  Are you sure you want to delete your account?
                </h3>
                <p
                  style={{
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.5",
                  }}
                >
                  This action cannot be undone. All your data will be
                  permanently removed.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  style={{
                    ...secondaryButtonStyle,
                    opacity: loading ? 0.5 : 1,
                  }}
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = "#e5e7eb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                >
                  Cancel
                </button>
                <button
                  style={{
                    ...dangerButtonStyle,
                    opacity: loading ? 0.5 : 1,
                  }}
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  onMouseEnter={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = "#dc2626";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.target.disabled) {
                      e.target.style.backgroundColor = "#ef4444";
                    }
                  }}
                >
                  {loading ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;