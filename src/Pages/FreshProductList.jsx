import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FreshProductList.css";
import { FaHeart, FaPhone, FaWhatsapp } from "react-icons/fa";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const FreshProductList = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper: transform API shop object into UI "product"
  const transformShop = (shop) => ({
    id: shop.sh_id,
    name: shop.sh_name,
    distance: "2km Away", // Or calculate if you have user's location
    openTime: `Open ${shop.sh_opening_hours}`,
    rating: shop.sh_ratings || 0,
    reviews: 0, // Set real review count if available
    color: "#4CAF50", // Optional: set color based on category or status
    logoText: shop.sh_name,
    whatsapp: !!shop.sh_whatsapp_number,
    icon: null,
    image: `${'https://lunarsenterprises.com:6031'}${shop.shopimages[0].si_image}`,
    phone: shop.sh_primary_phone ? `+${shop.sh_primary_phone}` : null,
    whatsappNumber: shop.sh_whatsapp_number ? `+${shop.sh_whatsapp_number}` : null,
    address: shop.sh_address,
  });

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.post(
          `${API_BASE_URL}/shop/list/shop`,
          { sh_shop_or_service: "shop" },
          {
            headers: { "Content-Type": "application/json" }
          }
        );
        if (res.data.result && Array.isArray(res.data.list)) {
          setShops(res.data.list.map(transformShop));
        } else {
          setError("No shops found");
        }
      } catch (err) {
        setError("Failed to load shops");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="product-container">
        <h2 className="product-heading">Find your local fresh product</h2>
        <div>Loading...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="product-container">
        <h2 className="product-heading">Find your local fresh product</h2>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <div className="product-container">
      <h2 className="product-heading">Find your local fresh product</h2>
      <div className="product-grid">
        {shops.map((shop) => (
          <div className="product-card" key={shop.id}>
            {shop.image ? (
              <img
                src={shop.image}
                className="product-logo"
                style={{ borderRadius: "20px" }}
                alt={shop.name}
              />
            ) : (
              <div
                className="product-logo"
                style={{
                  backgroundColor: shop.color,
                  borderRadius: "20px",
                }}
              >
                {shop.icon && <div className="product-icon">{shop.icon}</div>}
                <div className="product-logo-text">{shop.logoText}</div>
              </div>
            )}
            <div className="product-details">
              <div className="product-top">
                <span>{shop.distance}</span>
                <span className="open-dot"></span>
                <span className="open-time">{shop.openTime}</span>
                <div className="wishlist-icon"><FaHeart /></div>
              </div>
              <div className="product-name">{shop.name}</div>
              <div className="product-rating">
                ⭐ {shop.rating} ({shop.reviews} Reviews)
              </div>
              <div className="product-actions">
                {shop.phone && (
                  <button className="call-btn"
                    onClick={() => window.location.href = `tel:${shop.phone}`}
                  >
                    <FaPhone /> Contact Now
                  </button>
                )}
                {shop.whatsapp && shop.whatsappNumber && (
                  <button
                    className="whatsapp-btn"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${shop.whatsappNumber.replace(/\D/g, "")}`,
                        "_blank"
                      )
                    }
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default FreshProductList;
