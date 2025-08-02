import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryDetails.css";
import { ArrowRight, ChevronDown } from "lucide-react";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const [vehicle_type, setVehicleType] = useState("");
  const [work_type, setWorkType] = useState("Full-time");
  const [licence, setLicence] = useState(null);

  // Only enable Next when ALL fields are filled (truthy)
  const allFilled = vehicle_type && work_type && licence;

  const handleNext = () => {
    const saved = JSON.parse(localStorage.getItem("deliveryAgentData") || "{}");
    localStorage.setItem("deliveryAgentData", JSON.stringify({
      ...saved,
      vehicle_type,
      work_type,
    }));
    window.deliveryAgentLicenceFile = licence;
    navigate("/uploadProfilePicture");
  };

  return (
    <div className="delivery-details-container">
      <div className="left-panel">
        {/* ...your image/quote... */}
        <img src="/Deliveryimage2.png" alt="Delivery" className="delivery-image" />
      </div>
      <div className="right-panel">
        {/* ...stepper, headers... */}
        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type*</label>
          <div className="dropdown-input">
            <input
              value={vehicle_type}
              onChange={e => setVehicleType(e.target.value)}
              placeholder="e.g. Motorcycle"
              required
            />
            <ChevronDown size={18} />
          </div>
        </div>
        <div className="form-group">
          <label>Are you available full-time or part-time?*</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="work_type"
                checked={work_type === "Full-time"}
                onChange={() => setWorkType("Full-time")}
                required
              />
              <span>Full-time</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="work_type"
                checked={work_type === "Part-time"}
                onChange={() => setWorkType("Part-time")}
                required
              />
              <span>Part-time</span>
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Upload Driving License*</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={e => setLicence(e.target.files[0])}
            required
          />
        </div>
        <div className="form-actions">
          <button
            className="next-btn"
            type="button"
            onClick={handleNext}
            disabled={!allFilled}
            style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
          >
            Next <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;
