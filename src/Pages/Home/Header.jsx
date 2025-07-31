import React from "react";
import { useLocation, Link } from "react-router-dom";
import "./HomePage.css";
import { FaBell, FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";

const navItems = [
  { href: "/NearbyShop", label: "Find your Local shop" },
  { href: "/NearbyService", label: "Find Nearby services" },
  { href: "/AssignDelivery", label: "Assign your Delivery Agent" },
];

const Header = () => {
  const location = useLocation();

  return (
    <div>
      <header className="homepage-header">
        <div className="homepage-logo">LOGO</div>
        <nav className="homepage-nav">
          {navItems.map((item) => (
            <Link
              to={item.href}
              className={`homepage-menu-item${location.pathname === item.href ? " active" : ""}`}
              key={item.href}
            >
              {item.label} <span>&#9662;</span>
            </Link>
          ))}
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
