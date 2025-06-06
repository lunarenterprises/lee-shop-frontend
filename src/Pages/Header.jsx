import React from "react";
import "./HomePage.css";
import { FaBell, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";

const Header = () => {
  return (
    <div>
      <header className="homepage-header">
        <div className="homepage-logo">LOGO</div>
        <nav className="homepage-nav">
          <div className="homepage-menu-item">
            Groceries <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Food & Beverages <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Home <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Fashion <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Electronics <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Beauty <span>&#9662;</span>
          </div>
          <div className="homepage-menu-item">
            Health <span>&#9662;</span>
          </div>
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
