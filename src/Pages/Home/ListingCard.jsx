import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ListingCard.css";
import {
  FaStar,
  FaHeart,
  FaPhoneAlt,
  FaWhatsapp,
  FaTruck,
  FaSpinner
} from "react-icons/fa";
import { FiMapPin, FiEdit3 } from "react-icons/fi";

const ListingCard = ({ shopId, listingData, requestData }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default data in case no props are passed
  const defaultData = {
    id: 1,
    name: "Cakezone",
    bannerImage: "/imageone.png",
    distance: "1.5km away",
    rating: 4.5,
    reviewCount: 120,
    location: "Panampilly Nagar, Kochi",
    status: "Open 7 am to 9 pm",
    isOpen: true,
    deliveryAvailable: true,
    phone: "+91 9876543210",
    whatsapp: "+91 9876543210",
    gallery: {
      mainImage: "/imagetwo.png",
      topImage: "/imagethree.png",
      thumbnails: ["/imagefour.png", "/imagefive.png"],
      additionalImagesCount: 6
    },
    about: {
      description: "CakeZone is your go‑to neighborhood bakery known for fresh, handcrafted cakes and a cozy, personalized service experience. Whether it's a birthday, celebration, or casual indulgence we bake it with care.",
      productsAndServices: [
        "Customized Birthday Cakes",
        "Chocolate Truffle, Red Velvet, and Photo Cakes",
        "Eggless and Sugar‑free Options",
        "Pre‑orders for Events"
      ],
      openingHours: "Open Daily: 7 : 00 AM – 9 : 00 PM"
    },
    reviews: [
      {
        id: 1,
        name: "John Doe",
        rating: 5,
        comment: "Amazing cakes and great service!",
        date: "2025-01-15"
      }
    ]
  };

  // API configuration
  const API_BASE_URL = 'https://lunarsenterprises.com:6031/leeshop';

  // Transform API data to component format
  const transformApiData = (apiShop) => {
    const baseImageUrl = API_BASE_URL;

    return {
      id: apiShop.sh_id,
      name: apiShop.sh_name,
      ownerName: apiShop.sh_owner_name,
      category: apiShop.sh_category_name,
      shopType: apiShop.sh_shop_or_service,
      bannerImage: apiShop.shopimages?.[0]
        ? `${baseImageUrl}${apiShop.shopimages[0].si_image}`
        : '/imageone.png',
      distance: calculateDistance(apiShop.sh_latitude, apiShop.sh_longitude),
      rating: apiShop.sh_ratings || 0,
      reviewCount: 0, // This might need to come from a separate API
      location: `${apiShop.sh_location}, ${apiShop.sh_city}, ${apiShop.sh_state}`,
      address: apiShop.sh_address,
      status: apiShop.sh_status === 'active' ? `Open ${apiShop.sh_opening_hours}` : 'Closed',
      isOpen: apiShop.sh_status === 'active',
      deliveryAvailable: apiShop.sh_delivery_option === 'Available',
      phone: `+${apiShop.sh_primary_phone}`,
      secondaryPhone: apiShop.sh_secondary_phone ? `+${apiShop.sh_secondary_phone}` : null,
      whatsapp: `+${apiShop.sh_whatsapp_number}`,
      email: apiShop.sh_email,
      gallery: {
        mainImage: apiShop.shopimages?.[0]
          ? `${baseImageUrl}${apiShop.shopimages[0].si_image}`
          : '/imagetwo.png',
        topImage: apiShop.shopimages?.[1]
          ? `${baseImageUrl}${apiShop.shopimages[1].si_image}`
          : apiShop.shopimages?.[0]
            ? `${baseImageUrl}${apiShop.shopimages[0].si_image}`
            : '/imagethree.png',
        thumbnails: apiShop.shopimages?.slice(0, 2).map(img => `${baseImageUrl}${img.si_image}`) || ['/imagefour.png', '/imagefive.png'],
        additionalImagesCount: Math.max(0, (apiShop.shopimages?.length || 0) - 2)
      },
      about: {
        description: apiShop.sh_description,
        productsAndServices: parseProductsAndServices(apiShop.sh_product_and_service),
        openingHours: `Open: ${apiShop.sh_opening_hours}`,
        workingDays: parseWorkingDays(apiShop.sh_working_days)
      },
      reviews: [
        {
          id: 1,
          name: "Sample Customer",
          rating: Math.max(apiShop.sh_ratings || 4, 4),
          comment: `Great ${apiShop.sh_shop_or_service}! Highly recommended.`,
          date: "2025-01-20"
        }
      ],
      coordinates: {
        latitude: parseFloat(apiShop.sh_latitude),
        longitude: parseFloat(apiShop.sh_longitude)
      },
      serviceAreaCoverage: apiShop.sh_service_area_coverage
    };
  };

  // Helper functions
  const parseWorkingDays = (workingDaysStr) => {
    try {
      const cleanStr = workingDaysStr.replace(/[\[\]]/g, '');
      return cleanStr.split(' ').filter(day => day.trim());
    } catch {
      return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    }
  };

  const parseProductsAndServices = (servicesStr) => {
    try {
      const cleanStr = servicesStr.replace(/[\[\]]/g, '');
      return cleanStr.split(' ').filter(service => service.trim());
    } catch {
      return ['Services Available'];
    }
  };

  const calculateDistance = (lat, lng) => {
    // Simple distance calculation - you can improve this with actual geolocation
    const randomDistance = (Math.random() * 5 + 0.5).toFixed(1);
    return `${randomDistance}km away`;
  };

  // Fetch data from API using POST method
  const fetchShopData = async () => {
    if (listingData) {
      // If listingData is provided, use it directly
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Default request body for POST
      const postData = requestData || {
        // Add any required POST parameters here
        // For example: city, category, etc.
      };

      const response = await axios.post(`${API_BASE_URL}/shop/list/shop`, postData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.data.result && response.data.list && response.data.list.length > 0) {
        let shopData;

        if (shopId) {
          // Find specific shop by ID
          shopData = response.data.list.find(shop => shop.sh_id === parseInt(shopId));
        } else {
          // Use first shop from list
          shopData = response.data.list[0];
        }

        if (shopData) {
          const transformedData = transformApiData(shopData);
          setApiData(transformedData);
        } else {
          setError('Shop not found');
        }
      } else {
        setError('No shop data available');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (err.response) {
        setError(`Server error: ${err.response.status} - ${err.response.statusText}`);
      } else if (err.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError(`Failed to fetch data: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when component mounts or dependencies change
  useEffect(() => {
    if (!listingData) {
      fetchShopData();
    }
  }, [shopId, requestData]);

  // Determine which data to use
  const data = listingData || apiData || defaultData;

  const handleCall = () => {
    if (data.phone) {
      window.location.href = `tel:${data.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (data.whatsapp) {
      const cleanNumber = data.whatsapp.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleEdit = () => {
    console.log('Edit listing:', data.id);
    // You can add edit functionality here
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`star ${index < Math.floor(rating) ? 'filled' : 'empty'}`}
      />
    ));
  };

  const renderTabContent = () => {
    if (activeTab === "about") {
      return (
        <div className="content">
          <p>{data.about.description}</p>

          <h4>Products and Services</h4>
          <ul>
            {data.about.productsAndServices.map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>

          <h4>Opening Hours</h4>
          <p>{data.about.openingHours}</p>

          {data.about.workingDays && data.about.workingDays.length > 0 && (
            <>
              <h4>Working Days</h4>
              <p>{data.about.workingDays.join(', ')}</p>
            </>
          )}

          {data.ownerName && (
            <>
              <h4>Owner</h4>
              <p>{data.ownerName}</p>
            </>
          )}

          {data.category && (
            <>
              <h4>Category</h4>
              <p>{data.category}</p>
            </>
          )}

          {data.address && (
            <>
              <h4>Address</h4>
              <p>{data.address}</p>
            </>
          )}

          {data.email && (
            <>
              <h4>Email</h4>
              <p>{data.email}</p>
            </>
          )}
        </div>
      );
    } else if (activeTab === "reviews") {
      return (
        <div className="content">
          <div className="reviews-section">
            {data.reviews && data.reviews.length > 0 ? (
              data.reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <span className="reviewer-name">{review.name}</span>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p>No reviews available yet.</p>
            )}
          </div>
        </div>
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="listing-card loading-state">
        <div className="loading-content">
          <FaSpinner className="spinner" />
          <p>Loading shop details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="listing-card error-state">
        <div className="error-content">
          <p>Error: {error}</p>
          <button onClick={fetchShopData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-card">
      {/* ---------- Hero / Banner ---------- */}
      <div className="banner">
        <img
          src={data.bannerImage}
          alt={`${data.name} banner`}
          className="banner-img"
          onError={(e) => {
            e.target.src = '/imageone.png';
          }}
        />
        <span className="badge-distance">{data.distance}</span>
        <FaHeart className="icon-heart" />
      </div>

      {/* ---------- Details ---------- */}
      <div className="details">
        {/* Top row: name, rating, meta */}
        <div className="header-info">
          <div className="title-section">
            <h2 className="title">{data.name}</h2>
            {data.category && <span className="category-badge">{data.category}</span>}
            {data.shopType && <span className="shop-type-badge">{data.shopType}</span>}
          </div>

          <div className="rating">
            <FaStar className="star" />
            {data.rating} <span className="review-count">({data.reviewCount} Reviews)</span>
          </div>

          <div className="meta">
            <FiMapPin /> {data.location}
            <span className={`status ${data.isOpen ? 'open' : 'closed'}`}>
              • {data.status}
            </span>
            {data.deliveryAvailable && (
              <span className="delivery">
                <FaTruck /> Delivery Available
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
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

        {/* ---------- Photo gallery ---------- */}
        <div className="gallery-wrapper">
          {/* ---------- Left: large hero ---------- */}
          <div className="gallery-left">
            <img
              src={data.gallery.mainImage}
              alt={`${data.name} main gallery image`}
              onError={(e) => {
                e.target.src = '/imagetwo.png';
              }}
            />
          </div>

          {/* ---------- Right column ---------- */}
          <div className="gallery-right">
            {/* Row 1 — one wide image */}
            <div className="top-image">
              <img
                src={data.gallery.topImage}
                alt={`${data.name} featured image`}
                onError={(e) => {
                  e.target.src = '/imagethree.png';
                }}
              />
            </div>

            {/* Row 2 — TWO square thumbnails */}
            <div className="bottom-images">
              {/* Left thumbnail */}
              {data.gallery.thumbnails[0] && (
                <img
                  src={data.gallery.thumbnails[0]}
                  alt={`${data.name} thumbnail 1`}
                  className="thumb"
                  onError={(e) => {
                    e.target.src = '/imagefour.png';
                  }}
                />
              )}

              {/* Right thumbnail with +N overlay */}
              {data.gallery.thumbnails[1] && (
                <div className="thumb overlay-container">
                  <img
                    src={data.gallery.thumbnails[1]}
                    alt={`${data.name} thumbnail 2`}
                    onError={(e) => {
                      e.target.src = '/imagefive.png';
                    }}
                  />
                  {data.gallery.additionalImagesCount > 0 && (
                    <span className="overlay-text">
                      +{data.gallery.additionalImagesCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ---------- Tabs ---------- */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About Us
          </button>
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {/* ---------- Tab content ---------- */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ListingCard;
