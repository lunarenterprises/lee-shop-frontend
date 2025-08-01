import React from "react";
import "./UploadProfilePicture.css";
import { ArrowRight, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UploadProfilePicture = () => {
  const navigate = useNavigate();

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
            <small>JPEG, PNG, & formats upto 50 MB</small>
          </p>
          <label className="choose-file-btn">
            Choose a file
            <input type="file" hidden />
          </label>
        </div>

        <div className="action-buttons">
          <button className="back-btn">Back</button>
          <button className="skip-btn">Skip</button>
          <button
            className="next-btn"
            onClick={() => navigate("/DeliveryContactInformation")}
          >
            Next <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProfilePicture;
