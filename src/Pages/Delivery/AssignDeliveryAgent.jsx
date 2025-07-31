import React, { useEffect, useState } from "react";
import "../Home/HomePage.css";
import "./AssignDeliveryAgent.css";
import Header from "../Home/Header";
import Footer from "../Footer";
import JoinLeeShop from "../JoinLeeShop";
import LocationSearchBar from "../LocationSearchBar";
import axios from "axios";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

// Status definition for UI and dot/color
const TABS = [
    {
        key: "available",
        label: "Available for Delivery",
        color: "#22C55E",
        apiValues: ["available", "Available", "free", "active"], // possible API status strings
    },
    {
        key: "busy",
        label: "Busy On a Delivery",
        color: "#EAB308",
        apiValues: ["busy", "Busy", "on_delivery", "on a delivery"],
    },
    {
        key: "not_available",
        label: "Not Available",
        color: "#F43F5E",
        apiValues: ["not_available", "not availble", "inactive", "Not Available"],
    },
];

// Assign status based on u_delivery_status value OR cycle/fake for mock data.
const getAgentStatus = (rawStatus, idx = 0) => {
    if (!rawStatus) {
        return TABS[idx % 3].key;
    }
    const status = rawStatus.trim().toLowerCase();
    if (TABS[0].apiValues.some((v) => status.includes(v))) return "available";
    if (TABS[1].apiValues.some((v) => status.includes(v))) return "busy";
    if (TABS[2].apiValues.some((v) => status.includes(v))) return "not_available";
    // fallback
    return TABS[idx % 3].key;
};

// Transform API data for UI
const transformAgent = (agent, idx) => {
    const status = getAgentStatus(agent.u_delivery_status, idx);
    return {
        id: agent.u_id,
        name: agent.u_name?.trim(),
        rating: agent.u_rating || 4.5,
        reviews: 120, // fallback
        distance: "1.5 km Away",
        profilePic: agent.u_profile_pic
            ? `https://lunarsenterprises.com:6031${agent.u_profile_pic}`
            : "https://img.icons8.com/ios-filled/50/delivery.png",
        mobile: agent.u_mobile,
        whatsapp: agent.u_whatsapp_contact,
        status,
        location: "Edapally, Kochi", // replace with real if available
        deliveryStatus: status,
    };
};

// Raw fallback data if API is empty or fails
const RAW_AGENTS = [
    {
        id: 1,
        name: "Asha Mohan",
        rating: 4.5,
        reviews: 120,
        distance: "1.5 km Away",
        profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        mobile: "919876543210",
        whatsapp: "919876543210",
        status: "available",
        location: "Edapally, Kochi",
        deliveryStatus: "available",
    },
    {
        id: 2,
        name: "Asha Mohan",
        rating: 4.5,
        reviews: 120,
        distance: "1.5 km Away",
        profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        mobile: "919876543210",
        whatsapp: "919876543210",
        status: "busy",
        location: "Edapally, Kochi",
        deliveryStatus: "busy",
    },
    {
        id: 3,
        name: "Asha Mohan",
        rating: 4.5,
        reviews: 120,
        distance: "1.5 km Away",
        profilePic: "https://randomuser.me/api/portraits/women/44.jpg",
        mobile: "919876543210",
        whatsapp: "919876543210",
        status: "not_available",
        location: "Edapally, Kochi",
        deliveryStatus: "not_available",
    },
];

function AssignDeliveryAgent() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState(TABS[0].key);

    useEffect(() => {
        const fetchAgents = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/deliverystaff/list/delivery_staffs`,
                    {},
                    { headers: { "Content-Type": "application/json" } }
                );
                if (response.data.result && Array.isArray(response.data.list) && response.data.list.length) {
                    setAgents(response.data.list.map(transformAgent));
                } else {
                    setAgents(RAW_AGENTS); // fallback
                }
            } catch {
                setAgents(RAW_AGENTS); // fallback
                setError("Displaying sample data. Failed to fetch agents.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    // Filter agents according to tab
    const filteredAgents = agents.filter(
        (agent) => agent.deliveryStatus === activeTab
    );

    return (
        <div className="homepage-container">
            <Header />
            <div className="homepage-hero">
                <LocationSearchBar />
            </div>
            <div className="shop-list-section">
                <div className="delivery-container">
                    <div className="delivery-header">
                        <h2>Nearby Delivery Agent</h2>
                        {/* Tab control */}
                        <div className="delivery-tabs">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    className={`delivery-tab${activeTab === tab.key ? " active" : ""}`}
                                    style={{
                                        borderColor: tab.color,
                                        color: activeTab === tab.key ? tab.color : "#555",
                                    }}
                                    onClick={() => setActiveTab(tab.key)}
                                >
                                    <span
                                        className="tab-dot"
                                        style={{
                                            background: tab.color,
                                            display: "inline-block",
                                            width: 11,
                                            height: 11,
                                            borderRadius: "50%",
                                            marginRight: 7,
                                            verticalAlign: "middle",
                                        }}
                                    />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* Alert if using fallback */}
                    {error && <div style={{ color: "#EAB308", paddingBottom: 6 }}>{error}</div>}
                    <div className="delivery-cards">
                        {loading ? (
                            <div className="delivery-loading">Loading...</div>
                        ) : filteredAgents.length === 0 ? (
                            <div className="delivery-nodata">No agents in this status.</div>
                        ) : (
                            filteredAgents.map((agent, idx) => (
                                <div className="delivery-card" key={agent.id + idx}>
                                    <div className="delivery-card-top">
                                        <div className="delivery-avatar">
                                            <img
                                                src={agent.profilePic}
                                                alt="delivery"
                                                style={{
                                                    borderRadius: "50%",
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                        <div className="delivery-info">
                                            <h3>{agent.name}</h3>
                                            <p>
                                                <span className="star">★</span> {agent.rating} ({agent.reviews} Reviews)
                                            </p>
                                        </div>
                                        <div className="delivery-distance">{agent.distance}</div>
                                    </div>
                                    <div className="delivery-badge-row">
                                        <span
                                            className="status-dot"
                                            style={{
                                                background: TABS.find(t => t.key === agent.deliveryStatus)?.color || "#888",
                                                width: 11, height: 11, borderRadius: "50%", display: "inline-block",
                                                marginRight: 6, verticalAlign: "middle"
                                            }}
                                        ></span>
                                        <span className="delivery-status-label">
                                            {
                                                TABS.find(t => t.key === agent.deliveryStatus)?.label
                                            }
                                        </span>
                                    </div>
                                    <div className="delivery-buttons">
                                        <button
                                            className="contact-btn"
                                            onClick={() => window.location.href = `tel:${agent.mobile}`}
                                        >
                                            📞 Contact Now
                                        </button>
                                        <button
                                            className="whatsapp-btn"
                                            onClick={() => window.open(`https://wa.me/${agent.whatsapp}`, "_blank")}
                                        >
                                            <img
                                                src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                                                alt="WhatsApp"
                                            /> WhatsApp
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <JoinLeeShop />
            <Footer />
        </div>
    );
}

export default AssignDeliveryAgent;
