// ChooseRole.jsx
import React, { useState } from "react";
import "./ChooseRole.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignUpModal from "../Home/SignUpModal";

const ChooseRole = () => {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="choose-role-container">
      <h2 className="choose-role-heading">Join Lee Shop – Choose Your Role</h2>
      <p className="choose-role-subheading">
        Whether you're here to sell, shop, or deliver, Lee Shop is built for you.
      </p>

      <div className="role-buttons">
        {/* Vendor – keep normal navigation */}
        <button
          className="role-btn vendor"
          onClick={() => navigate("/RegistrationJoin")}
        >
          Become a <strong>Lee Shop Vendor</strong>
          <ArrowRight size={18} />
        </button>

        {/* Customer – open Sign-up modal */}
        <button
          className="role-btn customer"
          onClick={() => setShowSignUp(true)}
        >
          Create Your <strong>Customer Account</strong>
          <ArrowRight size={18} />
        </button>

        {/* Delivery partner – keep navigation */}
        <button
          className="role-btn delivery"
          onClick={() => navigate("/DeliveryAgentForm")}
        >
          Join as a <strong>Delivery Partner</strong>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ---------- Sign-up modal ---------- */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
        /* If you want to redirect after successful signup,
           add onSuccess={() => navigate('/UserProfile')} inside the modal */
        />
      )}
    </div>
  );
};

export default ChooseRole;
