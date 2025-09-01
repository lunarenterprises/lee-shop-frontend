import React, { useEffect, useState } from "react";
import "./HomePage.css";
import LoginModal from "./LoginModal";
import ConfirmIdentityModal from "./ConfirmIdentityModal";
import EmailVerificationModal from "./EmailVerificationModal";
import ResetPasswordModal from "./ResetPasswordModal";
import SuccessModal from "./SuccessModal";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import ShopCard from "../ShopCard";
import FreshProductList from "../FreshProductList";
import DeliveryAgents from "../DeliveryAgents";
import ShopDetailCard from "../Service/ShopDetailCard";
import Footer from "../Footer";
import Header from "./Header";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const HomePage = () => {
  // Store BOTH: the single shop to show in card, and the shop list array
  const [searchedShop, setSearchedShop] = useState(null); // The main shop to display
  const [searchedShopList, setSearchedShopList] = useState([]); // All results from API
  const [searching, setSearching] = useState(false);

  // Search handler -- passed to LocationSearchBar
  const handleShopSearch = async (searchTerm) => {
    // If blank: clear and show default sections
    if (!searchTerm || !searchTerm.trim()) {
      setSearchedShop(null);
      setSearchedShopList([]);
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(`${API_BASE_URL}/shop/list/shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search: searchTerm }),
      });
      const resData = await response.json();

      let found = null;
      if (
        resData.result &&
        Array.isArray(resData.list) &&
        resData.list.length
      ) {
        // Try exact match first, fallback to first shop
        found =
          resData.list.find(
            (shop) =>
              shop.sh_name &&
              shop.sh_name.toLowerCase().includes(searchTerm.toLowerCase())
          ) || resData.list[0];

        setSearchedShopList(resData.list); // Save the sidebar shops data
      } else {
        setSearchedShopList([]);
      }

      setSearchedShop(found || { error: "No matching shop found." });
    } catch (e) {
      setSearchedShopList([]);
      setSearchedShop({ error: "Failed to fetch shop. Try again." });
    }
    setSearching(false);
  };

  // Handle shop card click from ShopCard component
  const handleShopCardClick = async (shopId) => {
    setSearching(true);
    try {
      // Fetch all shops to get the full shop list for sidebar
      const response = await fetch(`${API_BASE_URL}/shop/list/shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Empty search to get all shops
      });
      const resData = await response.json();

      if (
        resData.result &&
        Array.isArray(resData.list) &&
        resData.list.length
      ) {
        // Find the clicked shop
        const clickedShop = resData.list.find((shop) => shop.sh_id === shopId);

        if (clickedShop) {
          setSearchedShop(clickedShop);
          setSearchedShopList(resData.list); // Set full list for sidebar
        } else {
          setSearchedShop({ error: "Shop not found." });
          setSearchedShopList([]);
        }
      } else {
        setSearchedShop({ error: "No shops available." });
        setSearchedShopList([]);
      }
    } catch (e) {
      setSearchedShop({ error: "Failed to fetch shop details. Try again." });
      setSearchedShopList([]);
    }
    setSearching(false);
  };

  // NEW: Handle similar shop click from ShopDetailCard
  const handleSimilarShopClick = async (shopId) => {
    setSearching(true);
    try {
      // Check if the shop is already in our current list
      const existingShop = searchedShopList.find(
        (shop) => shop.sh_id === shopId
      );

      if (existingShop) {
        // Shop is already in the list, just switch to it
        setSearchedShop(existingShop);
        setSearching(false);
        return;
      }

      // Fetch fresh data to ensure we have the latest shop info
      const response = await fetch(`${API_BASE_URL}/shop/list/shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // Empty search to get all shops
      });
      const resData = await response.json();

      if (
        resData.result &&
        Array.isArray(resData.list) &&
        resData.list.length
      ) {
        const selectedShop = resData.list.find((shop) => shop.sh_id === shopId);

        if (selectedShop) {
          setSearchedShop(selectedShop);
          setSearchedShopList(resData.list);
        } else {
          setSearchedShop({ error: "Shop not found." });
        }
      } else {
        setSearchedShop({ error: "No shops available." });
        setSearchedShopList([]);
      }
    } catch (e) {
      console.error("Error fetching similar shop:", e);
      setSearchedShop({ error: "Failed to fetch shop details. Try again." });
    }
    setSearching(false);
  };

  // NEW: Handle similar service click from ShopDetailCard
  const handleSimilarServiceClick = async (shopId) => {
    console.log({ shopId }, "service");
    handleSimilarShopClick(shopId);
  };

  //----------------------------
  // Modal States
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] =
    useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userData, setUserData] = useState(null);

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

  const [userEmail, setUserEmail] = useState("");

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

  // Called from ConfirmIdentityModal on success
  const handleConfirmEmail = (email) => {
    setUserEmail(email); // Store email for next modal
    setShowIdentityModal(false); // Hide this modal
    setShowEmailVerificationModal(true); // Show next modal
  };

  const handleVerify = () => {
    setShowEmailVerificationModal(false); // Close email modal
    setShowResetModal(true); // Open reset password modal
  };

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

  return (
    <div className="homepage-container">
      {showLoginModal && (
        <LoginModal
          onClose={closeAllModals}
          onForgotPassword={handleForgotPassword}
          onLoginSuccess={handleLoginSuccess}
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

      <Header />

      <div className="homepage-hero">
        <LocationSearchBar onSearch={handleShopSearch} />
      </div>

      {/* On search, show shop detail card with sidebars; else show sections */}
      {searching ? (
        <div style={{ padding: 44, textAlign: "center" }}>Searching...</div>
      ) : searchedShop ? (
        <div className="shop-list-section">
          {searchedShop.error ? (
            <div style={{ padding: 40, textAlign: "center", color: "#F43F5E" }}>
              {searchedShop.error}
            </div>
          ) : (
            <ShopDetailCard
              shop={searchedShop}
              shopsList={searchedShopList}
              userId={userData?.id}
              onSimilarShopClick={handleSimilarShopClick}
              onSimilarServiceClick={handleSimilarServiceClick}
              onBackToHome={() => {
                setSearchedShop(null);
                setSearchedShopList([]);
              }}
            />
          )}
        </div>
      ) : (
        <>
          <div className="shop-list-section">
            <ShopCard onShopClick={handleShopCardClick} />
          </div>
          <div className="shop-list-section">
            <FreshProductList />
          </div>
          <div className="shop-list-section">
            <DeliveryAgents />
          </div>
        </>
      )}

      <JoinLeeShop />
      <Footer />
    </div>
  );
};

export default HomePage;
