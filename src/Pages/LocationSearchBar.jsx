import React from "react";
import "./LocationSearchBar.css";

const LocationSearchBar = () => {
  return (
    <div className="location-search-container">
      <div className="location-input">
        <span className="location-icon">📍</span>
        <span className="location-text">Bangalore, Karnataka, India</span>
        <span className="dropdown-icon">▼</span>
      </div>
      <div className="search-input-group">
        <input
          type="text"
          className="search-input"
          placeholder="Search Services, Shops ..."
        />
        <button className="search-button">Search</button>
      </div>
    </div>
  );
};

export default LocationSearchBar;
