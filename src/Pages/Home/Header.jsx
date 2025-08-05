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
import FavoritesComponent from "./FavoritesComponent";
import AvatarModal from "./AvatarModal"; // Add this import
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
  const [showFavorites, setShowFavorites] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false); // Add this state
  const [userEmail, setUserEmail] = useState("");
  /* helper picks the right link */
  const getLink = (item) => item.path || item.href;
  // Always compute navItems from latest userData state
  const navItems = userData
    ? [
      { path: "/NearbyShop", label: "Find Your Local Shop" },
      { path: "/NearbyService", label: "Find Nearby Services" },
      { path: "/AssignDelivery", label: "Assign Your Delivery Agent" },
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
    setShowAvatarModal(false); // Close avatar modal on logout
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

  const handleMenuItemClick = (link) => {
    if (onNavClick) {
      onNavClick(link);      // Landing page passed this prop
    } else {
      navigate(link);        // All other pages
    }
    setMenuOpen(false);
  };
  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowIdentityModal(false);
    setShowEmailVerificationModal(false);
    setShowResetModal(false);
    setShowSuccessModal(false);
    setShowAvatarModal(false); // Add this
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

  const handleFavoritesClick = () => {
    setShowFavorites(true);
    setMenuOpen(false); // Close mobile menu if open
    setShowAvatarModal(false); // Close avatar modal if open
  };

  // Updated avatar click handler
  const handleAvatarClick = () => {
    setShowAvatarModal(true);
    setMenuOpen(false); // Close mobile menu if open
    setShowFavorites(false); // Close favorites if open
  };

  // Avatar modal action handlers
  const handleProfileModalClick = () => {
    setProfileModal(true);
    setShowAvatarModal(false);
  };

  const handleSettingsClick = () => {
    setSettingsModal(true);
    setShowAvatarModal(false);
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
    setMenuOpen(false); // Close mobile menu if open
  };

  return (
    <div>
      <header className="homepage-header">
        <div
          className="homepage-logo"
          onClick={() => onNavClick && onNavClick("/")}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: "42px" }} />
        </div>

        {/* Hamburger for mobile */}
        <button
          className="homepage-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        {/* NAV: Center items + mobile icons */}
        {/* ───────────────── NAVIGATION ───────────────── */}
        {/* ─────────── NAVIGATION ─────────── */}
        <nav className={`homepage-nav${menuOpen ? " open" : ""}`}>

          {/* MAIN LINKS */}
          {/* MAIN LINKS */}
          {navItems.map((item) => {
            // one canonical URL for every entry
            const link = item.path || item.href;

            // “active” when …  
            // • you are on that route   OR  
            // • (landing page) scroll-spy says it’s the current section
            const isActive =
              location.pathname === link || activeKey === link;

            return (
              <button
                key={link}
                type="button"
                className={`homepage-menu-item${isActive ? " active" : ""}`}
                onClick={() => handleMenuItemClick(link)}
              >
                {item.label}
              </button>
            );
          })}


          {/* MOBILE-ONLY ICON ROW */}
          {userData && (
            <div className="mobile-user-icons">
              <button
                className="mobile-icon-btn"
                aria-label="Open Favorites"
                onClick={handleFavoritesClick}
              >
                <FaHeart size={18} />
                <span>Favorites</span>
              </button>

              <button
                className="mobile-icon-btn"
                aria-label="Open User Profile"
                onClick={handleAvatarClick}
              >
                <FaUser size={18} />
                <span>Profile</span>
              </button>
            </div>
          )}

          {/* LOGIN / REGISTER (mobile) */}
          {!userData && (
            <div className="mobile-auth-section">
              <button className="mobile-login-btn" onClick={handleLoginClick}>
                Login / Register
              </button>
            </div>
          )}
        </nav>
        {/* RIGHT END: Desktop-only icons */}
        <div className="homepage-icons">
          {!userData ? (
            <button
              className="desktop-login-btn"
              onClick={() => setShowLoginModal(true)}
            >
              Login / Register
            </button>
          ) : (
            <>
              {/* Favorites Icon */}
              <button
                className="desktop-icon-btn"
                aria-label="Open Favorites"
                onClick={handleFavoritesClick}
              >
                <FaHeart color="#bcee66" size={18} />
              </button>

              {/* Profile Icon - Updated to show avatar modal */}
              <button
                className="desktop-icon-btn"
                aria-label="Open User Profile"
                onClick={handleAvatarClick} // Updated handler
              >
                <FaUser color="#bcee66" size={18} />
              </button>
            </>
          )}
        </div>

        {/* All Modals */}
        {showLoginModal && (
          <LoginModal
            onClose={closeAllModals}
            onForgotPassword={handleForgotPassword}
          />
        )}

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

        {/* Favorites Component */}
        <FavoritesComponent
          isOpen={showFavorites}
          onClose={() => setShowFavorites(false)}
        />

        {/* Avatar Modal - NEW */}

        <AvatarModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          userData={{
            id: userData?.u_id, // depending on role
            role: userData?.role || 'user', // make sure role is set

          }}
          onProfileClick={handleProfileModalClick}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />


        {/* Profile Edit Modal */}
        {profileModal && (
          <ProfileEditModal
            show={profileModal}
            onHide={() => setProfileModal(false)}
            userData={userData}
            onSave={handleProfileSave}
            onLogout={handleLogout}
            onChangePassword={handleChangePassword}
            onDelete={handleDeleteButton}
            onFileUpload={handleFileUpload}
            previewUrl={previewUrl}
          />
        )}
      </header>
    </div>
  );
};

export default Header;
