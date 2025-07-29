import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaStar,
  FaHeart,
  FaPhoneAlt,
  FaWhatsapp,
  FaTruck,
  FaSpinner
} from "react-icons/fa";
import { FiMapPin, FiEdit3 } from "react-icons/fi";
import "./ListingCard.css";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

const transformApiData = (apiShop) => ({
  id: apiShop.sh_id,
  name: apiShop.sh_name,
  ownerName: apiShop.sh_owner_name,
  category: apiShop.sh_category_name,
  shopType: apiShop.sh_shop_or_service,
  bannerImage: 'https://lunarsenterprises.com:6031' + apiShop.shopimages[0].si_image,
  distance: "2km away", // Replace with your actual distance logic if needed
  rating: apiShop.sh_ratings || 0,
  reviewCount: 0,
  location: `${apiShop.sh_location}, ${apiShop.sh_city}, ${apiShop.sh_state}`,
  address: apiShop.sh_address,
  status: apiShop.sh_status === "active" ? `Open ${apiShop.sh_opening_hours}` : "Closed",
  isOpen: apiShop.sh_status === "active",
  deliveryAvailable: apiShop.sh_delivery_option === "Available",
  phone: `+${apiShop.sh_primary_phone}`,
  secondaryPhone: apiShop.sh_secondary_phone ? `+${apiShop.sh_secondary_phone}` : null,
  whatsapp: `+${apiShop.sh_whatsapp_number}`,
  email: apiShop.sh_email,
  gallery: {
    mainImage: apiShop.shopimages?.[0]
      ? `${'https://lunarsenterprises.com:6031'}${apiShop.shopimages[0].si_image}`
      : "",
    topImage: apiShop.shopimages?.[1]
      ? `${'https://lunarsenterprises.com:6031'}${apiShop.shopimages[1].si_image}`
      : apiShop.shopimages?.[0]
        ? `${'https://lunarsenterprises.com:6031'}${apiShop.shopimages[0].si_image}`
        : "",
    thumbnails:
      apiShop.shopimages?.slice(0, 2).map((img) => `${'https://lunarsenterprises.com:6031'}${img.si_image}`) || [],
    additionalImagesCount: Math.max(0, (apiShop.shopimages?.length || 0) - 2)
  },
  about: {
    description: apiShop.sh_description,
    productsAndServices: apiShop.sh_product_and_service
      .replace(/[\[\]]/g, "")
      .split(" ")
      .filter(Boolean),
    openingHours: `Open: ${apiShop.sh_opening_hours}`,
    workingDays: apiShop.sh_working_days.replace(/[\[\]]/g, "").split(" ").filter(Boolean)
  },
  reviews: [], // Add reviews if available from API
});

const ListingCard = ({ shop }) => {
  const data = transformApiData(shop);

  const handleCall = () => {
    window.location.href = `tel:${data.phone}`;
  };

  const handleWhatsApp = () => {
    const num = data.whatsapp.replace(/\D/g, "");
    window.open(`https://wa.me/${num}`, "_blank");
  };

  const handleEdit = () => {
    console.log("Edit listing:", data.id);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`star ${i < Math.floor(rating) ? "filled" : "empty"}`}
      />
    ));

  return (
    <div className="listing-card">
      <div className="banner">
        <img src={data.bannerImage} alt={`${data.name} banner`} className="banner-img" />
        <span className="badge-distance">{data.distance}</span>
        <FaHeart className="icon-heart" />
      </div>
      <div className="details">
        <div className="header-info">
          <div className="title-section">
            <h2 className="title">{data.name}</h2>
            {data.category && <span className="category-badge">{data.category}</span>}
            {data.shopType && <span className="shop-type-badge">{data.shopType}</span>}
          </div>
          <div className="rating">
            {renderStars(data.rating)}
            {data.rating} <span className="review-count">({data.reviewCount} Reviews)</span>
          </div>
          <div className="meta">
            <FiMapPin /> {data.location}
            <span className={`status ${data.isOpen ? "open" : "closed"}`}> • {data.status}</span>
            {data.deliveryAvailable && (
              <span className="delivery">
                <FaTruck /> Delivery Available
              </span>
            )}
          </div>
        </div>
        <div className="actions">
          <button className="btn primary" onClick={handleCall}>
            <FaPhoneAlt /> Contact Now
          </button>
          <button className="btn whatsapp" onClick={handleWhatsApp}>
            <FaWhatsapp /> WhatsApp
          </button>
          <button className="btn edit" onClick={handleEdit}>
            <FiEdit3 /> Edit
          </button>
        </div>
        <div className="gallery-wrapper">
          <div className="gallery-left">
            <img src={data.gallery.mainImage} alt={`${data.name} main gallery image`} />
          </div>
          <div className="gallery-right">
            <div className="top-image">
              <img src={data.gallery.topImage} alt={`${data.name} featured image`} />
            </div>
            <div className="bottom-images">
              {data.gallery.thumbnails[0] && (
                <img
                  src={data.gallery.thumbnails[0]}
                  alt={`${data.name} thumbnail 1`}
                  className="thumb"
                />
              )}
              {data.gallery.thumbnails[1] && (
                <div className="thumb overlay-container">
                  <img
                    src={data.gallery.thumbnails[1]}
                    alt={`${data.name} thumbnail 2`}
                  />
                  {data.gallery.additionalImagesCount > 0 && (
                    <span className="overlay-text">+{data.gallery.additionalImagesCount}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="tabs">
          <button className="tab active">About Us</button>
        </div>
        <div className="content">
          <p>{data.about.description}</p>
          <h4>Products and Services</h4>
          <ul>
            {data.about.productsAndServices.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h4>Opening Hours</h4>
          <p>{data.about.openingHours}</p>
          <h4>Working Days</h4>
          <p>{data.about.workingDays.join(", ")}</p>
          <h4>Owner</h4>
          <p>{data.ownerName}</p>
          <h4>Address</h4>
          <p>{data.address}</p>
          <h4>Email</h4>
          <p>{data.email}</p>
        </div>
      </div>
    </div>
  );
};

export default function AllListings() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all shops from API (POST)
  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null);
      try {
        // If your API requires any filtering params in POST body, add here
        const postData = {};

        const response = await axios.post(`${API_BASE_URL}/shop/list/shop`, postData, {
          headers: { "Content-Type": "application/json" },
          timeout: 10000
        });

        if (response.data?.result && response.data.list?.length > 0) {
          setShops(response.data.list);
        } else {
          setError("No shops found");
        }
      } catch (e) {
        setError(`Failed to load shops: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <FaSpinner className="spinner" />
        <span>Loading shops...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );
  }

  if (!shops.length) {
    return <p>No shops to display.</p>;
  }

  return (
    <div className="all-listings">
      {shops.map((shop) => (
        <ListingCard key={shop.sh_id} shop={shop} />
      ))}
    </div>
  );
}
