import React from "react";
import "./NearbyService.css";
import "../Home/HomePage.css"
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Footer from "../Footer";
import Header from "../Home/Header";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import ServiceList from "../ServiceList";
const NearbyService = () => {
    return (
        <div className="homepage-container">
            <Header />
            <div className="homepage-hero">
                <LocationSearchBar />
            </div>
            <div className="shop-list-section">
                <ServiceList />
            </div>
            {/* <div className="shop-list-section"> */}
            <JoinLeeShop />
            {/* </div> */}
            <Footer />
        </div>
    );
};

export default NearbyService;
