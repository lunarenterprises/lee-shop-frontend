import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegistrationJoin from "../Registration/RegistrationJoin/RegistrationJoin";
import BusinessRegistrationForm from "../Registration/BusinessRegistrationForm";
import BusinessOperatingDetails from "../Registration/BusinessOperatingDetails";
import BrandingRegistrationForm from "../Registration/BrandingRegistrationform";
import ContactInfoForm from "../Registration/ContactInfoForm";
import ShopProfileLayout from "../ShopProfileLayout";
import ServiceRegistration from "../Service/ServiceRegistration";
import OperationDetails from "../Service/OperatingDetails";
import ServiceRegistrationForm from "../Service/ServiceRegistrationForm";
import ServiceContactPage from "../Service/ServiceContactPage";
import BothRegistrationForm from "../../Both/BothRegistrationForm";
import BothBusinessOperatingDetails from "../../Both/BothBusinessOperatingDetails";
import Landingpagelayout from "../Landing/Landingpagelayout";
import DeliveryAgentForm from "../Delivery/DeliveryAgentForm";
import DeliveryDetails from "../Delivery/DeliveryDetails";
import UploadProfilePicture from "../Delivery/UploadProfilePicture";
import DeliveryContactInformation from "../Delivery/DeliveryContactInformation";
import FreshProductList from "../FreshProductList";
import ShopCard from "../ShopCard";
import DeliveryAgents from "../DeliveryAgents";
import HomePage from "../Home/HomePage";

function Path() {
  return (
    <div>
      <Router>
        <Routes>
          {/* Landingpagelayout */}
          <Route path="/" element={<Landingpagelayout />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/RegistrationJoin" element={<RegistrationJoin />} />
          <Route
            path="/BusinessRegistrationForm"
            element={<BusinessRegistrationForm />}
          />
          <Route
            path="/ServiceRegistration"
            element={<ServiceRegistration />}
          />
          <Route path="/OperationDetails" element={<OperationDetails />} />
          <Route path="/ServiceContactPage" element={<ServiceContactPage />} />
          <Route
            path="/BothRegistrationForm"
            element={<BothRegistrationForm />}
          />
          <Route
            path="/BothBusinessOperatingDetails"
            element={<BothBusinessOperatingDetails />}
          />
          <Route path="/DeliveryAgentForm" element={<DeliveryAgentForm />} />
          <Route
            path="/DeliveryDetails"
            element={<DeliveryDetails />}

          />

          <Route
            path="/uploadProfilePicture"
            element={<UploadProfilePicture />}

          />

          <Route
            path="/ServiceRegistrationForm"
            element={<ServiceRegistrationForm />}
          />
          <Route
            path="/BusinessOperatingDetails"
            element={<BusinessOperatingDetails />}
          />
          <Route
            path="/BrandingRegistrationform"
            element={<BrandingRegistrationForm />}
          />
          <Route path="/ContactInfoform" element={<ContactInfoForm />} />
          <Route path="/ShopProfileLayout" element={<ShopProfileLayout />} />
          <Route path="/DeliveryContactInformation" element={<DeliveryContactInformation />} />
          {/* /DeliveryContactInformation */}
        </Routes>
      </Router>
    </div>
  );
}

export default Path;
