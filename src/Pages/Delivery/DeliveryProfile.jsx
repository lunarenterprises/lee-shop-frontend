import React, { useState } from "react";
import "../Home/HomePage.css";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Header from "../Home/Header";
import Footer from "../Footer";
import LocationSearchBar from "../LocationSearchBar";
import ShopCard from "../ShopCard";
import FreshProductList from "../FreshProductList";
import DeliveryAgents from "../DeliveryAgents";
import ShopDetailCard from "../Service/ShopDetailCard";
import DeliveryProfileComponent from "./DeliveryProfileComponent";

const DeliveryProfile = () => {
    return (
        <div className="homepage-container">
            <Header />
            < DeliveryProfileComponent />
            <Footer />
        </div>
    );
};

export default DeliveryProfile;
