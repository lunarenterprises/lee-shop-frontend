import React from "react";
import "./DeliveryAgentForm.css";
import { ChevronRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeliveryAgentForm = () => {
  const Navigate = useNavigate();
  const handleclicknext = () => {
    Navigate("/DeliveryDetails");
  };
  return (
    <div className="form-container">
      <div className="left-panel">
        <img
          src="/DeliveryImage.png" // replace with actual image path
          alt="Delivery Guy"
          className="form-image"
        />
        {/* <p className="quote">
          “Strengthen local commerce by connecting nearby sellers, services, and
          customers to promote sustainability.”
        </p> */}
      </div>

      <div className="right-panel">
        <p className="step-title">Delivery Agent Registration.</p>

        <div className="progress-bar">
          <span className="step active"></span>
          <span className="step active"></span>
          <span className="step"></span>
          <span className="step"></span>
        </div>

        <h2 className="section-title">▶ Personal Information</h2>

        <form className="form-fields">
          <label>
            Full Name*
            <input type="text" placeholder="Enter your Name." />
          </label>

          <label>
            Mobile Number*
            <div className="input-group">
              <span className="country-code">🇮🇳 +91</span>
              <input type="tel" placeholder="Mobile Number" />
            </div>
          </label>

          <label>
            What's app Number
            <input type="tel" placeholder="+91" />
          </label>

          <label>
            Email Address
            <input type="email" placeholder="Enter your Email." />
          </label>

          <label>
            Choose your Location
            <div className="input-group">
              <MapPin size={18} />
              <input type="text" placeholder="Enter your Location" />
            </div>
          </label>
        </form>

        <div className="form-buttons">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
          <button onClick={() => handleclicknext()} className="next-btn">
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAgentForm;
