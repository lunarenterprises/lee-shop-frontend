import React from "react";
import "./ListingCard.css";
import {
  FaStar,
  FaHeart,
  FaPhoneAlt,
  FaWhatsapp,
  FaTruck
} from "react-icons/fa";
import { FiMapPin, FiEdit3 } from "react-icons/fi";

const ListingCard = () => {
  return (
    <div className="listing-card">
      {/* ---------- Hero / Banner ---------- */}
      <div className="banner">
        <img
          src="/imageone.png"
          alt="CakeZone banner"
          className="banner-img"
        />

        <span className="badge-distance">1.5km away</span>
        <FaHeart className="icon-heart" />
      </div>

      {/* ---------- Details ---------- */}
      <div className="details">
        {/* Top row: name, rating, meta */}
        <div className="header-info">
          <h2 className="title">Cakezone</h2>

          <div className="rating">
            <FaStar className="star" />
            4.5 <span className="review-count">(120 Reviews)</span>
          </div>

          <div className="meta">
            <FiMapPin /> Panampilly Nagar, Kochi
            <span className="status">• Open 7 am to 9 pm</span>
            <span className="delivery">
              <FaTruck /> Delivery Available
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="actions">
          <button className="btn primary">
            <FaPhoneAlt /> Contact Now
          </button>
          <button className="btn whatsapp">
            <FaWhatsapp /> WhatsApp
          </button>
          <button className="btn edit">
            <FiEdit3 /> Edit
          </button>
        </div>

        {/* ---------- Photo gallery ---------- */}
        <div className="gallery-wrapper">
          {/* ---------- Left: large hero ---------- */}
          <div className="gallery-left">
            <img
              src="/imagetwo.png"
              alt="Assorted pastries on table"
            />
          </div>

          {/* ---------- Right column ---------- */}
          <div className="gallery-right">
            {/* Row 1 — one wide image */}
            <div className="top-image">
              <img
                src="/imagethree.png"
                alt="Pink pastries"
              />
            </div>

            {/* Row 2 — TWO square thumbnails */}
            <div className="bottom-images">
              {/* Left thumbnail */}
              <img
                src="/imagefour.png"
                alt="Chocolate cake slice"
                className="thumb"
              />

              {/* Right thumbnail with +6 overlay */}
              <div className="thumb overlay-container">
                <img
                  src="/imagefive.png"
                  alt="Macarons"
                />
                <span className="overlay-text">+6</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="tabs">
          <button className="tab active">About Us</button>
          <button className="tab">Reviews</button>
        </div>

        {/* ---------- Tab content ---------- */}
        <div className="content">
          <p>
            CakeZone is your go‑to neighborhood bakery known for fresh,
            handcrafted cakes and a cozy, personalized service experience.
            Whether it’s a birthday, celebration, or casual indulgence we bake
            it with care.
          </p>

          <h4>Products and services</h4>
          <ul>
            <li>Customized Birthday Cakes</li>
            <li>Chocolate Truffle, Red Velvet, and Photo Cakes</li>
            <li>Eggless and Sugar‑free Options</li>
            <li>Pre‑orders for Events</li>
          </ul>

          <h4>Opening Hours</h4>
          <p>Open Daily: 7 : 00 AM – 9 : 00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
