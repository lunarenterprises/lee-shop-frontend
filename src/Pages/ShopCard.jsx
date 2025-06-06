import React from "react";
import "./FreshProductList.css";
import { FaHeart, FaPhone, FaWhatsapp } from "react-icons/fa";

const ShopList = [
  {
    name: "CakeZone",
    distance: "1.5 km Away",
    openTime: "Open 7 am to 9 pm",
    rating: 4.5,
    reviews: 120,
    color: "#FFCACA",
    logoText: "CakeZone",
    whatsapp: true,
    icon: null,
  },
  {
    name: "FreshMart",
    distance: "1.5 km Away",
    openTime: "Open 7 am to 9 pm",
    rating: 4.5,
    reviews: 120,
    color: "#4CAF50",
    logoText: "Freashmart",
    whatsapp: true,
    icon: null,
  },
  {
    name: "FreshMeat",
    distance: "1.5 km Away",
    openTime: "Open 7 am to 9 pm",
    rating: 4.5,
    reviews: 120,
    color: "#fb6f6f",
    logoText: "Freshmeat",
    whatsapp: true,
    icon: "🍗",
  },
  {
    name: "Threads",
    distance: "1.5 km Away",
    openTime: "Open 7 am to 9 pm",
    rating: 4.5,
    reviews: 120,
    color: "#fb6f6f",
    logoText: "Freshmeat",
    whatsapp: true,
    icon: "🍗",
  },
];

const ShopCard = () => {
  return (
    <div className="product-container">
      <h2 className="product-heading">Find your local fresh product</h2>
      <div className="product-grid">
        {ShopList.map((product, index) => (
          <div className="product-card" key={index}>
            <div
              className="product-logo"
              style={{ backgroundColor: product.color }}
            >
              {product.icon && (
                <div className="product-icon">{product.icon}</div>
              )}
              <div className="product-logo-text">{product.logoText}</div>
            </div>
            <div className="product-details">
              <div className="product-top">
                <span>{product.distance}</span>
                <span className="open-dot"></span>
                <span className="open-time">{product.openTime}</span>
                <div className="wishlist-icon">
                  <FaHeart />
                </div>
              </div>
              <div className="product-name">{product.name}</div>
              <div className="product-rating">
                ⭐ {product.rating} ({product.reviews} Reviews)
              </div>
              <div className="product-actions">
                <button className="call-btn">
                  <FaPhone /> Contact Now
                </button>
                <button className="whatsapp-btn">
                  {" "}
                  <FaWhatsapp /> What’s app
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopCard;
