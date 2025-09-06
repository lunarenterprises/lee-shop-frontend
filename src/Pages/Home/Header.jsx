import React, { useEffect, useState, useRef } from "react";
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
import SignUpModal from "./SignUpModal";
import ProfileViewModal from "./ProfileViewModal";
import SettingsModal from "./SettingsModal";

const Header = ({ activeKey, onNavClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const urlType = searchParams.get("type");

  // ---------- user state ----------
  const [userData, setUserData] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);

  // ---------- dropdown states ----------
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw && raw !== "undefined" && raw !== "null") {
        const parsed = JSON.parse(raw);
        if (parsed?.id) setUserData(parsed);
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, []);

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowShopDropdown(false);
      }
      if (
        servicesDropdownRef.current &&
        !servicesDropdownRef.current.contains(event.target)
      ) {
        setShowServicesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const role = (userData?.role || "guest").toLowerCase();
  const isUser = role === "user";
  const isSpecial = role === "shop" || role === "deliverystaff";
  const isVisitor = !userData;
  const onLanding = location.pathname === "/";

  // ---------- nav items ----------
  const landingLinks = [
    { href: "/", label: "Home" },
    { href: "/Why", label: "Why LeeShop" },
    { href: "/ourGoal", label: "Our Goal" },
  ];
  const userLinks = [
    {
      path: "/NearbyShop",
      label: "Find Your Local Shop",
      hasDropdown: true,
      dropdownType: "shop",
    },
    {
      path: "/NearbyService",
      label: "Find Nearby Services",
      hasDropdown: true,
      dropdownType: "services",
    },
    {
      path: "/AssignDelivery",
      label: "Assign Your Delivery Agent",
      hasDropdown: false, // ✅ plain link
    },
  ];

  const navItems = isVisitor
    ? onLanding
      ? landingLinks
      : []
    : isUser || isSpecial
    ? userLinks
    : [];

  // shop categories
  const shopCategories = [
    "Grocery Stores",
    "Home Decor",
    "Plastic & Steel Utility Shops",
    "Bakery & Cake Shops",
    "Music Instruments",
    "Furnishing Stores",
    "Electronics & Mobile Stores",
    "Clothing",
    "Electrical",
    "Kitchenware",
    "Cleaning",
    "Watch Shops",
    "KitchenFootwear Shopware",
    "Bridal Makeup Artists",
    "Henna Artists",
    "Health Food Stores",
    "Gift Shop",
    "Stationery",
    "Art & Craft Supplies",
  ];

  // service categories
  const serviceCategories = [
    "Deep Cleaning",
    "AC Installation & Repair",
    "Home Tuition",
    "Kitchenware",
    "Health",
    "Childcare",
    "Event Planners",
    "Freelance Designers",
    "Website Development",
    "Media Marketing",
    "Stage Decorators",
    "Language Training",
    "Plumbing",
    "Vet/Grooming",
    "Dry cleaning Services",
    "Tattoo Design",
    "Pottery Classes",
    "Physiotherapy at Home",
    "House Painting",
    "Garbage Pickup Services",
  ];

  // ---------- routes ----------
  const profileRoute =
    role === "deliverystaff"
      ? "/DeliveryProfile"
      : role === "shop"
      ? "/ShopProfile"
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
  const [showProfileView, setShowProfileView] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  // ---------- logo click ----------
  const handleLogo = () => {
    if (onLanding) {
      window.location.reload();
      return;
    }
    if (userData) {
      navigate(profileRoute);
      return;
    }
    navigate("/");
  };

  // ---------- login success ----------
  const handleLoginSuccess = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
    navigate(
      user.role?.toLowerCase() === "shop"
        ? "/ShopProfile"
        : user.role?.toLowerCase() === "deliverystaff"
        ? "/DeliveryProfile"
        : "/UserProfile"
    );
    setShowLogin(false);
  };

  // ✅ auto-redirect only on landing page
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;
    if (location.pathname !== "/") return; // <-- Fix: don’t hijack /AssignDelivery

    const user = JSON.parse(storedUser);
    if (user.role?.toLowerCase() === "shop") {
      navigate("/ShopProfile");
    } else if (user.role?.toLowerCase() === "deliverystaff") {
      navigate("/DeliveryProfile");
    } else {
      navigate("/UserProfile");
    }
  }, [navigate, location.pathname]);

  // ---------- logout handler ----------
  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserData(null);
    navigate("/");
  };

  // ---------- profile and settings handlers ----------
  const handleProfileClick = () => {
    setShowAvatar(false);
    setShowProfileView(true);
  };

  const handleSettingsClick = () => {
    setShowAvatar(false);
    setShowSettings(true);
  };

  // ---------- nav item click ----------
  const handleNavItemClick = (item) => {
    if (item.hasDropdown) {
      if (item.dropdownType === "shop" && item.path === "/NearbyShop") {
        setShowShopDropdown(!showShopDropdown);
        setShowServicesDropdown(false);
      } else if (
        item.dropdownType === "services" &&
        item.path === "/NearbyService"
      ) {
        setShowServicesDropdown(!showServicesDropdown);
        setShowShopDropdown(false);
      }
    } else {
      const link = item.path || item.href;

      // ✅ always navigate (don’t let onNavClick block it)
      navigate(link);
      if (onNavClick) onNavClick(link);

      setMenuOpen(false);
      setShowShopDropdown(false);
      setShowServicesDropdown(false);
    }
  };

  // handle shop category click
  const handleShopCategoryClick = (category) => {
    navigate(
      `/ServiceFinder?category=${encodeURIComponent(category)}&type=shop`
    );
    setShowShopDropdown(false);
    setMenuOpen(false);
  };

  // handle service category click
  const handleServiceCategoryClick = (category) => {
    navigate(
      `/ServiceFinder?category=${encodeURIComponent(category)}&type=service`
    );
    setShowServicesDropdown(false);
    setMenuOpen(false);
  };

  return (
    <>
      <header className="homepage-header">
        {/* LOGO */}
        <div
          className="homepage-logo"
          onClick={handleLogo}
          style={{ cursor: "pointer" }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: 42 }} />
        </div>

        {/* HAMBURGER */}
        {navItems.length > 0 && (
          <button
            className="homepage-hamburger"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
          </button>
        )}

        {/* NAV LINKS */}
        {navItems.length > 0 && (
          <nav className={`homepage-nav${menuOpen ? " open" : ""}`}>
            {navItems.map((item) => {
              const link = item.path || item.href;

              // active state logic
              let active = location.pathname === link || activeKey === link;

              if (item.hasDropdown && item.dropdownType) {
                if (item.dropdownType === "shop" && urlType === "shop") {
                  active = true;
                } else if (
                  item.dropdownType === "services" &&
                  urlType === "service"
                ) {
                  active = true;
                }
              }

              // dropdown nav items
              if (item.hasDropdown) {
                const isShopDropdown = item.dropdownType === "shop";
                const isServicesDropdown = item.dropdownType === "services";
                const showCurrentDropdown = isShopDropdown
                  ? showShopDropdown
                  : showServicesDropdown;
                const currentRef = isShopDropdown
                  ? dropdownRef
                  : servicesDropdownRef;
                const categories = isShopDropdown
                  ? shopCategories
                  : serviceCategories;
                const handleCategoryClick = isShopDropdown
                  ? handleShopCategoryClick
                  : handleServiceCategoryClick;
                const dropdownClassName = isShopDropdown
                  ? "shop-categories-dropdown"
                  : "services-categories-dropdown";

                return (
                  <div
                    key={link}
                    className="dropdown-nav-wrapper"
                    ref={currentRef}
                  >
                    <button
                      className={`homepage-menu-item${active ? " active" : ""}`}
                      onClick={() => handleNavItemClick(item)}
                    >
                      {item.label}
                      <span style={{ paddingTop: "5px" }}>
                        ▼
                      </span>
                    </button>
                    {showCurrentDropdown && (
                      <div className={dropdownClassName}>
                        <div className="dropdown-content">
                          <h4>Frequently visited categories</h4>
                          <div className="categories-grid">
                            {categories.map((category, index) => (
                              <button
                                key={index}
                                className="category-item"
                                onClick={() => handleCategoryClick(category)}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              // regular nav items
              return (
                <button
                  key={link}
                  className={`homepage-menu-item${active ? " active" : ""}`}
                  onClick={() => handleNavItemClick(item)}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Mobile icons */}
            {isUser && (
              <div className="mobile-user-icons">
                <button
                  className="mobile-icon-btn"
                  onClick={() => {
                    setShowFav(true);
                    setMenuOpen(false);
                  }}
                >
                  <FaHeart size={18} />
                  <span>Favorites</span>
                </button>
                <button
                  className="mobile-icon-btn"
                  onClick={() => {
                    setShowAvatar(true);
                    setMenuOpen(false);
                  }}
                >
                  <FaUser size={18} />
                  <span>Profile</span>
                </button>
              </div>
            )}

            {/* Mobile login */}
            {!userData && (
              <div className="mobile-auth-section">
                <button
                  className="mobile-login-btn"
                  onClick={() => {
                    setShowLogin(true);
                    setMenuOpen(false);
                  }}
                >
                  Login / Register
                </button>
              </div>
            )}
          </nav>
        )}

        {/* RIGHT ICONS */}
        <div className="homepage-icons">
          {!userData ? (
            <button
              className="desktop-login-btn"
              onClick={() => setShowLogin(true)}
            >
              Login / Register
            </button>
          ) : (
            <>
              {isUser && (
                <button
                  className="desktop-icon-btn"
                  onClick={() => setShowFav(true)}
                >
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
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          onSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
          onForgotPassword={() => {
            setShowLogin(false);
            setShowIdentity(true);
          }}
        />
      )}
      {showIdentity && (
        <ConfirmIdentityModal
          onClose={() => setShowIdentity(false)}
          onConfirmEmail={(e) => {
            setUserEmail(e);
            setShowIdentity(false);
            setShowEmail(true);
          }}
        />
      )}
      {showEmail && (
        <EmailVerificationModal
          email={userEmail}
          onClose={() => setShowEmail(false)}
          onVerify={() => {
            setShowEmail(false);
            setShowReset(true);
          }}
        />
      )}
      {showReset && (
        <ResetPasswordModal
          email={userEmail}
          onClose={() => setShowReset(false)}
          onSuccess={() => {
            setShowReset(false);
            setShowSuccess(true);
          }}
        />
      )}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {/* Sign-up modal */}
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}

      {/* Favorites */}
      {isUser && (
        <FavoritesComponent
          isOpen={showFav}
          onClose={() => setShowFav(false)}
        />
      )}

      {/* Avatar */}
      <AvatarModal
        isOpen={showAvatar}
        onClose={() => setShowAvatar(false)}
        userData={{ id: userData?.id, role }}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />

      {/* Profile View */}
      <ProfileViewModal
        isOpen={showProfileView}
        onClose={() => setShowProfileView(false)}
        userData={userData}
      />

      {/* Settings */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userData={userData}
      />
    </>
  );
};

export default Header;
