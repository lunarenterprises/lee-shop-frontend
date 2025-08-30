import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavoritesComponent.css";

const FAVORITES_API_URL =
  "https://lunarsenterprises.com:6031/leeshop/user/list/fav";

const FavoritesComponent = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("shops");
  const [favoritesData, setFavoritesData] = useState({
    shops: [],
    services: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Get user data from localStorage (similar to ShopCard.jsx)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("userData");
      if (raw && raw !== "undefined" && raw !== "null") {
        const parsed = JSON.parse(raw);
        if (parsed?.id) setUserData(parsed);
      }
    } catch {
      localStorage.removeItem("userData");
    }
  }, []);

  // Fetch favorites when component opens and user data is available
  useEffect(() => {
    if (isOpen && userData?.id) {
      fetchFavorites();
    }
  }, [isOpen, userData]);

  const fetchFavorites = async () => {
    if (!userData?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        FAVORITES_API_URL,
        {
          u_id: userData.id,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.result && Array.isArray(response.data.list)) {
        // Transform the API response to separate shops and services
        const transformedData = {
          shops: [],
          services: [],
        };

        response.data.list.forEach((item) => {
          const transformedItem = {
            id: item.sh_id || item.id,
            name: item.sh_name || item.name,
            rating: item.sh_ratings || item.rating || 0,
            reviewCount: item.review_count || 0,
            distance: item.distance || "2km Away", // You can calculate this if needed
            status: item.sh_opening_hours
              ? `Open ${item.sh_opening_hours}`
              : "Open 7 am to 9 pm",
            image: item.shopimages?.[0]
              ? `https://lunarsenterprises.com:6031${item.shopimages[0].si_image}`
              : "/shop.png",
            isOpen: true, // You can determine this based on opening hours
            phone: item.sh_primary_phone ? `+${item.sh_primary_phone}` : null,
            whatsappNumber: item.sh_whatsapp_number
              ? `+${item.sh_whatsapp_number}`
              : null,
            address: item.sh_address,
            type: item.type || "shop", // Assuming API provides type to differentiate shops and services
          };

          // Separate into shops and services based on type or category
          if (transformedItem.type === "service") {
            transformedData.services.push(transformedItem);
          } else {
            transformedData.shops.push(transformedItem);
          }
        });

        setFavoritesData(transformedData);
      } else {
        setError("No favorites found!");
        setFavoritesData({ shops: [], services: [] });
      }
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setError("Failed to fetch favorites.");
      setFavoritesData({ shops: [], services: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (type, id) => {
    try {
      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/user/add/fav",
        {
          u_id: userData?.id,
          sh_id: id,
          fav: 0,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data) {
        // Remove from local state
        setFavoritesData((prev) => ({
          ...prev,
          [type]: prev[type].filter((item) => item.id !== id),
        }));
        console.log(`${type} removed from favorites successfully`);
      }
    } catch (err) {
      console.error("Failed to remove from favorites:", err);
      alert("Failed to remove from favorites. Please try again.");
    }
  };

  const handleItemClick = (item) => {
    console.log("Clicked on:", item.name);
    // Add navigation or detailed view logic here
    // You might want to close the modal and navigate to shop details
    onClose();
  };

  const renderFavoriteItems = () => {
    const items = favoritesData[activeTab];

    if (loading) {
      return (
        <div className="loading-state">
          <p>Loading favorites...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={fetchFavorites} className="retry-btn">
            Try Again
          </button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="empty-state">
          <p>No {activeTab} in your favorites yet</p>
        </div>
      );
    }

    return items.map((item) => (
      <div key={item.id} className="favorite-item">
        <div className="item-image">
          <img src={item.image} alt={item.name} />
        </div>

        <div className="item-content" onClick={() => handleItemClick(item)}>
          <div className="item-header">
            <div className="rating-container">
              <span className="star">⭐</span>
              <span className="rating-text">
                {item.rating} ({item.reviewCount} Reviews)
              </span>
            </div>
            <button
              className="remove-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFavorite(activeTab, item.id);
              }}
              aria-label="Remove from favorites"
            >
              ×
            </button>
          </div>

          <h3 className="item-name">{item.name}</h3>

          <div className="item-details">
            <span className="distance">{item.distance}</span>
            <span className={`status ${item.isOpen ? "open" : "closed"}`}>
              {item.isOpen && <span className="status-dot"></span>}
              {item.status}
            </span>
          </div>

          {/* Contact buttons similar to ShopCard */}
          <div className="item-actions">
            {item.phone && (
              <button
                className="contact-btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${item.phone}`;
                }}
              >
                📞 Call
              </button>
            )}
            {item.whatsappNumber && (
              <button
                className="whatsapp-btn-small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://wa.me/${item.whatsappNumber.replace(/\D/g, "")}`,
                    "_blank"
                  );
                }}
              >
                📱 WhatsApp
              </button>
            )}
          </div>
        </div>
      </div>
    ));
  };

  if (!isOpen) return null;

  // Don't show modal if user is not logged in
  if (!userData?.id) {
    return (
      <>
        <div className="favorites-overlay" onClick={onClose}></div>
        <div className="favorites-modal">
          <div className="favorites-header">
            <h2 className="favorites-title">My Favorites</h2>
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close favorites"
            >
              ×
            </button>
          </div>
          <div className="favorites-content">
            <div className="empty-state">
              <p>Please log in to view your favorites</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="favorites-overlay" onClick={onClose}></div>

      {/* Favorites Modal */}
      <div className="favorites-modal">
        <div className="favorites-header">
          <h2 className="favorites-title">My Favorites</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Close favorites"
          >
            ×
          </button>
        </div>

        <div className="favorites-tabs">
          <button
            className={`tab-btn ${activeTab === "shops" ? "active" : ""}`}
            onClick={() => setActiveTab("shops")}
          >
            Shops ({favoritesData.shops.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services ({favoritesData.services.length})
          </button>
        </div>

        <div className="favorites-content">{renderFavoriteItems()}</div>
      </div>
    </>
  );
};

export default FavoritesComponent;
