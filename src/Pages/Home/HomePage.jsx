import React, { useState } from "react";
import "./HomePage.css";
import Header from "./Header";
import Footer from "../Footer";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import ShopCard from "../ShopCard";
import FreshProductList from "../FreshProductList";
import DeliveryAgents from "../DeliveryAgents";
import ShopDetailCard from "../Service/ShopDetailCard";

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
      const response = await fetch(
        `${API_BASE_URL}/shop/list/shop`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ search: searchTerm })
        }
      );
      const resData = await response.json();

      let found = null;
      if (resData.result && Array.isArray(resData.list) && resData.list.length) {
        // Try exact match first, fallback to first shop
        found = resData.list.find(
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
            />
          )}
        </div>
      ) : (
        <>
          <div className="shop-list-section">
            <ShopCard />
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
