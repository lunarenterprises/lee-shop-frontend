import React, { useState, useEffect } from 'react';
import './ServiceProfileComponent.css';
import {
    FaStar,
    FaMapMarkerAlt,
    FaTruck,
    FaClock,
    FaHeart,
    FaShare,
    FaPhone,
    FaEdit,
    FaDirections,
    FaWhatsappSquare
} from 'react-icons/fa';

const ServiceProfileComponent = ({ shopData, isOwner = true }) => {
    const [activeTab, setActiveTab] = useState('about');
    const [showAllImages, setShowAllImages] = useState(false);
    const [shopInfo, setShopInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userData = JSON.parse(localStorage.getItem("userData"));

    // Default shop data fallback
    const defaultShopData = {
        name: "Cakezone",
        rating: 4.5,
        reviewCount: 120,
        location: "Panampilly Nagar, Kochi",
        availability: "Open 7 am to 9 pm",
        deliveryAvailable: true,
        distance: "1.5 km away",
        phone: "+91 98765 43210",
        whatsapp: "+91 98765 43210",
        description: "CakeZone is your go-to neighborhood bakery known for fresh, handcrafted cakes and a cozy, personalized service experience.",
        products: [
            "Customized Birthday Cakes",
            "Chocolate Truffle, Red Velvet, and Photo Cakes",
            "Eggless and Sugar-free Options",
            "Pre-orders for Events"
        ],
        openingHours: "Open Daily: 7:00 AM – 9:00 PM",
        images: ["/api/placeholder/800/400"]
    };

    // Fetch shop data from API
    useEffect(() => {
        const fetchShopData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://lunarsenterprises.com:6031/leeshop/shop/list/shop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sh_id: userData?.id || userData?.sh_id || "16"
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch shop data');
                }

                const data = await response.json();

                if (data.result && data.list && data.list.length > 0) {
                    const shop = data.list[0];

                    // Parse products/services string to array
                    let products = [];
                    try {
                        const productString = shop.sh_product_and_service;
                        if (productString && productString.startsWith('[') && productString.endsWith(']')) {
                            products = productString.slice(1, -1).split(' ').filter(item => item.length > 0);
                        }
                    } catch (e) {
                        products = ["Hair Styling", "Skin Care", "Bridal Makeup", "Spa Services"];
                    }

                    // Format phone numbers
                    const formatPhone = (phone) => {
                        if (!phone) return "";
                        const phoneStr = phone.toString();
                        return phoneStr.startsWith('+91') ? phoneStr : `+91${phoneStr}`;
                    };

                    // Process shop images
                    const shopImages = shop.shopimages && shop.shopimages.length > 0
                        ? shop.shopimages.map(img => `https://lunarsenterprises.com:6031${img.si_image}`)
                        : ["/api/placeholder/800/400"];

                    const processedShopData = {
                        name: shop.sh_name || "Shop Name",
                        rating: shop.sh_ratings || 0,
                        reviewCount: 0, // Not provided in API
                        location: `${shop.sh_location || ''}, ${shop.sh_city || ''}, ${shop.sh_state || ''}`.replace(/^,\s*|,\s*$/g, ''),
                        availability: shop.sh_opening_hours ? `Open ${shop.sh_opening_hours}` : "Contact for hours",
                        deliveryAvailable: shop.sh_delivery_option === "Available",
                        distance: "1.5 km away", // Calculate based on coordinates if needed
                        phone: formatPhone(shop.sh_primary_phone),
                        whatsapp: formatPhone(shop.sh_whatsapp_number),
                        description: shop.sh_description || "Professional service provider",
                        products: products,
                        openingHours: shop.sh_opening_hours ? `Open Daily: ${shop.sh_opening_hours}` : "Contact for hours",
                        category: shop.sh_category_name || "Service",
                        owner: shop.sh_owner_name || "Owner",
                        email: shop.sh_email || "",
                        address: shop.sh_address || "",
                        workingDays: shop.sh_working_days || "",
                        images: shopImages
                    };

                    setShopInfo(processedShopData);
                } else {
                    throw new Error('No shop data found');
                }
            } catch (err) {
                console.error('Error fetching shop data:', err);
                setError(err.message);
                setShopInfo(defaultShopData); // Use default data on error
            } finally {
                setLoading(false);
            }
        };

        if (userData?.id || userData?.sh_id) {
            fetchShopData();
        } else {
            setShopInfo(defaultShopData);
            setLoading(false);
        }
    }, [userData?.id, userData?.sh_id]);

    const shop = shopData || shopInfo || defaultShopData;

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={i} className="star filled" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStar key="half" className="star half" />);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaStar key={`empty-${i}`} className="star" />);
        }

        return stars;
    };

    const handleContact = () => {
        if (shop.phone) {
            window.open(`tel:${shop.phone}`, '_self');
        }
    };

    const handleWhatsapp = () => {
        if (shop.whatsapp) {
            const message = `Hi! I'm interested in your services at ${shop.name}`;
            const phoneNumber = shop.whatsapp.replace(/\D/g, '');
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }
    };

    const handleDirections = () => {
        console.log('Opening directions to:', shop.location);
        // Implement directions functionality
    };

    const handleEdit = () => {
        console.log('Edit shop profile');
        // Implement edit functionality
    };

    if (loading) {
        return (
            <div className="shop-profile loading">
                <div className="loading-spinner">Loading shop information...</div>
            </div>
        );
    }

    return (
        <div className="shop-profile">
            {/* Cover Section */}
            <div className="cover-section">
                <div className="cover-image">
                    <img
                        src={shop.images[0]}
                        alt={shop.name}
                        className="cover-img"
                        onError={(e) => {
                            e.target.src = "/api/placeholder/800/400";
                        }}
                    />
                    <div className="cover-overlay">
                        <div className="distance-badge">{shop.distance}</div>
                        <div className="favorite-btn">
                            <FaHeart />
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Info Section */}
            <div className="shop-info">
                <div className="shop-header">
                    <h1 className="shop-name">{shop.name}</h1>
                    <div className="shop-actions">
                        <button className="action-btn whatsapp-btn" onClick={handleWhatsapp}>
                            <FaWhatsappSquare />
                        </button>
                        <button className="action-btn" onClick={handleDirections}>
                            <FaDirections />
                        </button>
                        <button className="action-btn">
                            <FaShare />
                        </button>
                        {isOwner && (
                            <button className="action-btn edit-btn" onClick={handleEdit}>
                                <FaEdit />
                            </button>
                        )}
                    </div>
                </div>

                <div className="shop-details">
                    <div className="rating-info">
                        <div className="stars">
                            {renderStars(shop.rating)}
                        </div>
                        <span className="rating-text">
                            {shop.rating} ({shop.reviewCount} Reviews)
                        </span>
                    </div>

                    <div className="location-info">
                        <FaMapMarkerAlt className="icon" />
                        <span>{shop.location}</span>
                    </div>

                    <div className="status-info">
                        <div className="availability">
                            <FaClock className="icon" />
                            <span className="status open">{shop.availability}</span>
                        </div>
                        {shop.deliveryAvailable && (
                            <div className="delivery-availablity">
                                <FaTruck className="icon" />
                                <span>Delivery Available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="contact-btn" onClick={handleContact}>
                        <FaPhone className="btn-icon" />
                        Contact
                    </button>
                    <button className="whatsapp-btn-main" onClick={handleWhatsapp}>
                        <FaWhatsappSquare className="btn-icon" />
                        WhatsApp
                    </button>
                </div>
            </div>

            {/* Images Gallery */}
            <div className="images-gallery">
                <div className="main-image">
                    <img
                        src={shop.images[0]}
                        alt="Gallery main"
                        onError={(e) => {
                            e.target.src = "/api/placeholder/200/150";
                        }}
                    />
                </div>
                <div className="side-images">
                    {shop.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="side-image">
                            <img
                                src={image}
                                alt={`Gallery ${index + 2}`}
                                onError={(e) => {
                                    e.target.src = "/api/placeholder/200/150";
                                }}
                            />
                            {index === 3 && shop.images.length > 5 && (
                                <div className="more-overlay">
                                    <span>+{shop.images.length - 5}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Tabs */}
            <div className="content-section">
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'about' ? 'active' : ''}`}
                        onClick={() => setActiveTab('about')}
                    >
                        About Us
                    </button>
                    <button
                        className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'about' && (
                        <div className="about-content">
                            <p className="description">{shop.description}</p>

                            {shop.category && (
                                <div className="category-section">
                                    <h3>Category</h3>
                                    <p>{shop.category}</p>
                                </div>
                            )}

                            <div className="products-section">
                                <h3>Products and services</h3>
                                <ul className="products-list">
                                    {shop.products.map((product, index) => (
                                        <li key={index}>{product}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="hours-section">
                                <h3>Opening Hours</h3>
                                <p>{shop.openingHours}</p>
                                {shop.workingDays && (
                                    <p className="working-days">Working Days: {shop.workingDays}</p>
                                )}
                            </div>

                            {shop.address && (
                                <div className="address-section">
                                    <h3>Address</h3>
                                    <p>{shop.address}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="reviews-content">
                            <p>Reviews content will be displayed here...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServiceProfileComponent;
