import { useState, useRef, useEffect } from "react";
import "./ServiceFinder.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  MapPin,
  ChevronDown,
  Star,
  Heart,
  Phone,
  MessageCircle,
  ArrowLeftIcon as LeftArrow,
  ArrowRightIcon as RightArrow,
} from "lucide-react";
import Header from "./header";
import Footer from "../Footer";

const ServiceFinder = () => {
  const [selectedLocation, setSelectedLocation] = useState(
    "Bangalore, Karnataka, India"
  );
  const [searchTerm, setSearchTerm] = useState("Dry Cleaning");
  const [activeFilter, setActiveFilter] = useState("Dry Cleaning");

  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup function to ensure proper map disposal
      if (mapRef.current) {
        mapRef.current = null;
      }
    };
  }, []);

  const resetMap = () => {
    setMapKey((prev) => prev + 1);
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
  ];

  const createCustomIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
      </div>`,
      className: "custom-div-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const greenIcon = createCustomIcon("#16a34a");
  const blueIcon = createCustomIcon("#2563eb");

  const mapMarkers = [
    {
      id: 1,
      position: [12.9716, 77.5946],
      label: "On Available",
      type: "service",
    },
    {
      id: 2,
      position: [12.975, 77.61],
      label: "On Available",
      type: "service",
    },
    {
      id: 3,
      position: [12.965, 77.58],
      label: "On Available",
      type: "service",
    },
    { id: 4, position: [12.97, 77.59], label: "Your Location", type: "user" },
  ];

  const serviceProviders = [
    {
      id: 1,
      name: "Sparkle Dry Cleaners",
      image: "/dry-cleaning-shop.png",
      distance: "1.5 km Away",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
    {
      id: 2,
      name: "FreshLook Laundry...",
      image: "/laundry-service.png",
      distance: "1.5 km Away",
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
      distance: "1.5 km Away",
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
      distance: "1.5 km Away",
      hours: "Open 7 am to 9 pm",
      rating: 4.5,
      reviews: 120,
      phone: "94477772090",
      whatsapp: "94477772090",
      whatsappNumber: "94477772090",
    },
  ];

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
              <Popup>
                <div className="map-popup">
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontWeight: "500", color: "#1f2937" }}>
                      {marker.label}
                    </div>
                    {marker.type === "service" && (
                      <div
                        style={{
                          fontSize: "0.875rem",
                          color: "#16a34a",
                          marginTop: "0.25rem",
                        }}
                      >
                        Service Available
                      </div>
                    )}
                  </div>
                </div>
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
                  placeholder="Search services..."
                  style={{
                    width: "100%",
                    paddingLeft: "3rem",
                    paddingRight: "1rem",
                    paddingTop: "0.875rem",
                    paddingBottom: "0.875rem",
                    border: "1px solid #E5E7EB",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "400",
                    fontSize: "14px",
                    color: "#374151",
                  }}
                />
              </div>
              <button
                className="search-btn"
                style={{
                  padding: "0.875rem 1.5rem",
                  borderRadius: "8px",
                  fontWeight: "500",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                  fontFamily: "Inter, sans-serif",
                  fontSize: "14px",
                  backgroundColor: "#0A5C15",
                  color: "white",
                }}
              >
                Search
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
                    onClick={() => setActiveFilter(tag)}
                    className={`filter-tag ${
                      activeFilter === tag ? "active" : "inactive"
                    }`}
                    style={{
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      border: "1px solid",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: "500",
                      fontSize: "12px",
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
        {/* Service Provider Grid */}
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
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "186px",
                    height: "158px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={""}
                    className="service-image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "#FFCACA",
                    }}
                  />
                </div>
                <div style={{ flex: "1", minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontFamily: "Inter, sans-serif",
                        color: "#494949",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontStyle: "Regular",
                        lineHeight: "24px",
                        marginTop: "10px",
                      }}
                    >
                      <span>{provider.distance}</span>
                      <span
                        style={{
                          color: "#3DBB34",
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="8"
                          height="9"
                          viewBox="0 0 8 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="4" cy="4.5" r="4" fill="#3DBB34" />
                        </svg>
                        {provider.hours}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#0A5C15",
                        padding: "9px",
                        borderRadius: "20px",
                        gap: "10px",
                      }}
                    >
                      <svg
                        viewBox="0 0 22 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "20px", height: "20px" }}
                      >
                        <path
                          d="M17.8407 4.16131C15.3822 2.6534 13.2363 3.26115 11.9475 4.22915C11.4195 4.62606 11.1555 4.82498 10.9997 4.82498C10.8438 4.82498 10.5798 4.62606 10.0518 4.22915C8.76299 3.26115 6.61707 2.6534 4.15857 4.16131C0.932824 6.1404 0.203157 12.668 7.64466 18.1771C9.06182 19.2249 9.77041 19.7501 10.9997 19.7501C12.2289 19.7501 12.9375 19.2258 14.3547 18.1762C21.7962 12.6689 21.0665 6.1404 17.8407 4.16131Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      marginBottom: "0.75rem",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: "#000000",
                        fontSize: "24px",
                        fontWeight: "600",
                        fontStyle: "semiBold",
                        lineHeight: "24px",
                      }}
                    >
                      {provider.name}
                    </h3>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.4996 17.7752L8.17669 20.2752C7.98572 20.3919 7.78607 20.4419 7.57773 20.4252C7.3694 20.4085 7.18711 20.3419 7.03086 20.2252C6.87461 20.1085 6.75308 19.9629 6.66628 19.7882C6.57947 19.6135 6.56211 19.4175 6.61419 19.2002L7.76003 14.4752L3.9319 11.3002C3.75829 11.1502 3.64996 10.9792 3.6069 10.7872C3.56385 10.5952 3.57669 10.4079 3.64544 10.2252C3.71419 10.0425 3.81836 9.89253 3.95794 9.7752C4.09753 9.65786 4.2885 9.58286 4.53086 9.5502L9.58294 9.1252L11.5361 4.6752C11.6229 4.4752 11.7576 4.3252 11.9402 4.2252C12.1229 4.1252 12.3093 4.0752 12.4996 4.0752C12.6899 4.0752 12.8763 4.1252 13.059 4.2252C13.2416 4.3252 13.3763 4.4752 13.4632 4.6752L15.4163 9.1252L20.4684 9.5502C20.7114 9.58353 20.9024 9.65853 21.0413 9.7752C21.1802 9.89186 21.2843 10.0419 21.3538 10.2252C21.4232 10.4085 21.4364 10.5962 21.3934 10.7882C21.3503 10.9802 21.2416 11.1509 21.0673 11.3002L17.2392 14.4752L18.385 19.2002C18.4371 19.4169 18.4197 19.6129 18.3329 19.7882C18.2461 19.9635 18.1246 20.1092 17.9684 20.2252C17.8121 20.3412 17.6298 20.4079 17.4215 20.4252C17.2132 20.4425 17.0135 20.3925 16.8225 20.2752L12.4996 17.7752Z"
                          fill="#E8C930"
                        />
                      </svg>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#494949",
                          fontSize: "14px",
                          fontWeight: "500",
                          fontStyle: "Medium",
                          lineHeight: "24px",
                        }}
                      >
                        {provider.rating}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#494949",
                          fontSize: "14px",
                          fontWeight: "500",
                          fontStyle: "Medium",
                          lineHeight: "24px",
                        }}
                      >
                        ({provider.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                 <div className="delivery-buttons" style={{marginTop:"40px"}}>
                    {provider.phone && (
                      <button
                        className="contact-btn2"
                        onClick={() => {
                          if (provider.phone) {
                            window.location.href = `tel:${provider.phone}`;
                          }
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                        >
                          <path
                            d="M16.537 20.1876C15.7364 20.1876 14.6117 19.898 12.9276 18.9571C10.8797 17.8087 9.29568 16.7484 7.25884 14.7169C5.29501 12.7543 4.33935 11.4837 3.00183 9.04982C1.49082 6.30177 1.74839 4.8613 2.03632 4.24565C2.37921 3.50983 2.88535 3.06974 3.53955 2.63292C3.91113 2.38947 4.30435 2.18077 4.71423 2.00948C4.75525 1.99185 4.79339 1.97503 4.82744 1.95985C5.03046 1.86839 5.33808 1.73017 5.72773 1.87782C5.98777 1.97544 6.21992 2.17519 6.58332 2.53407C7.32857 3.26907 8.34699 4.90601 8.72269 5.70991C8.97494 6.25173 9.14187 6.60939 9.14228 7.01052C9.14228 7.48015 8.90603 7.84232 8.61933 8.23319C8.5656 8.30661 8.51228 8.37675 8.4606 8.44483C8.14847 8.85499 8.07998 8.97353 8.12509 9.18517C8.21656 9.6105 8.89865 10.8767 10.0196 11.9951C11.1406 13.1136 12.3702 13.7527 12.7972 13.8437C13.0178 13.8909 13.1388 13.8195 13.5621 13.4963C13.6228 13.45 13.6852 13.402 13.7504 13.354C14.1876 13.0287 14.533 12.7986 14.9915 12.7986H14.994C15.3931 12.7986 15.7347 12.9717 16.3007 13.2572C17.039 13.6296 18.7252 14.6349 19.4647 15.381C19.8244 15.7436 20.025 15.9749 20.123 16.2345C20.2706 16.6254 20.1316 16.9318 20.041 17.1369C20.0258 17.1709 20.009 17.2082 19.9913 17.2497C19.8187 17.6588 19.6087 18.0512 19.3642 18.4219C18.9282 19.074 18.4865 19.5789 17.749 19.9222C17.3703 20.1014 16.9559 20.1921 16.537 20.1876Z"
                            fill="#D4F49C"
                          />
                        </svg>
                        Contact Now
                      </button>
                    )}
                    {provider.whatsapp && provider.whatsappNumber && (
                      <button
                        className="whatsapp-btn2"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${provider.whatsappNumber.replace(
                              /\D/g,
                              ""
                            )}`,
                            "_blank"
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_291_731)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M16.2316 3.25896C14.4458 1.4807 12.0706 0.500902 9.5399 0.5C4.32519 0.5 0.0811965 4.7201 0.079382 9.90736C0.0784748 11.5656 0.514396 13.1842 1.34224 14.6106L0 19.4861L5.01513 18.1779C6.39682 18.9277 7.95271 19.3224 9.53584 19.3229H9.5399C14.7537 19.3229 18.9982 15.1023 19 9.91502C19.0009 7.40104 18.0179 5.03768 16.2316 3.25941V3.25896ZM9.5399 17.7341H9.53673C8.12598 17.7336 6.74204 17.3565 5.53454 16.6442L5.24739 16.4746L2.27124 17.2509L3.06551 14.3652L2.87862 14.0693C2.0916 12.8242 1.67564 11.3852 1.67655 9.90784C1.67836 5.5966 5.20565 2.08879 9.54312 2.08879C11.6433 2.0897 13.6175 2.90395 15.1021 4.38222C16.5868 5.86005 17.4037 7.82508 17.4028 9.91413C17.401 14.2258 13.8737 17.7336 9.5399 17.7336V17.7341ZM13.8528 11.8778C13.6165 11.7601 12.4544 11.1916 12.2375 11.1132C12.0207 11.0347 11.8633 10.9955 11.7059 11.2309C11.5485 11.4664 11.0954 11.996 10.9575 12.1525C10.8196 12.3095 10.6816 12.3289 10.4453 12.2111C10.209 12.0934 9.44738 11.8453 8.54425 11.0446C7.84162 10.4211 7.36709 9.6516 7.22924 9.41609C7.09133 9.18064 7.21472 9.05341 7.33263 8.93658C7.43876 8.83103 7.56897 8.66186 7.68735 8.52472C7.80578 8.38757 7.84478 8.28927 7.92369 8.1327C8.00264 7.97571 7.96316 7.83862 7.90421 7.72084C7.84521 7.60311 7.37258 6.446 7.17524 5.97552C6.98334 5.5172 6.78833 5.57946 6.64361 5.57179C6.50571 5.56502 6.34832 5.56367 6.19046 5.56367C6.03261 5.56367 5.77674 5.62231 5.55993 5.85779C5.34312 6.09324 4.73254 6.66209 4.73254 7.81873C4.73254 8.97536 5.57946 10.0937 5.69784 10.2507C5.81622 10.4077 7.36482 12.7818 9.73586 13.8004C10.2997 14.0426 10.7402 14.1875 11.0835 14.2957C11.6497 14.4748 12.165 14.4496 12.5723 14.3891C13.0264 14.3215 13.9708 13.8203 14.1677 13.2713C14.3645 12.7222 14.3645 12.2513 14.3056 12.1534C14.2466 12.0555 14.0888 11.9964 13.8524 11.8787L13.8528 11.8778Z"
                              fill="#0A5C15"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_291_731">
                              <rect
                                width="19"
                                height="19"
                                fill="white"
                                transform="translate(0 0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        What's app
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "0.5rem",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <LeftArrow
              style={{ width: "16px", height: "16px", color: "#6B7280" }}
            />
          </button>
          <button
            style={{
              padding: "0.5rem",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <RightArrow
              style={{ width: "16px", height: "16px", color: "#6B7280" }}
            />
          </button>
        </div>

        {/* Other Services Section - Updated with Discover Nearby styles */}
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
            Other Service Near You.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "1rem",
          }}
        >
          {serviceProviders.slice(2).map((provider) => (
            <div
              key={`other-${provider.id}`}
              className="service-card"
              style={{
                border: "1px solid #C1C1C1",
                borderRadius: "10px",
                padding: "1rem",
                backgroundColor: "white",
              }}
            >
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div
                  style={{
                    width: "186px",
                    height: "158px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={provider.image || "/placeholder.svg"}
                    alt={""}
                    className="service-image"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      backgroundColor: "#FFCACA",
                    }}
                  />
                </div>
                <div style={{ flex: "1", minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        fontFamily: "Inter, sans-serif",
                        color: "#494949",
                        fontSize: "16px",
                        fontWeight: "400",
                        fontStyle: "Regular",
                        lineHeight: "24px",
                        marginTop: "10px",
                      }}
                    >
                      <span>{provider.distance}</span>
                      <span
                        style={{
                          color: "#3DBB34",
                          display: "flex",
                          gap: "5px",
                          alignItems: "center",
                        }}
                      >
                        <svg
                          width="8"
                          height="9"
                          viewBox="0 0 8 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="4" cy="4.5" r="4" fill="#3DBB34" />
                        </svg>
                        {provider.hours}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#0A5C15",
                        padding: "9px",
                        borderRadius: "20px",
                        gap: "10px",
                      }}
                    >
                      <svg
                        viewBox="0 0 22 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: "20px", height: "20px" }}
                      >
                        <path
                          d="M17.8407 4.16131C15.3822 2.6534 13.2363 3.26115 11.9475 4.22915C11.4195 4.62606 11.1555 4.82498 10.9997 4.82498C10.8438 4.82498 10.5798 4.62606 10.0518 4.22915C8.76299 3.26115 6.61707 2.6534 4.15857 4.16131C0.932824 6.1404 0.203157 12.668 7.64466 18.1771C9.06182 19.2249 9.77041 19.7501 10.9997 19.7501C12.2289 19.7501 12.9375 19.2258 14.3547 18.1762C21.7962 12.6689 21.0665 6.1404 17.8407 4.16131Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      marginBottom: "0.75rem",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <h3
                      style={{
                        fontFamily: "Inter, sans-serif",
                        color: "#000000",
                        fontSize: "24px",
                        fontWeight: "600",
                        fontStyle: "semiBold",
                        lineHeight: "24px",
                      }}
                    >
                      {provider.name}
                    </h3>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 25 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.4996 17.7752L8.17669 20.2752C7.98572 20.3919 7.78607 20.4419 7.57773 20.4252C7.3694 20.4085 7.18711 20.3419 7.03086 20.2252C6.87461 20.1085 6.75308 19.9629 6.66628 19.7882C6.57947 19.6135 6.56211 19.4175 6.61419 19.2002L7.76003 14.4752L3.9319 11.3002C3.75829 11.1502 3.64996 10.9792 3.6069 10.7872C3.56385 10.5952 3.57669 10.4079 3.64544 10.2252C3.71419 10.0425 3.81836 9.89253 3.95794 9.7752C4.09753 9.65786 4.2885 9.58286 4.53086 9.5502L9.58294 9.1252L11.5361 4.6752C11.6229 4.4752 11.7576 4.3252 11.9402 4.2252C12.1229 4.1252 12.3093 4.0752 12.4996 4.0752C12.6899 4.0752 12.8763 4.1252 13.059 4.2252C13.2416 4.3252 13.3763 4.4752 13.4632 4.6752L15.4163 9.1252L20.4684 9.5502C20.7114 9.58353 20.9024 9.65853 21.0413 9.7752C21.1802 9.89186 21.2843 10.0419 21.3538 10.2252C21.4232 10.4085 21.4364 10.5962 21.3934 10.7882C21.3503 10.9802 21.2416 11.1509 21.0673 11.3002L17.2392 14.4752L18.385 19.2002C18.4371 19.4169 18.4197 19.6129 18.3329 19.7882C18.2461 19.9635 18.1246 20.1092 17.9684 20.2252C17.8121 20.3412 17.6298 20.4079 17.4215 20.4252C17.2132 20.4425 17.0135 20.3925 16.8225 20.2752L12.4996 17.7752Z"
                          fill="#E8C930"
                        />
                      </svg>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#494949",
                          fontSize: "14px",
                          fontWeight: "500",
                          fontStyle: "Medium",
                          lineHeight: "24px",
                        }}
                      >
                        {provider.rating}
                      </span>
                      <span
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: "#494949",
                          fontSize: "14px",
                          fontWeight: "500",
                          fontStyle: "Medium",
                          lineHeight: "24px",
                        }}
                      >
                        ({provider.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                  <div className="delivery-buttons" style={{marginTop:"40px"}}>
                    {provider.phone && (
                      <button
                        className="contact-btn2"
                        onClick={() => {
                          if (provider.phone) {
                            window.location.href = `tel:${provider.phone}`;
                          }
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                        >
                          <path
                            d="M16.537 20.1876C15.7364 20.1876 14.6117 19.898 12.9276 18.9571C10.8797 17.8087 9.29568 16.7484 7.25884 14.7169C5.29501 12.7543 4.33935 11.4837 3.00183 9.04982C1.49082 6.30177 1.74839 4.8613 2.03632 4.24565C2.37921 3.50983 2.88535 3.06974 3.53955 2.63292C3.91113 2.38947 4.30435 2.18077 4.71423 2.00948C4.75525 1.99185 4.79339 1.97503 4.82744 1.95985C5.03046 1.86839 5.33808 1.73017 5.72773 1.87782C5.98777 1.97544 6.21992 2.17519 6.58332 2.53407C7.32857 3.26907 8.34699 4.90601 8.72269 5.70991C8.97494 6.25173 9.14187 6.60939 9.14228 7.01052C9.14228 7.48015 8.90603 7.84232 8.61933 8.23319C8.5656 8.30661 8.51228 8.37675 8.4606 8.44483C8.14847 8.85499 8.07998 8.97353 8.12509 9.18517C8.21656 9.6105 8.89865 10.8767 10.0196 11.9951C11.1406 13.1136 12.3702 13.7527 12.7972 13.8437C13.0178 13.8909 13.1388 13.8195 13.5621 13.4963C13.6228 13.45 13.6852 13.402 13.7504 13.354C14.1876 13.0287 14.533 12.7986 14.9915 12.7986H14.994C15.3931 12.7986 15.7347 12.9717 16.3007 13.2572C17.039 13.6296 18.7252 14.6349 19.4647 15.381C19.8244 15.7436 20.025 15.9749 20.123 16.2345C20.2706 16.6254 20.1316 16.9318 20.041 17.1369C20.0258 17.1709 20.009 17.2082 19.9913 17.2497C19.8187 17.6588 19.6087 18.0512 19.3642 18.4219C18.9282 19.074 18.4865 19.5789 17.749 19.9222C17.3703 20.1014 16.9559 20.1921 16.537 20.1876Z"
                            fill="#D4F49C"
                          />
                        </svg>
                        Contact Now
                      </button>
                    )}
                    {provider.whatsapp && provider.whatsappNumber && (
                      <button
                        className="whatsapp-btn2"
                        onClick={() =>
                          window.open(
                            `https://wa.me/${provider.whatsappNumber.replace(
                              /\D/g,
                              ""
                            )}`,
                            "_blank"
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                        >
                          <g clip-path="url(#clip0_291_731)">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M16.2316 3.25896C14.4458 1.4807 12.0706 0.500902 9.5399 0.5C4.32519 0.5 0.0811965 4.7201 0.079382 9.90736C0.0784748 11.5656 0.514396 13.1842 1.34224 14.6106L0 19.4861L5.01513 18.1779C6.39682 18.9277 7.95271 19.3224 9.53584 19.3229H9.5399C14.7537 19.3229 18.9982 15.1023 19 9.91502C19.0009 7.40104 18.0179 5.03768 16.2316 3.25941V3.25896ZM9.5399 17.7341H9.53673C8.12598 17.7336 6.74204 17.3565 5.53454 16.6442L5.24739 16.4746L2.27124 17.2509L3.06551 14.3652L2.87862 14.0693C2.0916 12.8242 1.67564 11.3852 1.67655 9.90784C1.67836 5.5966 5.20565 2.08879 9.54312 2.08879C11.6433 2.0897 13.6175 2.90395 15.1021 4.38222C16.5868 5.86005 17.4037 7.82508 17.4028 9.91413C17.401 14.2258 13.8737 17.7336 9.5399 17.7336V17.7341ZM13.8528 11.8778C13.6165 11.7601 12.4544 11.1916 12.2375 11.1132C12.0207 11.0347 11.8633 10.9955 11.7059 11.2309C11.5485 11.4664 11.0954 11.996 10.9575 12.1525C10.8196 12.3095 10.6816 12.3289 10.4453 12.2111C10.209 12.0934 9.44738 11.8453 8.54425 11.0446C7.84162 10.4211 7.36709 9.6516 7.22924 9.41609C7.09133 9.18064 7.21472 9.05341 7.33263 8.93658C7.43876 8.83103 7.56897 8.66186 7.68735 8.52472C7.80578 8.38757 7.84478 8.28927 7.92369 8.1327C8.00264 7.97571 7.96316 7.83862 7.90421 7.72084C7.84521 7.60311 7.37258 6.446 7.17524 5.97552C6.98334 5.5172 6.78833 5.57946 6.64361 5.57179C6.50571 5.56502 6.34832 5.56367 6.19046 5.56367C6.03261 5.56367 5.77674 5.62231 5.55993 5.85779C5.34312 6.09324 4.73254 6.66209 4.73254 7.81873C4.73254 8.97536 5.57946 10.0937 5.69784 10.2507C5.81622 10.4077 7.36482 12.7818 9.73586 13.8004C10.2997 14.0426 10.7402 14.1875 11.0835 14.2957C11.6497 14.4748 12.165 14.4496 12.5723 14.3891C13.0264 14.3215 13.9708 13.8203 14.1677 13.2713C14.3645 12.7222 14.3645 12.2513 14.3056 12.1534C14.2466 12.0555 14.0888 11.9964 13.8524 11.8787L13.8528 11.8778Z"
                              fill="#0A5C15"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_291_731">
                              <rect
                                width="19"
                                height="19"
                                fill="white"
                                transform="translate(0 0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        What's app
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "0.5rem",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <LeftArrow
              style={{ width: "16px", height: "16px", color: "#6B7280" }}
            />
          </button>
          <button
            style={{
              padding: "0.5rem",
              border: "1px solid #E5E7EB",
              borderRadius: "6px",
              backgroundColor: "white",
              cursor: "pointer",
              transition: "background-color 0.2s ease",
            }}
          >
            <RightArrow
              style={{ width: "16px", height: "16px", color: "#6B7280" }}
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceFinder;
