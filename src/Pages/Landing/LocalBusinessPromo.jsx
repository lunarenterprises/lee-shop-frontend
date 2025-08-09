import React from "react";
import "./LocalBusinessPromo.css";

const LocalBusinessPromo = ({ onLoginClick }) => {
  return (
    <div className="promo-container">
      <div className="promo-images">
        <img src="/right1.png" alt="Shop 1" className="promo-img top-left" />
        <img src="/right2.png" alt="Shop 2" className="promo-img top-right" />
        <img src="right3.png" alt="Shop 3" className="promo-img middle-left" />
        <img src="/left1.png" alt="Shop 4" className="promo-img middle-right" />
        <img src="/left2.png" alt="Shop 5" className="promo-img bottom-left" />
        <img src="/left3.png" alt="Shop 6" className="promo-img bottom-right" />
      </div>

      <div className="promo-content">
        <h1>
          Take Your Local Business Online – Sell <br />
          Products, Offer Services, or Shop Locally
        </h1>
        <p>
          Lee Shop connects local shop owners and service providers with nearby
          customers with flexible delivery powered by freelance partners.
        </p>
        <button className="get-started-btn" onClick={onLoginClick}>
          Get started now <span className="arrow">➜</span>
        </button>
      </div>
    </div>
  );
};

export default LocalBusinessPromo;