import React from "react";
import { useNavigate } from "react-router-dom";
import "./JoinLeeShop.css";

const JoinLeeShop = () => {
  const navigate = useNavigate();

  const handleShopOwnerClick = () => {
    // Clear userData from localStorage
    localStorage.removeItem("userData");
    // Navigate to registration page
    navigate("/RegistrationJoin");
  };

  const handleServiceProviderClick = () => {
    // Clear userData from localStorage
    localStorage.removeItem("userData");
    // Navigate to registration page
    navigate("/RegistrationJoin");
  };

  const handleDeliveryAgentClick = () => {
    // Clear userData from localStorage
    localStorage.removeItem("userData");
    // Navigate to delivery agent form
    navigate("/DeliveryAgentForm");
  };

  return (
    <div className="joinlee-container">
      <h2 className="joinlee-title">Become a Part of LeeShop</h2>
      <p className="joinlee-subtitle">
        Whether you run a store, provide a service, or want to earn as a
        delivery partner
        <br />
        LeeShop is the platform for you.
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
          <button className="joinlee-button" onClick={handleShopOwnerClick}>
            Register as a Shop Owner
          </button>
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
          <button className="joinlee-button" onClick={handleServiceProviderClick}>
            Register as a Service Provider
          </button>
        </div>

        <div className="joinlee-card">
          <h3>
            <span className="joinlee-icon">▶</span> Deliver and Earn Flexibly
          </h3>
          <p>Become a freelance delivery partner.</p>
          <button className="joinlee-button" onClick={handleDeliveryAgentClick}>
            Join as a Delivery Agent
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinLeeShop;