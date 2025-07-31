import React, { useState, useRef } from "react";
import "./LocationSearchBar.css";

const locations = [
  { label: "Bangalore, Karnataka, India", value: "bangalore" },
  { label: "Mumbai, Maharashtra, India", value: "mumbai" },
  { label: "Delhi, India", value: "delhi" },
  { label: "Chennai, Tamil Nadu, India", value: "chennai" },
];

const LocationSearchBar = () => {
  const [inputValue, setInputValue] = useState(locations[0].label);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filtered, setFiltered] = useState(locations);
  const containerRef = useRef();

  // Close dropdown if click outside
  React.useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setDropdownOpen(true);
    setFiltered(
      locations.filter((loc) =>
        loc.label.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleOptionClick = (loc) => {
    setInputValue(loc.label);
    setDropdownOpen(false);
  };

  return (
    <div className="location-search-container">
      <div className="location-input" ref={containerRef}>
        <span className="location-icon">📍</span>
        <div className="custom-dropdown">
          <input
            className="location-dropdown location-dropdown-input"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setDropdownOpen(true)}
            autoComplete="off"
            style={{ cursor: "pointer" }}
          />
          {dropdownOpen && (
            <ul className="location-dropdown-list">
              {filtered.length > 0 ? (
                filtered.map((loc) => (
                  <li
                    key={loc.value}
                    className="location-dropdown-option"
                    onClick={() => handleOptionClick(loc)}
                  >
                    {loc.label}
                  </li>
                ))
              ) : (
                <li className="location-dropdown-option empty">No matches</li>
              )}
            </ul>
          )}
        </div>
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
