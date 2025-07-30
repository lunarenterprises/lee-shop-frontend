import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FreshProductList.css";
import { FaHeart, FaPhone, FaWhatsapp } from "react-icons/fa";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const transformShop = (shop) => ({
  id: shop.sh_id,
  name: shop.sh_name,
  distance: "2km Away", // You can calculate or replace this if needed
  openTime: `Open ${shop.sh_opening_hours}`,
  rating: shop.sh_ratings || 0,
  reviews: 0, // You can update if actual reviews count is available
  color: "#4CAF50", // Assign color as you wish, could be based on category
  logoText: shop.sh_name,
  whatsapp: !!shop.sh_whatsapp_number,
  icon: null,
  image: shop.shopimages?.[0] ? `${'https://lunarsenterprises.com:6031'}${shop.shopimages[0].si_image}` : "/shop.png",
  phone: shop.sh_primary_phone ? `+${shop.sh_primary_phone}` : null,
  whatsappNumber: shop.sh_whatsapp_number ? `+${shop.sh_whatsapp_number}` : null,
  address: shop.sh_address,
});

const ShopCard = () => {
  const [shopList, setShopList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch shop data from the API
    const fetchShops = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/shop/list/shop`,
          {}, // Send an empty object unless the API requires filters
          { headers: { "Content-Type": "application/json" } }
        );
        if (response.data.result && Array.isArray(response.data.list)) {
          setShopList(response.data.list.map(transformShop));
        } else {
          setError("No shops found!");
        }
      } catch (err) {
        setError("Failed to fetch shops.");
      } finally {
        setLoading(false);
      }
    };
    fetchShops();
  }, []);

  if (loading) {
    return <div className="product-container"><p>Loading shops...</p></div>;
  }
  if (error) {
    return <div className="product-container"><p>{error}</p></div>;
  }

  return (
    <div className="product-container">
      <h2 className="product-heading">Discover Local Shops & Services</h2>
      <div className="product-grid">
        {shopList.map((product, index) => (
          <div className="product-card" key={product.id || index}>
            {product.image ? (
              <img
                src={product.image}
                className="product-logo"
                style={{ borderRadius: "20px" }}
                alt={product.name}
              />
            ) : (
              <div
                className="product-logo"
                style={{
                  backgroundColor: product.color,
                  margin: "10px",
                  borderRadius: "20px",
                }}
              >
                {product.icon && (
                  <div className="product-icon">{product.icon}</div>
                )}
                <div className="product-logo-text">{product.logoText}</div>
              </div>
            )}
            <div className="product-details">
              <div className="product-top">
                <span>{product.distance}</span>
                <span className="open-dot"></span>
                <span className="open-time">{product.openTime}</span>
                <div className="wishlist-icon">
                  <FaHeart />
                </div>
              </div>
              <div className="product-name">{product.name}</div>
              <div className="product-rating">
                ⭐ {product.rating} ({product.reviews} Reviews)
              </div>
              <div className="product-actions">
                {product.phone && (
                  <button className="call-btn" onClick={() => window.location.href = `tel:${product.phone}`}>
                    <FaPhone /> Contact Now
                  </button>
                )}
                {product.whatsapp && product.whatsappNumber && (
                  <button
                    className="whatsapp-btn"
                    onClick={() => window.open(`https://wa.me/${product.whatsappNumber.replace(/\D/g, '')}`, "_blank")}
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

export default ShopCard;
