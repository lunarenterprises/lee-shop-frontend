import React from "react";
import "./DeliveryAgents.css";

const agents = [
  {
    name: "Rahul Kumar",
    rating: 4.5,
    reviews: 120,
    distance: "1.5 km Away",
  },
  {
    name: "Rahul Kumar",
    rating: 4.5,
    reviews: 120,
    distance: "1.5 km Away",
  },
  {
    name: "Rahul Kumar",
    rating: 4.5,
    reviews: 120,
    distance: "1.5 km Away",
  },
  {
    name: "Rahul Kumar",
    rating: 4.5,
    reviews: 120,
    distance: "1.5 km Away",
  },
];

function DeliveryAgents() {
  return (
    <div className="delivery-container">
      <div className="delivery-header">
        <h2>Find your delivery agent</h2>
        <a href="#" className="view-all">
          View All →
        </a>
      </div>
      <div className="delivery-cards">
        {agents.map((agent, index) => (
          <div className="delivery-card" key={index}>
            <div className="delivery-card-top">
              <div className="delivery-avatar">
                <img
                  src="https://img.icons8.com/ios-filled/50/delivery.png"
                  alt="delivery"
                />
              </div>
              <div className="delivery-info">
                <h3>{agent.name}</h3>
                <p>
                  <span className="star">★</span> {agent.rating} (
                  {agent.reviews} Reviews)
                </p>
              </div>
              <div className="delivery-distance">{agent.distance}</div>
            </div>
            <div className="delivery-buttons">
              <button className="contact-btn">📞 Contact Now</button>
              <button className="whatsapp-btn">
                <img
                  src="https://img.icons8.com/ios-filled/20/25D366/whatsapp.png"
                  alt="WhatsApp"
                />
                What's app
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeliveryAgents;
