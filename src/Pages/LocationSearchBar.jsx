import React, { useState } from "react";
import "./LocationSearchBar.css";

const LocationSearchBar = ({ onSearch }) => {
  const [search, setSearch] = useState("");

  // Fires whenever the search term changes/clears
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (!e.target.value.trim() && onSearch) onSearch(""); // When cleared
  };

  // When the user submits
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(search.trim());
  };

  return (
    <div className="location-search-container">
      <form className="search-input-group" onSubmit={handleSearchSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          className="search-input"
          placeholder="Search Services, Shops ..."
          value={search}
          onChange={handleSearchChange}
        />
        <button className="search-button" type="submit">
          Search
        </button>
      </form>
    </div>
  );
};

export default LocationSearchBar;
