import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./HomePage.css";
import { FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import axiosInstance from "../../constant/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProfileEditModal from "../Profiles/ProfileEditModal";
import LoginModal from "./LoginModal";
import ConfirmIdentityModal from "./ConfirmIdentityModal";
import EmailVerificationModal from "./EmailVerificationModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SuccessModal from "./SuccessModal";

const Header = ({ activeKey, onNavClick }) => {
  const location = useLocation();
  const [profileModal, setProfileModal] = useState(false);
  const [childModal, setChildModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(16);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const formData = useRef(new FormData());
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // Always compute navItems from latest userData state
  const navItems = userData
    ? [
      { href: "/NearbyShop", label: "Find Your Local Shop" },
      { href: "/NearbyService", label: "Find Nearby Services" },
      { href: "/AssignDelivery", label: "Assign Your Delivery Agent" },
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/Why", label: "Why Lee Shop" },
      { href: "/ourGoal", label: "Our Goal" },
    ];

  useEffect(() => {
    // Get userData from localStorage (on mount/refresh)
    const storedUser = JSON.parse(localStorage.getItem("userData"));
    const getUser = async () => {
      try {
        const response = await axiosInstance.post("/user/list/user", {
          u_id: userId,
        });
        if (response?.data?.result) {
          setUserData(response?.data?.list[0]);
          localStorage.setItem("userData", JSON.stringify(response?.data?.list[0]));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (!storedUser) {
      getUser();
    } else {
      setUserData(storedUser);
      setUserId(storedUser.u_id);
    }
    // eslint-disable-next-line
  }, [userId]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      formData.current.append("image", file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    for (let [key, value] of formData.current.entries()) {
      console.log(key + " : " + value);
    }
    formData.current.append("u_id", userId);
    const response = await axiosInstance.post(
      "/user/edit/profile",
      formData.current,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setChildModal(false);
    if (response.data.result) {
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setProfileModal(false);
    setUserData(null);
    setUserId(null);
    navigate("/");
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: "Successfully!",
      text: "Your password has been successfully updated",
      icon: "success",
      showConfirmButton: false,
      footer: '<a href="/login" class="text-[#0A5C15] text-xl">Go to Login</a>',
    });
  };

  const handleDeleteButton = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axiosInstance.post("/user/delete/user", {
          u_id: userId,
        });
        if (response.data.result) {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Failed!",
            text: response.data.message,
            icon: "error",
          });
        }
      }
    });
  };

  const handleMenuItemClick = (href) => {
    if (onNavClick) onNavClick(href);
    setMenuOpen(false);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowIdentityModal(false);
    setShowEmailVerificationModal(false);
    setShowResetModal(false);
    setShowSuccessModal(false);
  };

  const handleForgotPassword = () => {
    setShowLoginModal(false);
    setShowIdentityModal(true);
  };

  const handleConfirmEmail = (email) => {
    setUserEmail(email);
    setShowIdentityModal(false);
    setShowEmailVerificationModal(true);
  };

  const handleVerify = () => {
    setShowEmailVerificationModal(false);
    setShowResetModal(true);
  };

  // --- NEW: utility for icon circle styling (matches your img) ---
  const iconCircleStyle = {
    background: "#226910",
    borderRadius: "50%",
    padding: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 3px rgba(0,0,0,0.07)"
  };

  return (
    <div>
      <header className="homepage-header">
        <div
          className="homepage-logo"
          onClick={() => onNavClick && onNavClick("/")}
          style={{ cursor: "pointer" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "42px" }} />
        </div>

        {/* Hamburger for mobile */}
        <button
          className="homepage-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}>
          {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        {/* NAV: Center items only */}
        <nav className={`homepage-nav${menuOpen ? " open" : ""}`}>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.href}
              className={`homepage-menu-item${activeKey === item.href ? " active" : ""}`}
              onClick={() => handleMenuItemClick(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* RIGHT END: Only one icon pair or login/register */}
        <div className="homepage-icons" style={{ marginLeft: "auto", gap: 16 }}>
          {!userData ? (
            <div
              className="homepage-login-register-desktop"
              onClick={() => setShowLoginModal(true)}
              style={{ cursor: "pointer" }}>
              Login / Register
            </div>
          ) : (
            <>
              <div className="homepage-icon-wrapper" style={{
                background: "#226910",
                borderRadius: "50%",
                padding: "8px",
                marginRight: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <FaHeart color="#bcee66" size={18} />
              </div>
              <div className="homepage-icon-wrapper" style={{
                background: "#226910",
                borderRadius: "50%",
                padding: "8px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
                tabIndex={0}
                aria-label="User Profile"
                onClick={() => setProfileModal(true)}
                onKeyPress={(e) => { if (e.key === "Enter") setProfileModal(true); }}
              >
                <FaUser color="#bcee66" size={18} />
              </div>
            </>
          )}
        </div>

        {/* Modals at header root */}
        {showLoginModal &&
          <LoginModal
            onClose={closeAllModals}
            onForgotPassword={handleForgotPassword}
          />
        }
        {showIdentityModal && (
          <ConfirmIdentityModal
            onClose={() => setShowIdentityModal(false)}
            onConfirmEmail={handleConfirmEmail}
          />
        )}
        {showEmailVerificationModal && (
          <EmailVerificationModal
            email={userEmail}
            onClose={() => setShowEmailVerificationModal(false)}
            onVerify={handleVerify}
          />
        )}
        {showResetModal && (
          <ResetPasswordModal
            email={userEmail}
            onClose={() => setShowResetModal(false)}
            onSuccess={() => {
              setShowResetModal(false);
              setShowSuccessModal(true);
            }}
          />
        )}
        {showSuccessModal && (
          <SuccessModal onClose={() => setShowSuccessModal(false)} />
        )}
      </header>
      {/* profile modal and others unchanged -- same as before */}
      {/* ... */}
    </div>
  );
};

export default Header;
