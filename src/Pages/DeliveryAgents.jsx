import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeliveryAgents.css";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Transform API data to display format
  const transformAgent = (agent) => ({
    id: agent.u_id,
    name: agent.u_name?.trim(),
    rating: agent.u_rating || 4.5, // fallback fake rating if not present
    reviews: 120, // fallback, or fetch actual review count if you have it
    distance: "1.5 km Away", // static or calculate if available
    profilePic: `${'https://lunarsenterprises.com:6031/'}${agent.u_profile_pic}`,
    mobile: agent.u_mobile,
    whatsapp: agent.u_whatsapp_contact,
    status: agent.u_status,
  });

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
        if (response.data.result && Array.isArray(response.data.list)) {
          setAgents(response.data.list.map(transformAgent));
        } else {
          setError("No delivery agents found.");
        }
      } catch {
        setError("Failed to fetch agents.");
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="delivery-container">
        <h2>Find your delivery agent</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="delivery-container">
        <h2>Find your delivery agent</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h2>Find your delivery agent</h2>
        <a href="#" className="view-all">
          View All →
        </a>
      </div>
      <div className="delivery-cards">
        {agents.map((agent) => (
          <div className="delivery-card" key={agent.id}>
            <div className="delivery-card-top">
              <div className="delivery-avatar">
                <img
                  src={agent.profilePic}
                  alt="delivery"
                  style={{ borderRadius: "50%", width: 50, height: 50 }}
                />
              </div>
              <div className="delivery-info">
                <h3>{agent.name}</h3>
                <p>
                  <span className="star">★</span> {agent.rating} ( {agent.reviews} Reviews )
                </p>
              </div>
              <div className="delivery-distance">{agent.distance}</div>
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
                onClick={() =>
                  window.open(
                    `https://wa.me/${agent.whatsapp}`,
                    "_blank"
                  )
                }
              >
                <img
                  src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                  alt="WhatsApp"
                />{" "}
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryAgents;
