import React, { useEffect, useState } from "react";
import "../Home/HomePage.css";
import Header from "../Home/Header";
import Footer from "../Footer";
import LocationSearchBar from "../LocationSearchBar";
import ShopDetailCard from "../Service/ShopDetailCard";
import ServiceProfileComponent from "./ServiceProfileComponent";
const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const ServiceProfile = () => {
  // Store BOTH: the single shop to show in card, and the shop list array
  const [searchedShop, setSearchedShop] = useState(null); // The main shop to display
  const [searchedShopList, setSearchedShopList] = useState([]); // All results from API
  const [searching, setSearching] = useState(false);
  const [userData, setUserData] = useState(null);

  // Search handler -- passed to LocationSearchBar
  const handleShopSearch = async (searchTerm, location = "Bangalore") => {
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
        body: JSON.stringify({ search: searchTerm, city: location }),
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

  return (
    <div className="homepage-container">
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
            // <<< Pass the full list for the sidebar, main shop as prop
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
          <ServiceProfileComponent />
        </>
      )}
      <Footer />
    </div>
  );
};

export default ServiceProfile;
