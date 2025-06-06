import React from "react";
import "./HomePage.css";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import ShopCard from "./ShopCard";
import FreshProductList from "./FreshProductList";
import Footer from "./Footer";
import Header from "./Header";

const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-hero">
        <div className="homepage-containers-inner">
          <h2>Find Shops & Products Near You.</h2>
          <div className="homepage-location">
            <FaMapMarkerAlt className="location-icon" />
            <span>Bangalore, Karnataka, India</span>
            <span className="dropdown-arrow">&#9662;</span>
          </div>
        </div>
        <div className="homepage-search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search Services, Shops ..." />
          <button className="homepage-search-btn">Search</button>
        </div>
      </div>
      <div className="shop-list-section">
        <ShopCard />
      </div>

      <div className="shop-list-section">
        <FreshProductList />
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
