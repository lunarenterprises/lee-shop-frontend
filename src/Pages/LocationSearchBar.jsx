import React, { useState } from "react";
import "./LocationSearchBar.css";

const LocationSearchBar = ({ onSearch, onLocationChange }) => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(
    "Bangalore, Karnataka, India"
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const locations = [
    "Bangalore, Karnataka, India",
    "Mumbai, Maharashtra, India",
    "Delhi, India",
    "Chennai, Tamil Nadu, India",
    "Kolkata, West Bengal, India",
    "Hyderabad, Telangana, India",
    "Pune, Maharashtra, India",
    "Ahmedabad, Gujarat, India",
    "Jaipur, Rajasthan, India",
    "Kochi, Kerala, India",
    "Thiruvananthapuram, Kerala, India",
    "Kozhikode, Kerala, India",
    "Thrissur, Kerala, India",
    "Alappuzha, Kerala, India",
    "Palakkad, Kerala, India",
    "Kannur, Kerala, India",
    "Kottayam, Kerala, India",
    "Malappuram, Kerala, India",
    "Kollam, Kerala, India",
  ];

  // Fires whenever the search term changes/clears
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    if (!e.target.value.trim() && onSearch) onSearch(""); // When cleared
  };

  // When the user submits
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();

    // Extract the first word before the first comma
    const city = selectedLocation.split(",")[0].trim();

    if (onSearch) onSearch(search.trim(), city);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setIsDropdownOpen(false);
    if (onLocationChange) onLocationChange(location);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="location-search-main">
      {/* Header */}
      <h1 className="location-search-title">Find Shops & Services Near You.</h1>

      <div className="location-search-container">
        {/* Location Selector */}
        <div className="location-selector-container">
          <div className="custom-dropdown">
            <button
              className="location-input"
              onClick={toggleDropdown}
              type="button"
            >
              <div className="location-content">
                {/* Location Icon */}
                <svg
                  width="18"
                  height="21.83"
                  viewBox="0 0 18 23"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 0.5C11.3869 0.5 13.6761 1.44821 15.364 3.13604C17.0518 4.82387 18 7.11305 18 9.5C18 12.574 16.324 15.09 14.558 16.895C13.6757 17.7871 12.7129 18.5958 11.682 19.311L11.256 19.601L11.056 19.734L10.679 19.974L10.343 20.179L9.927 20.421C9.64463 20.5822 9.32513 20.6669 9 20.6669C8.67487 20.6669 8.35537 20.5822 8.073 20.421L7.657 20.179L7.137 19.859L6.945 19.734L6.535 19.461C5.42283 18.7085 4.3869 17.8491 3.442 16.895C1.676 15.089 0 12.574 0 9.5C0 7.11305 0.948211 4.82387 2.63604 3.13604C4.32387 1.44821 6.61305 0.5 9 0.5ZM9 6.5C8.60603 6.5 8.21593 6.5776 7.85195 6.72836C7.48797 6.87913 7.15726 7.1001 6.87868 7.37868C6.6001 7.65726 6.37913 7.98797 6.22836 8.35195C6.0776 8.71593 6 9.10603 6 9.5C6 9.89397 6.0776 10.2841 6.22836 10.6481C6.37913 11.012 6.6001 11.3427 6.87868 11.6213C7.15726 11.8999 7.48797 12.1209 7.85195 12.2716C8.21593 12.4224 8.60603 12.5 9 12.5C9.79565 12.5 10.5587 12.1839 11.1213 11.6213C11.6839 11.0587 12 10.2956 12 9.5C12 8.70435 11.6839 7.94129 11.1213 7.37868C10.5587 6.81607 9.79565 6.5 9 6.5Z"
                    fill="#A5E830"
                  />
                </svg>
                <span>{selectedLocation}</span>
              </div>
              {/* Dropdown Arrow */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.79005 8.50017H16.2101C16.5425 8.49969 16.8682 8.59336 17.1496 8.77033C17.431 8.94731 17.6565 9.20035 17.8001 9.50017C17.9681 9.85592 18.0328 10.2517 17.9868 10.6424C17.9409 11.0332 17.7861 11.4031 17.5401 11.7102L13.3301 16.8102C13.1648 17.0008 12.9606 17.1537 12.7311 17.2585C12.5016 17.3633 12.2523 17.4175 12.0001 17.4175C11.7478 17.4175 11.4985 17.3633 11.269 17.2585C11.0395 17.1537 10.8353 17.0008 10.6701 16.8102L6.46005 11.7102C6.21404 11.4031 6.05924 11.0332 6.01327 10.6424C5.9673 10.2517 6.03202 9.85592 6.20005 9.50017C6.34359 9.20035 6.56911 8.94731 6.8505 8.77033C7.13189 8.59336 7.45764 8.49969 7.79005 8.50017Z"
                  fill="#A5E830"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <ul className="location-dropdown-list">
                {locations.map((location, index) => (
                  <li
                    key={index}
                    className={`location-dropdown-option ${
                      location === selectedLocation ? "active" : ""
                    }`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    {location}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-input-group">
          <div className="search-input-container">
            {/* Search Icon */}
            <svg
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M21.5 21.5002L17.157 17.1572M17.157 17.1572C17.8998 16.4143 18.4891 15.5324 18.8912 14.5618C19.2932 13.5911 19.5002 12.5508 19.5002 11.5002C19.5002 10.4496 19.2932 9.40929 18.8912 8.43866C18.4891 7.46803 17.8998 6.58609 17.157 5.84321C16.4141 5.10032 15.5321 4.51103 14.5615 4.10898C13.5909 3.70693 12.5506 3.5 11.5 3.5C10.4494 3.5 9.40905 3.70693 8.43842 4.10898C7.46779 4.51103 6.58585 5.10032 5.84296 5.84321C4.34263 7.34354 3.49976 9.37842 3.49976 11.5002C3.49976 13.622 4.34263 15.6569 5.84296 17.1572C7.34329 18.6575 9.37818 19.5004 11.5 19.5004C13.6217 19.5004 15.6566 18.6575 17.157 17.1572Z"
                stroke="#0A5C15"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search Services, Shops ..."
              value={search}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit(e)}
            />
          </div>
          <button
            className="search-button"
            onClick={handleSearchSubmit}
            type="button"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSearchBar;
