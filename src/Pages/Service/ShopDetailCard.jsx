import React from "react";
import "./ShopDetailCard.css";
import { FaStar, FaHeart, FaPhoneAlt, FaWhatsapp, FaTruck } from "react-icons/fa";
import { FiMapPin, FiShare2 } from "react-icons/fi";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

// shop: the main shop object (to detail-show)
// shopsList: the shop list array for sidebar (all shops, so we can exclude the current and map others as "Similar")
// servicesNearby: array of service cards (optional, can be empty for now)
const ShopDetailCard = ({ shop, shopsList = [], servicesNearby = [] }) => {
    if (!shop || shop.error) {
        return (
            <div className="shop-detail-error">
                {shop?.error || "No shop data found."}
            </div>
        );
    }

    // Main image and gallery
    const shopImage =
        shop.shopimages?.[0]?.si_image
            ? 'https://lunarsenterprises.com:6031/' + shop.shopimages[0].si_image
            : "/shop.png";

    const gallery =
        Array.isArray(shop.shopimages) && shop.shopimages.length > 0
            ? shop.shopimages.map((img) => 'https://lunarsenterprises.com:6031/' + img.si_image)
            : [shopImage];

    // Info fields
    const category = shop.sh_category_name || shop.category_name || "";
    const address =
        shop.sh_address ||
        shop.address ||
        [shop.sh_location, shop.sh_city, shop.sh_state].filter(Boolean).join(", ");
    const phone = shop.sh_primary_phone || shop.primary_phone || "";
    const whatsapp = shop.sh_whatsapp_number || shop.whatsapp_number || "";

    const products =
        (shop.sh_product_and_service || shop.product_and_service || "")
            .replace(/[\[\]]/g, "")
            .split(" ")
            .filter(Boolean);

    // Similar shops: all items in list except the one being shown
    const similarShops = Array.isArray(shopsList)
        ? shopsList
            .filter((item) => item.sh_id !== shop.sh_id)
            .map((item) => ({
                id: item.sh_id,
                name: item.sh_name,
                distance: "2 km away", // You may compute actual distance
                rating: item.sh_ratings || 0,
                reviewCount: 0,
                location: [item.sh_location, item.sh_city].filter(Boolean).join(", "),
                image:
                    item.shopimages?.[0]?.si_image
                        ? 'https://lunarsenterprises.com:6031/' + item.shopimages[0].si_image
                        : "/shop.png",
            }))
        : [];

    // ServicesNearby: If you want real data, map and pass as prop (see above)
    // otherwise it's empty or mocked

    return (
        <div className="shop-details-layout">
            {/* ===== Sidebar: Similar Shops & Services Nearby ===== */}
            <div className="sidebar-suggestions">
                <div className="nearby-group">
                    <h3 className="sidebar-title">Similar Shops Nearby</h3>
                    {similarShops.length === 0 ? (
                        <div style={{ padding: "7px 10px 9px", color: "#b1bbd3" }}>
                            No similar shops found.
                        </div>
                    ) : (
                        similarShops.map((item) => (
                            <div className="sidebar-card" key={item.id + "-similar"}>
                                <img src={item.image} alt={item.name} className="sidebar-thumb" />
                                <div className="sidebar-details">
                                    <div>
                                        <div className="sidebar-name">{item.name}</div>
                                        <div className="sidebar-location">{item.location}</div>
                                    </div>
                                    <div className="sidebar-rating">
                                        <FaStar style={{ color: "#FFA542", marginRight: 2 }} />
                                        {item.rating}{" "}
                                        <span className="sidebar-reviews">
                                            ({item.reviewCount || 0} Reviews)
                                        </span>
                                    </div>
                                    <div className="sidebar-dist">{item.distance}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="nearby-group">
                    <h3 className="sidebar-title">Services Nearby</h3>
                    {servicesNearby.length === 0 ? (
                        <div style={{ padding: "7px 10px 9px", color: "#b1bbd3" }}>
                            No services found nearby.
                        </div>
                    ) : (
                        servicesNearby.map((item) => (
                            <div className="sidebar-card" key={item.id + "-service"}>
                                <img src={item.image} alt={item.name} className="sidebar-thumb" />
                                <div className="sidebar-details">
                                    <div>
                                        <div className="sidebar-name">{item.name}</div>
                                        <div className="sidebar-location">{item.location}</div>
                                    </div>
                                    <div className="sidebar-rating">
                                        <FaStar style={{ color: "#FFA542", marginRight: 2 }} />
                                        {item.rating}{" "}
                                        <span className="sidebar-reviews">
                                            ({item.reviewCount || 0} Reviews)
                                        </span>
                                    </div>
                                    <div className="sidebar-dist">{item.distance}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* ===== Main Shop Detail Card ===== */}
            <div className="shop-detailed-card">
                <div className="shop-banner">
                    <img src={shopImage} alt="Shop banner" />
                    <span className="ribbon">2 km away</span>
                    <button className="fav-button">
                        <FaHeart />
                    </button>
                </div>
                <div className="shop-main-details">
                    <h2>{shop.sh_name || shop.name}</h2>
                    <div className="shop-rating-row">
                        <span className="shop-star">
                            <FaStar /> {shop.sh_ratings || shop.rating || 0}
                        </span>
                        <span className="shop-reviews">
                            ({shop.reviewCount || 0} Reviews)
                        </span>
                        <span
                            className={`shop-open ${shop.sh_status === "active" || shop.isOpen ? "open" : "closed"
                                }`}
                        >
                            •{" "}
                            {shop.sh_status === "active" || shop.isOpen
                                ? `Open ${shop.sh_opening_hours || shop.opening_hours || ""}`
                                : "Closed"}
                        </span>
                        {(shop.sh_delivery_option === "Available" || shop.delivery) && (
                            <span className="shop-delivery">
                                <FaTruck /> Delivery Available
                            </span>
                        )}
                    </div>
                    <div className="shop-loc-row">
                        <FiMapPin />{" "}
                        <span>
                            {shop.sh_location || shop.location}
                            {shop.sh_city || shop.city ? `, ${shop.sh_city || shop.city}` : ""}
                        </span>
                        <span className="shop-share">
                            <FiShare2 />
                        </span>
                    </div>
                    <p className="shop-address">{address}</p>
                    {category && (
                        <div
                            className="shop-category"
                            style={{
                                fontSize: "0.96rem",
                                color: "#1976d2",
                                margin: "9px 0 2px 0",
                            }}
                        >
                            <b>Category:</b> {category}
                        </div>
                    )}
                </div>
                <div className="shop-actions-row">
                    {phone && (
                        <button
                            className="shop-btn-primary"
                            onClick={() => window.location.href = `tel:${phone}`}
                        >
                            <FaPhoneAlt /> Contact Now
                        </button>
                    )}
                    {whatsapp && (
                        <button
                            className="shop-btn-whatsapp"
                            onClick={() =>
                                window.open(`https://wa.me/${whatsapp}`, "_blank")
                            }
                        >
                            <FaWhatsapp /> WhatsApp
                        </button>
                    )}
                    <button className="shop-btn-share">
                        <FiShare2 /> Share
                    </button>
                </div>
                <div className="shop-gallery-list">
                    {gallery.map((img, i) => (
                        <img key={i} src={img} alt={`gallery${i + 1}`} className="gallery-thumb" />
                    ))}
                </div>
                <div className="shop-tabs-bar">
                    <button className="active">About Us</button>
                    <button>Reviews</button>
                </div>
                <div className="shop-about-block">
                    <p>{shop.sh_description || shop.description}</p>
                    <h4>Products and Services</h4>
                    <ul>
                        {products.length === 0 ? (
                            <li>No products/services listed</li>
                        ) : (
                            products.map((item, idx) => <li key={idx}>{item}</li>)
                        )}
                    </ul>
                    <h4>Opening Hours</h4>
                    <p>{shop.sh_opening_hours || shop.opening_hours}</p>
                </div>
            </div>
        </div>
    );
};

export default ShopDetailCard;
