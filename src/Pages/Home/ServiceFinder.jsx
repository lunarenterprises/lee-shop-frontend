import { useState, useRef, useEffect } from "react";
import "./ServiceFinder.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  ChevronDown,
  ArrowLeftIcon as LeftArrow,
  ArrowRightIcon as RightArrow,
  Loader2,
} from "lucide-react";
import Header from "./Header";
import Footer from "../Footer";

// Add your API base URL here
const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop"; // Replace with your actual API URL

const ServiceFinder = () => {
  const [selectedLocation, setSelectedLocation] = useState(
    "Bangalore, Karnataka, India"
  );
  const [searchTerm, setSearchTerm] = useState("Dry Cleaning");
  const [activeFilter, setActiveFilter] = useState("Dry Cleaning");

  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  const [urlParams, setUrlParams] = useState({ category: null, type: null });

  // Shop search states
  const [searchedShop, setSearchedShop] = useState(null);
  const [searchedShopList, setSearchedShopList] = useState([]);
  const [searching, setSearching] = useState(false);

  // Function to get URL parameters
  const getUrlParams = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      category: urlParams.get("category"),
      type: urlParams.get("type"),
    };
  };

  // Function to update search terms from URL
  const updateFromUrl = () => {
    const currentUrlParams = getUrlParams();
    setUrlParams(currentUrlParams);

    if (currentUrlParams.category) {
      const decodedCategory = decodeURIComponent(currentUrlParams.category);
      setSearchTerm(decodedCategory);
      setActiveFilter(decodedCategory);
    }
  };

  // Shop search handler
  const handleShopSearch = async (searchTermParam) => {
    const searchQuery = searchTermParam || searchTerm;
    
    // If blank: clear and show default sections
    if (!searchQuery || !searchQuery.trim()) {
      setSearchedShop(null);
      setSearchedShopList([]);
      return;
    }

    setSearching(true);
    try {
      // Determine sh_shop_or_service based on URL type parameter
      const shopOrService = urlParams.type === 'shop' ? 'shop' : 'service';
      
      const requestBody = {
        search: searchQuery.trim(),
        sh_shop_or_service: shopOrService
      };

      const response = await fetch(`${API_BASE_URL}/shop/list/shop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      
      const resData = await response.json();

      let found = null;
      if (
        resData.result &&
        Array.isArray(resData.list) &&
        resData.list.length
      ) {
        // Try exact match first, fallback to first shop
        found =
          resData.list.find(
            (shop) =>
              shop.sh_name &&
              shop.sh_name.toLowerCase().includes(searchQuery.toLowerCase())
          ) || resData.list[0];

        setSearchedShopList(resData.list); // Save the sidebar shops data
      } else {
        setSearchedShopList([]);
      }

      setSearchedShop(found || { error: "No matching shop found." });
    } catch (e) {
      console.error("Shop search error:", e);
      setSearchedShopList([]);
      setSearchedShop({ error: "Failed to fetch shop. Try again." });
    }
    setSearching(false);
  };

  useEffect(() => {
    // Update search terms from URL on mount
    updateFromUrl();

    // Listen for URL changes (back/forward buttons, programmatic navigation)
    const handlePopState = () => {
      updateFromUrl();
    };

    window.addEventListener("popstate", handlePopState);

    // Also listen for any URL changes via pushState/replaceState
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      setTimeout(updateFromUrl, 0);
    };

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args);
      setTimeout(updateFromUrl, 0);
    };

    return () => {
      if (mapRef.current) {
        mapRef.current = null;
      }

      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentParams = getUrlParams();
      if (JSON.stringify(currentParams) !== JSON.stringify(urlParams)) {
        updateFromUrl();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [urlParams]);

  // Auto-search when URL parameters change
  useEffect(() => {
    if (urlParams.category) {
      const decodedCategory = decodeURIComponent(urlParams.category);
      handleShopSearch(decodedCategory);
    }
  }, [urlParams.category, urlParams.type]);

  const resetMap = () => {
    setMapKey((prev) => prev + 1);
  };

  // Handle search button click
  const handleSearchClick = () => {
    handleShopSearch(searchTerm);
  };

  // Handle filter tag click
  const handleFilterClick = (tag) => {
    setActiveFilter(tag);
    setSearchTerm(tag);
    handleShopSearch(tag);
  };

  // Location options for the select dropdown
  const locationOptions = [
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
  ];

  const filterTags = [
    "Dry Cleaning",
    "Bookstores",
    "Grocery Store",
    "Furniture Stores",
    "Pet Shop",
    "Deep Cleaning",
  ];

  const createSvgIcon = (color) => {
    const svg = `
    <svg width="23" height="33" viewBox="0 0 23 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.5 15.6875C10.4226 15.6875 9.38925 15.2595 8.62738 14.4976C7.86551 13.7358 7.4375 12.7024 7.4375 11.625C7.4375 10.5476 7.86551 9.51425 8.62738 8.75238C9.38925 7.99051 10.4226 7.5625 11.5 7.5625C12.5774 7.5625 13.6108 7.99051 14.3726 8.75238C15.1345 9.51425 15.5625 10.5476 15.5625 11.625C15.5625 12.1585 15.4574 12.6868 15.2533 13.1797C15.0491 13.6725 14.7499 14.1204 14.3726 14.4976C13.9954 14.8749 13.5475 15.1741 13.0547 15.3783C12.5618 15.5824 12.0335 15.6875 11.5 15.6875ZM11.5 0.25C8.48316 0.25 5.58989 1.44843 3.45666 3.58166C1.32343 5.71489 0.125 8.60816 0.125 11.625C0.125 20.1562 11.5 32.75 11.5 32.75C11.5 32.75 22.875 20.1562 22.875 11.625C22.875 8.60816 21.6766 5.71489 19.5433 3.58166C17.4101 1.44843 14.5168 0.25 11.5 0.25Z" fill="${color}"/>
    </svg>
  `;

    return L.divIcon({
      html: svg,
      className: "custom-svg-icon",
      iconSize: [23, 33],
      iconAnchor: [11.5, 33],
    });
  };

  const greenIcon = createSvgIcon("#0A5C15");
  const blueIcon = createSvgIcon("#2563eb");

  // Fallback service providers for when no API data is available
  const defaultServiceProviders = [
    {
      id: 1,
      name: "Sparkle Dry Cleaners",
      image: "/dry-cleaning-shop.png",
      distance: "1.2 km",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
    {
      id: 2,
      name: "FreshLook Laundry",
      image: "/laundry-service.png",
      distance: "1.5 km",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
    {
      id: 3,
      name: "Elite Dry Cleaners",
      image: "/modern-laundry-facility.png",
      distance: "1.8 km",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
    {
      id: 4,
      name: "QuickWash Dry Clean",
      image: "/professional-dry-cleaning-equipment.png",
      distance: "2.1 km",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
  ];

  // Use API data if available, otherwise use default data
  const serviceProviders = searchedShopList.length > 0 
    ? searchedShopList.map(shop => ({
        id: shop.sh_id || Math.random(),
        name: shop.sh_name || "Unknown Shop",
        image: shop.sh_image || "/placeholder.svg",
        distance: shop.distance || "N/A",
        hours: shop.sh_hours || "Hours not available",
        rating: shop.sh_rating || 4.0,
        reviews: shop.sh_reviews || 0,
        phone: shop.sh_phone || "N/A",
        whatsapp: shop.sh_whatsapp || shop.sh_phone || "N/A",
        whatsappNumber: shop.sh_whatsapp || shop.sh_phone || "N/A",
      }))
    : defaultServiceProviders;

  // Enhanced map markers with service provider data
  const mapMarkers = [
    ...serviceProviders.slice(0, 3).map((provider, index) => ({
      id: provider.id,
      position: [
        12.9716 + (index * 0.01), 
        77.5946 + (index * 0.015)
      ],
      label: "Service Available",
      type: "service",
      serviceData: provider,
    })),
    {
      id: 999,
      position: [12.97, 77.59],
      label: "Your Location",
      type: "user",
    },
  ];

  // Custom popup component for service providers
  const ServicePopup = ({ serviceData }) => (
    <div
      style={{
        width: "280px",
        backgroundColor: "white",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        border: "none",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Image Section */}
      <div
        style={{
          width: "100%",
          height: "120px",
          backgroundColor: "#f3f4f6",
          overflow: "hidden",
        }}
      >
        <img
          src={serviceData.image || "/placeholder.svg"}
          alt={serviceData.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Content Section */}
      <div style={{ padding: "16px" }}>
        {/* Header with name and distance */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#000000",
              margin: 0,
              lineHeight: "1.2",
            }}
          >
            {serviceData.name}
          </h3>
          <span
            style={{
              fontSize: "14px",
              color: "#6B7280",
              fontWeight: "500",
              whiteSpace: "nowrap",
              marginLeft: "8px",
            }}
          >
            {serviceData.distance}
          </span>
        </div>

        {/* Hours */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#10B981",
              borderRadius: "50%",
              marginRight: "6px",
            }}
          />
          <span style={{ color: "#10B981", fontWeight: "500" }}>
            {serviceData.hours}
          </span>
        </div>

        {/* Rating */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginBottom: "12px",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
              fill="#FCD34D"
            />
          </svg>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#374151",
            }}
          >
            {serviceData.rating}
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#6B7280",
            }}
          >
            ({serviceData.reviews} Reviews)
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Header />

      <div style={{ position: "relative", height: "70vh" }}>
        {/* Interactive Map Background */}
        <MapContainer
          key={mapKey}
          center={[12.9716, 77.5946]}
          zoom={13}
          className="service-finder-map"
          zoomControl={false}
          ref={mapRef}
          whenCreated={(mapInstance) => {
            mapRef.current = mapInstance;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapMarkers.map((marker) => (
            <Marker
              key={`${mapKey}-${marker.id}`}
              position={[marker.position[0], marker.position[1]]}
              icon={marker.type === "user" ? blueIcon : greenIcon}
            >
              <Popup
                closeButton={true}
                className="custom-popup"
                maxWidth={300}
                offset={[0, -10]}
              >
                {marker.type === "service" && marker.serviceData ? (
                  <ServicePopup serviceData={marker.serviceData} />
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "12px",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "500",
                        color: "#1f2937",
                        fontSize: "14px",
                      }}
                    >
                      {marker.label}
                    </div>
                  </div>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Back to Home Button Overlay */}
        <div className="back-to-home-btn">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              paddingTop: "0.5rem",
              paddingBottom: "0.5rem",
              cursor: "pointer",
              transition: "color 0.2s ease",
              background: "none",
              border: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "#374151",
            }}
          >
            <LeftArrow style={{ width: "1rem", height: "1rem" }} />
            Back to Home
          </button>
        </div>

        {/* Search Area Overlay */}
        <div className="search-overlay">
          <div className="search-overlay-content">
            {/* Location Select Dropdown */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                >
                  <MapPin
                    style={{ width: "20px", height: "20px", color: "#A5E830" }}
                  />
                </span>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  style={{
                    width: "100%",
                    paddingLeft: "3rem",
                    paddingRight: "3rem",
                    paddingTop: "0.875rem",
                    paddingBottom: "0.875rem",
                    border: "1px solid #A5E830",
                    borderRadius: "8px",
                    backgroundColor: "#0A5C15",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "white",
                    cursor: "pointer",
                    outline: "none",
                    appearance: "none",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {locationOptions.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <ChevronDown
                    style={{ width: "20px", height: "20px", color: "#A5E830" }}
                  />
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <div style={{ position: "relative", flex: "1" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Search
                    style={{ width: "20px", height: "20px", color: "#6B7280" }}
                  />
                </span>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearchClick();
                    }
                  }}
                  placeholder="Search services..."
                  disabled={searching}
                  style={{
                    width: "100%",
                    paddingLeft: "3rem",
                    paddingRight: "1rem",
                    paddingTop: "0.875rem",
                    paddingBottom: "0.875rem",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    backgroundColor: searching ? "#f9fafb" : "white",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#374151",
                    opacity: searching ? 0.6 : 1,
                  }}
                />
              </div>
              <button
                className="search-btn"
                onClick={handleSearchClick}
                disabled={searching}
                style={{
                  padding: "0.875rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "500",
                  border: "none",
                  cursor: searching ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  backgroundColor: searching ? "#6B7280" : "#0A5C15",
                  color: "white",
                  opacity: searching ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                {searching && (
                  <Loader2 style={{ width: "16px", height: "16px" }} className="animate-spin" />
                )}
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {/* Filter Tags */}
            <div>
              <div
                style={{
                  marginBottom: "0.75rem",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "#0A5C15",
                }}
              >
                Frequently Searched Items
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {filterTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleFilterClick(tag)}
                    disabled={searching}
                    className={`filter-tag ${
                      activeFilter === tag ? "active" : "inactive"
                    }`}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      border: "1px solid",
                      cursor: searching ? "not-allowed" : "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "500",
                      fontSize: "12px",
                      opacity: searching ? 0.6 : 1,
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Provider Section */}
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem 1.5rem",
          marginTop: "30px",
        }}
      >
        {/* Section Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "#000000",
              fontFamily: "Raleway, sans-serif",
              fontStyle: "semiBold",
              margin: 0,
              lineHeight: "24px",
            }}
          >
            Discover Nearby{" "}
            <span style={{ color: "#0A5C15" }}>"{activeFilter} Services"</span>
          </h2>
        </div>

        {/* Loading State */}
        {searching && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "3rem",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <Loader2 style={{ width: "2rem", height: "2rem", color: "#0A5C15" }} className="animate-spin" />
            <p style={{ color: "#6B7280", fontSize: "14px" }}>
              Searching for services...
            </p>
          </div>
        )}

        {/* Error State */}
        {searchedShop?.error && !searching && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#EF4444",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {searchedShop.error}
          </div>
        )}

        {/* Service Provider Grid */}
        {!searching && !searchedShop?.error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "1rem",
            }}
          >
            {serviceProviders.map((provider) => (
              <div
                key={provider.id}
                className="service-card"
                style={{
                  border: "1px solid #C1C1C1",
                  borderRadius: "10px",
                  padding: "1rem",
                  backgroundColor: "white",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Service Card Image */}
                <div
                  style={{
                    width: "100%",
                    height: "120px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "8px",
                    overflow: "hidden",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={provider.image}
                    alt={provider.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                {/* Service Card Content */}
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#000000",
                        margin: 0,
                        lineHeight: "1.2",
                      }}
                    >
                      {provider.name}
                    </h3>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                        fontWeight: "500",
                        whiteSpace: "nowrap",
                        marginLeft: "8px",
                      }}
                    >
                      {provider.distance}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "0.5rem",
                      fontSize: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        backgroundColor: "#10B981",
                        borderRadius: "50%",
                        marginRight: "4px",
                      }}
                    />
                    <span style={{ color: "#10B981", fontWeight: "500" }}>
                      {provider.hours}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"
                        fill="#FCD34D"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      {provider.rating}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#6B7280",
                      }}
                    >
                      ({provider.reviews})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results State */}
        {!searching && !searchedShop?.error && serviceProviders.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: "#6B7280",
              fontSize: "16px",
            }}
          >
            No services found. Try a different search term.
          </div>
        )}
      </div>

      <Footer />

      {/* Add custom styles for the popup and animations */}
      <style jsx>{`
        .leaflet-popup-content-wrapper {
          padding: 0 !important;
          border-radius: 12px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          line-height: 1.4 !important;
        }
        .leaflet-popup-tip-container {
          margin-top: -1px;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .filter-tag.active {
          background-color: #0A5C15;
          border-color: #0A5C15;
          color: white;
        }
        .filter-tag.inactive {
          background-color: white;
          border-color: #D1D5DB;
          color: #6B7280;
        }
        .filter-tag:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default ServiceFinder;