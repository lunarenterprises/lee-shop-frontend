import React, { useState } from "react";
import "./ServiceRegistration.css";
import { useNavigate } from "react-router-dom";

const ServiceRegistration = () => {
  const [categoriesVisible, setCategoriesVisible] = useState(false);
    const Navigate = useNavigate();
  const businessCategories = [
    "Salon", "Cleaning", "Tailoring & Fashion Services", "Home Repairs",
    "Moving Services", "Health", "Education", "Events",
    "Pet Care", "Beauty", "Consulting", "Marketing", "Legal Services"
  ];
  const handlenextservice = () => {
    Navigate("/OperationDetails");
  }

  return (
    <div className="service-form-container">
      <div className="left-section">
        <img
          src="/ServiceRegistration-one.png"
          alt="Worker"
          className="worker-image"
        />
        {/* <div className="quote">
          “Strengthen local commerce by connecting nearby sellers, services, and
          customers to promote sustainability.”
        </div> */}
      </div>

      <div className="right-section">
        <div className="header">
          <span className="step-indicator">
            <span className="dot active" />
            <span className="line" />
            <span className="dot" />
            <span className="line" />
            <span className="dot" />
          </span>
          <span className="step-title">Service Registration.</span>
        </div>

        <h2>Basic Service & Shop Location Info</h2>

        <div className="form-row">
          <input type="text" placeholder="Enter your Shop Name." />
          <input type="text" placeholder="Enter Owner Name." />
        </div>

        <div className="business-category">
          <label>Business Category</label>
          <div className="categories">
            {businessCategories
              .slice(0, categoriesVisible ? businessCategories.length : 12)
              .map((cat, i) => (
                <button key={i} className="category-button">
                  {cat}
                </button>
              ))}
            {!categoriesVisible && (
              <button
                className="category-button view-more"
                onClick={() => setCategoriesVisible(true)}
              >
                View more
              </button>
            )}
          </div>
        </div>

        <input
          type="text"
          className="full-width-input"
          placeholder="Enter your Shop Address."
        />

        <div className="form-row">
          <input type="text" placeholder="Enter your State your shop in." />
          <input type="text" placeholder="Enter your State your shop in." />
        </div>

        <div className="button-row">
          <button className="back-button">Back</button>
          <button className="skip-button">Skip</button>
          <button onClick={handlenextservice()} className="next-button">Next ➝</button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRegistration;
