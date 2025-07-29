import React from "react";
import "./LocalBusinessPromo.css";

const LocalBusinessPromo = () => {
  return (
    <div className="promo-container">
      <div className="promo-images">
        <img src="/img1.jpg" alt="Shop 1" className="promo-img top-left" />
        <img src="/img2.jpg" alt="Shop 2" className="promo-img top-right" />
        <img src="/img3.jpg" alt="Shop 3" className="promo-img middle-left" />
        <img src="/img4.jpg" alt="Shop 4" className="promo-img middle-right" />
        <img src="/img5.jpg" alt="Shop 5" className="promo-img bottom-left" />
        <img src="/img6.jpg" alt="Shop 6" className="promo-img bottom-right" />
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
        <button className="get-started-btn">
          Get started now <span className="arrow">➜</span>
        </button>
      </div>
    </div>
  );
};

export default LocalBusinessPromo;
