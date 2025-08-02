import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Upload } from "lucide-react";
import "./UploadProfilePicture.css";

const UploadProfilePicture = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Only enable Next if a profile picture is selected
  const allFilled = !!profile;

  const handleNext = () => {
    window.deliveryAgentProfileFile = profile;
    navigate("/DeliveryContactInformation");
  };

  return (
    <div className="upload-profile-container">
      <div className="upload-left-panel">
        <img src="/Deliveryimage21.png" alt="Profile" />
      </div>
      <div className="upload-right-panel">
        <div className="progress-bar">
          <span className="circle completed"></span>
          <span className="line completed"></span>
          <span className="circle completed"></span>
          <span className="line"></span>
          <span className="circle current"></span>
        </div>
        <h2 className="upload-heading">
          <span className="arrow-symbol">▶</span> Upload Profile Picture
        </h2>
        <div className="upload-box">
          <Upload size={32} />
          <p>
            Please Upload a Profile picture <br />
            <small>JPEG, PNG, & formats up to 50 MB</small>
          </p>
          <label className="choose-file-btn">
            Choose a file
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={e => setProfile(e.target.files[0])}
              required
            />
          </label>
          {profile && (
            <div style={{ marginTop: 10, color: "#444", fontSize: 13 }}>
              Selected: {profile.name}
            </div>
          )}
        </div>
        <div className="action-buttons">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
          <button
            className="next-btn"
            type="button"
            onClick={handleNext}
            disabled={!allFilled}
            style={{ opacity: allFilled ? 1 : 0.5, cursor: allFilled ? "pointer" : "not-allowed" }}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
