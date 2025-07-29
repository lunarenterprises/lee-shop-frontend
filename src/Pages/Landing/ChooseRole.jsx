import React from "react";
import "./ChooseRole.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChooseRole = () => {
  const Navigate = useNavigate();
  const handleDeliveryClick = () => {
    Navigate("/DeliveryAgentForm");
  };
  return (
    <div className="choose-role-container">
      <h2 className="choose-role-heading">Join Lee Shop Choose Your Role</h2>
      <p className="choose-role-subheading">
        Whether you're here to sell, shop, or deliver Lee Shop is built for you.
      </p>
      <div className="role-buttons">
        <button className="role-btn vendor" onClick={() => Navigate("/RegistrationJoin")}>
          Become a <strong>Lee Shop Vendor</strong>
          <ArrowRight size={18} />
        </button>
        <button className="role-btn customer" onClick={() => Navigate("/HomePage")}>
          Create Your <strong>Customer Account</strong>
          <ArrowRight size={18} />
        </button>
        <button className="role-btn delivery" onClick={handleDeliveryClick}>
          Join as a <strong>Delivery Partner</strong>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;
