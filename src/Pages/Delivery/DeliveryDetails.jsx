import React from "react";
import "./DeliveryDetails.css";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DeliveryDetails = () => {
  const navigate = useNavigate();

  return (
    <div className="delivery-details-container">
      <div className="left-panel">
        <img
          src="/Deliveryimage2.png"
          alt="Delivery"
          className="delivery-image"
        />
      </div>

      <div className="right-panel">
        <div className="stepper">
          <span className="dot completed" />
          <hr />
          <span className="dot active" />
          <hr />
          <span className="dot" />
        </div>

        <p className="registration-header">Delivery Agent Registration.</p>
        <h2 className="form-title">▸ Delivery Details</h2>

        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type</label>
          <div className="dropdown-input">
            <input type="text" placeholder="Enter your Email" />
            <ChevronDown size={18} />
          </div>
        </div>

        <div className="form-group">
          <label>Are you available full-time or part-time?</label>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="availability" defaultChecked />
              <span>Full-time</span>
            </label>
            <label className="radio-option">
              <input type="radio" name="availability" />
              <span>Part-time</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Upload Driving License</label>
          <div className="file-upload">
            <p>Drag and drop your Driving License or</p>
            <span className="file-note">
              JPEG, PNG, PDF & formats upto 50 MB
            </span>
            <button className="upload-btn">Choose a file</button>
          </div>
        </div>

        <div className="form-actions">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
          <button
            className="next-btn"
            onClick={() => navigate("/uploadProfilePicture")}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
