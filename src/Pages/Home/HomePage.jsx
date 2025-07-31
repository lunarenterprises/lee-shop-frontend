import React from "react";
import "./HomePage.css";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import ShopCard from "../ShopCard";
import FreshProductList from "../FreshProductList";
import Footer from "../Footer";
import Header from "./Header";
import DeliveryAgents from "../DeliveryAgents";
import JoinLeeShop from "../JoinLeeShop";
import ListingCard from "./ListingCard";
import LocationSearchBar from "../LocationSearchBar";
const HomePage = () => {
  return (
    <div className="homepage-container">
      <Header />
      <div className="homepage-hero">
        <LocationSearchBar />

        {/* <ListingCard /> */}
      </div>
      <div className="shop-list-section">
        <ShopCard />
      </div>

      <div className="shop-list-section">
        <FreshProductList />
      </div>
      <div className="shop-list-section">
        <DeliveryAgents />
      </div>
      {/* <div className="shop-list-section"> */}
      <JoinLeeShop />
      {/* </div> */}
      <Footer />
    </div>
  );
};

export default HomePage;
