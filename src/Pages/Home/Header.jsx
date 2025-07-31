import React from "react";
import "./HomePage.css";
import { FaBell, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <div>
      <header className="homepage-header">
        <div className="homepage-logo">LOGO</div>
        <nav className="homepage-nav">
          <a href="NearbyShop" className="homepage-menu-item">
            Find your Local shop <span>&#9662;</span>
          </a>
          <a href="/NearbyService" className="homepage-menu-item">
            Find Nearby services <span>&#9662;</span>
          </a>
          <a href="/AssignDelivery" className="homepage-menu-item">
            Assign your Delivery Agent <span>&#9662;</span>
          </a>
        </nav>
        <div className="homepage-icons">
          <div className="homepage-icon-wrapper">
            <FaBell />
            <span className="badge">1</span>
          </div>
          <div className="homepage-icon-wrapper">
            <FaHeart />
            <span className="badge">3</span>
          </div>
          <div className="homepage-icon-wrapper">
            <FaShoppingCart />
          </div>
          <div className="homepage-icon-wrapper">
            <FaUser />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
