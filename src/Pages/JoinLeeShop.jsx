import React from "react";
import "./JoinLeeShop.css";

const JoinLeeShop = () => {
  return (
    <div className="joinlee-container">
      <h2 className="joinlee-title">Become a Part of Lee Shop</h2>
      <p className="joinlee-subtitle">
        Whether you run a store, provide a service, or want to earn as a
        delivery partner
        <br />
        Lee Shop is the platform for you.
      </p>

      <div className="joinlee-cards">
        <div className="joinlee-card">
          <h3>
            <span className="joinlee-icon">▶</span> Start Selling Your Products.
          </h3>
          <p>
            Got a grocery shop, boutique, or bakery?
            <br />
            Take your store online.
          </p>
          <button className="joinlee-button">Register as a Shop Owner</button>
        </div>

        <div className="joinlee-card">
          <h3>
            <span className="joinlee-icon">▶</span> Offer Your Services
          </h3>
          <p>
            List your services and reach local
            <br />
            customers.
          </p>
          <button className="joinlee-button">
            Register as a Service Provider
          </button>
        </div>

        <div className="joinlee-card">
          <h3>
            <span className="joinlee-icon">▶</span> Deliver and Earn Flexibly
          </h3>
          <p>Become a freelance delivery partner.</p>
          <button className="joinlee-button">Join as a Delivery Agent</button>
        </div>
      </div>
    </div>
  );
};

export default JoinLeeShop;
