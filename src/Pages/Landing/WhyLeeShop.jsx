import React from "react";
import "./WhyLeeShop.css";
import { PackageCheck, Truck, User } from "lucide-react";

const WhyLeeShop = () => {
  return (
    <div className="leeshop-why">
      <section className="why-lee-shop">
        <h2>Why LeeShop?</h2>
        <p>
          We bring together local shop owners, freelance delivery partners, and nearby
          customers in one smart, easy-to-use system. Whether you’re a product seller,
          a service provider, a delivery partner, or simply someone who loves to shop
          local – LeeShop is built for you.
        </p>

        {/* Dashed line image behind steps */}
        <img
          src="/Vector6.png"
          alt="Flow Line"
          className="dashed-line-image"
        />
      </section>

      <div className="steps-container">
        <div className="step-card">
          <div className="icon-wrapper">
            <PackageCheck size={24} />
          </div>
          <span>Packaged by your neighbourhood shop</span>
        </div>

        <div className="step-card center">
          <div className="icon-wrapper">
            <Truck size={24} />
          </div>
          <span>Delivered by a local partner</span>
        </div>

        <div className="step-card">
          <div className="icon-wrapper">
            <User size={24} />
          </div>
          <span>Received by a satisfied customer</span>
        </div>
      </div>
    </div>
  );
};

export default WhyLeeShop;
