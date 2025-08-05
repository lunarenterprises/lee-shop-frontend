import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHeart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import "./HomePage.css";

import LoginModal from "./LoginModal";
import ConfirmIdentityModal from "./ConfirmIdentityModal";
import EmailVerificationModal from "./EmailVerificationModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SuccessModal from "./SuccessModal";
import FavoritesComponent from "./FavoritesComponent";
import AvatarModal from "./AvatarModal";

const Header = ({ activeKey, onNavClick }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // ---------- user state ----------
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw && raw !== "undefined" && raw !== "null") {
        const parsed = JSON.parse(raw);
        if (parsed?.id) setUserData(parsed);
      }
    } catch { localStorage.removeItem("userData"); }
  }, []);
  console.log("Header userData:", userData);

  const role = (userData?.role || "guest").toLowerCase();
  const isUser = role === "user";
  const isSpecial = role === "shop" || role === "deliverystaff";
  const isVisitor = !userData;
  const onLanding = location.pathname === "/";

  // ---------- nav items ----------
  const landingLinks = [
    { href: "/", label: "Home" },
    { href: "/Why", label: "Why Lee Shop" },
    { href: "/ourGoal", label: "Our Goal" }
  ];
  const userLinks = [
    { path: "/NearbyShop", label: "Find Your Local Shop" },
    { path: "/NearbyService", label: "Find Nearby Services" },
    { path: "/AssignDelivery", label: "Assign Your Delivery Agent" }
  ];
  // Show only on landing for logged out
  const navItems = isVisitor ? (onLanding ? landingLinks : []) : isUser ? userLinks : [];

  // ---------- routes ----------
  const profileRoute =
    role === "deliverystaff" ? "/DeliveryProfile"
      : role === "shop" ? "/ShopProfile"
        : "/UserProfile";

  // ---------- ui state ----------
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFav, setShowFav] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ---------- logo click ----------
  const handleLogo = () => {
    if (onLanding) { window.location.reload(); return; }
    if (userData) { navigate(profileRoute); return; }
    navigate("/");
  };

  // ---------- login success ----------
  const handleLoginSuccess = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
    navigate(
      user.role?.toLowerCase() === "shop" ? "/ShopProfile"
        : user.role?.toLowerCase() === "deliverystaff" ? "/DeliveryProfile"
          : "/UserProfile"
    );
    setShowLogin(false);
  };


  // ---------- logout handler ----------
  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/");
  };

  return (
    <>
      <header className="homepage-header">
        {/* LOGO */}
        <div className="homepage-logo" onClick={handleLogo} style={{ cursor: "pointer" }}>
          <img src="/logo.png" alt="Logo" style={{ height: 42 }} />
        </div>

        {/* HAMBURGER (only if nav items present) */}
        {navItems.length > 0 && (
          <button
            className="homepage-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen(o => !o)}
          >
            {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
          </button>
        )}

        {/* NAV LINKS */}
        {navItems.length > 0 && (
          <nav className={`homepage-nav${menuOpen ? " open" : ""}`}>
            {navItems.map(({ path, href, label }) => {
              const link = path || href;
              const active = location.pathname === link || activeKey === link;
              return (
                <button
                  key={link}
                  className={`homepage-menu-item${active ? " active" : ""}`}
                  onClick={() => {
                    onNavClick ? onNavClick(link) : navigate(link);
                    setMenuOpen(false);
                  }}
                >
                  {label}
                </button>
              );
            })}

            {/* Mobile icons for USER only */}
            {isUser && (
              <div className="mobile-user-icons">
                <button className="mobile-icon-btn" onClick={() => { setShowFav(true); setMenuOpen(false); }}>
                  <FaHeart size={18} /><span>Favorites</span>
                </button>
                <button
                  className="mobile-icon-btn"
                  onClick={() => { setShowAvatar(true); setMenuOpen(false); }}
                >
                  <FaUser size={18} /><span>Profile</span>
                </button>
              </div>
            )}

            {/* Mobile login button */}
            {!userData && (
              <div className="mobile-auth-section">
                <button className="mobile-login-btn" onClick={() => { setShowLogin(true); setMenuOpen(false); }}>
                  Login / Register
                </button>
              </div>
            )}
          </nav>
        )}

        {/* RIGHT ICONS */}
        <div className="homepage-icons">
          {!userData ? (
            <button className="desktop-login-btn" onClick={() => setShowLogin(true)}>
              Login / Register
            </button>
          ) : (
            <>
              {isUser && (
                <button className="desktop-icon-btn" onClick={() => setShowFav(true)}>
                  <FaHeart color="#bcee66" size={18} />
                </button>
              )}
              <button
                className="desktop-icon-btn"
                onClick={() => setShowAvatar(true)}
                aria-label="Profile"
              >
                <FaUser color="#bcee66" size={18} />
              </button>
            </>
          )}
        </div>
      </header>

      {/* ---------- MODALS ---------- */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} onForgotPassword={() => { setShowLogin(false); setShowIdentity(true); }} />}
      {showIdentity && <ConfirmIdentityModal onClose={() => setShowIdentity(false)} onConfirmEmail={(e) => { setUserEmail(e); setShowIdentity(false); setShowEmail(true); }} />}
      {showEmail && <EmailVerificationModal email={userEmail} onClose={() => setShowEmail(false)} onVerify={() => { setShowEmail(false); setShowReset(true); }} />}
      {showReset && <ResetPasswordModal email={userEmail} onClose={() => setShowReset(false)} onSuccess={() => { setShowReset(false); setShowSuccess(true); }} />}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {/* Favorites only for USER */}
      {isUser && <FavoritesComponent isOpen={showFav} onClose={() => setShowFav(false)} />}

      {/* Avatar modal always available */}
      <AvatarModal
        isOpen={showAvatar}
        onClose={() => setShowAvatar(false)}
        userData={{ id: userData?.id, role }}
        onLogout={handleLogout}
      />
    </>
  );
};

export default Header;
