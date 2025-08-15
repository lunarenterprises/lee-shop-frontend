import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DeliveryAgents.css";
import { FaUser } from "react-icons/fa";

const API_BASE_URL = "https://lunarsenterprises.com:6031/leeshop";

function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorIds, setErrorIds] = useState(new Set());

  const handleImgError = (id) => {
    setErrorIds((prev) => new Set(prev).add(id));
  };

  // Transform API data to display format
  const transformAgent = (agent) => ({
    id: agent.u_id,
    name: agent.u_name?.trim(),
    rating: agent.u_rating || 4.5, // fallback fake rating if not present
    reviews: 120, // fallback, or fetch actual review count if you have it
    distance: "1.5 km Away", // static or calculate if available
    profilePic: `${"https://lunarsenterprises.com:6031/"}${
      agent.u_profile_pic
    }`,
    mobile: agent.u_mobile,
    whatsapp: agent.u_whatsapp_contact,
    status: agent.u_status,
    location: agent.u_location || "Edapally, Kochi", // fallback location
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

  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    backgroundColor: "#bcee66", // Avatar background color
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className="delivery-container2">
      <div className="delivery-header">
        <h2>Find your delivery agent</h2>
        <a href="#" className="view-all">
          View All →
        </a>
      </div>
      <div className="delivery-cards">
        {agents.map((agent) => (
          <div className="delivery-card" key={agent.id}>
            <div className="delivery-card-header">
              <div className="delivery-avatar">
                {agent?.profilePic && !errorIds.has(agent.id) ? (
                  <img
                    src={agent.profilePic}
                    alt={agent.name}
                    onError={() => handleImgError(agent.id)}
                    style={{ width: 40, height: 40, borderRadius: "50%" }}
                  />
                ) : (
                  <div style={avatarStyle}>
                    <FaUser color="#fff" size={20} />
                  </div>
                )}
              </div>
              <div className="delivery-info">
                <h3>{agent.name}</h3>
                <div className="delivery-rating">
                  <span className="star">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 25 25"
                      fill="none"
                    >
                      <path
                        d="M12.4996 17.7752L8.17669 20.2752C7.98572 20.3919 7.78607 20.4419 7.57773 20.4252C7.3694 20.4085 7.18711 20.3419 7.03086 20.2252C6.87461 20.1085 6.75308 19.9629 6.66628 19.7882C6.57947 19.6135 6.56211 19.4175 6.61419 19.2002L7.76003 14.4752L3.9319 11.3002C3.75829 11.1502 3.64996 10.9792 3.6069 10.7872C3.56385 10.5952 3.57669 10.4079 3.64544 10.2252C3.71419 10.0425 3.81836 9.89253 3.95794 9.7752C4.09753 9.65786 4.2885 9.58286 4.53086 9.5502L9.58294 9.1252L11.5361 4.6752C11.6229 4.4752 11.7576 4.3252 11.9402 4.2252C12.1229 4.1252 12.3093 4.0752 12.4996 4.0752C12.6899 4.0752 12.8763 4.1252 13.059 4.2252C13.2416 4.3252 13.3763 4.4752 13.4632 4.6752L15.4163 9.1252L20.4684 9.5502C20.7114 9.58353 20.9024 9.65853 21.0413 9.7752C21.1802 9.89186 21.2843 10.0419 21.3538 10.2252C21.4232 10.4085 21.4364 10.5962 21.3934 10.7882C21.3503 10.9802 21.2416 11.1509 21.0673 11.3002L17.2392 14.4752L18.385 19.2002C18.4371 19.4169 18.4197 19.6129 18.3329 19.7882C18.2461 19.9635 18.1246 20.1092 17.9684 20.2252C17.8121 20.3412 17.6298 20.4079 17.4215 20.4252C17.2132 20.4425 17.0135 20.3925 16.8225 20.2752L12.4996 17.7752Z"
                        fill="#E8C930"
                      />
                    </svg>
                  </span>
                  <span className="rating-text">
                    {agent.rating} ({agent.reviews} Reviews)
                  </span>
                </div>
              </div>
              <div className="delivery-distance">{agent.distance}</div>
            </div>
            <div className="delivery-location-status">
              <div className="location-section">
                <div className="location-row">
                  <span className="location-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                      fill="none"
                    >
                      <path
                        d="M5 6.65C4.57376 6.65 4.16498 6.46563 3.86358 6.13744C3.56218 5.80925 3.39286 5.36413 3.39286 4.9C3.39286 4.43587 3.56218 3.99075 3.86358 3.66256C4.16498 3.33437 4.57376 3.15 5 3.15C5.42624 3.15 5.83502 3.33437 6.13642 3.66256C6.43782 3.99075 6.60714 4.43587 6.60714 4.9C6.60714 5.12981 6.56557 5.35738 6.48481 5.5697C6.40404 5.78202 6.28566 5.97493 6.13642 6.13744C5.98718 6.29994 5.81001 6.42884 5.61503 6.51679C5.42004 6.60473 5.21105 6.65 5 6.65ZM5 0C3.80653 0 2.66193 0.516248 1.81802 1.43518C0.974106 2.3541 0.5 3.60044 0.5 4.9C0.5 8.575 5 14 5 14C5 14 9.5 8.575 9.5 4.9C9.5 3.60044 9.02589 2.3541 8.18198 1.43518C7.33807 0.516248 6.19347 0 5 0Z"
                        fill="black"
                      />
                    </svg>
                  </span>
                  <span className="location-label">Location</span>
                </div>
                <div className="location-name">{agent.location}</div>
              </div>
              <div className="status">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <circle cx="6" cy="6" r="5.5" fill="#3DBB34" />
                  </svg>
                </span>
                <span className="status-text">Available for Delivery</span>
              </div>
            </div>
            <div className="delivery-buttons">
              <button
                className="contact-btn2"
                onClick={() => {
                  if (agent?.mobile) {
                    window.location.href = `tel:${agent.mobile}`;
                  }
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                >
                  <path
                    d="M16.537 20.1876C15.7364 20.1876 14.6117 19.898 12.9276 18.9571C10.8797 17.8087 9.29568 16.7484 7.25884 14.7169C5.29501 12.7543 4.33935 11.4837 3.00183 9.04982C1.49082 6.30177 1.74839 4.8613 2.03632 4.24565C2.37921 3.50983 2.88535 3.06974 3.53955 2.63292C3.91113 2.38947 4.30435 2.18077 4.71423 2.00948C4.75525 1.99185 4.79339 1.97503 4.82744 1.95985C5.03046 1.86839 5.33808 1.73017 5.72773 1.87782C5.98777 1.97544 6.21992 2.17519 6.58332 2.53407C7.32857 3.26907 8.34699 4.90601 8.72269 5.70991C8.97494 6.25173 9.14187 6.60939 9.14228 7.01052C9.14228 7.48015 8.90603 7.84232 8.61933 8.23319C8.5656 8.30661 8.51228 8.37675 8.4606 8.44483C8.14847 8.85499 8.07998 8.97353 8.12509 9.18517C8.21656 9.6105 8.89865 10.8767 10.0196 11.9951C11.1406 13.1136 12.3702 13.7527 12.7972 13.8437C13.0178 13.8909 13.1388 13.8195 13.5621 13.4963C13.6228 13.45 13.6852 13.402 13.7504 13.354C14.1876 13.0287 14.533 12.7986 14.9915 12.7986H14.994C15.3931 12.7986 15.7347 12.9717 16.3007 13.2572C17.039 13.6296 18.7252 14.6349 19.4647 15.381C19.8244 15.7436 20.025 15.9749 20.123 16.2345C20.2706 16.6254 20.1316 16.9318 20.041 17.1369C20.0258 17.1709 20.009 17.2082 19.9913 17.2497C19.8187 17.6588 19.6087 18.0512 19.3642 18.4219C18.9282 19.074 18.4865 19.5789 17.749 19.9222C17.3703 20.1014 16.9559 20.1921 16.537 20.1876Z"
                    fill="#D4F49C"
                  />
                </svg>
                Contact Now
              </button>

              <button
                className="whatsapp-btn2"
                onClick={() =>
                  window.open(`https://wa.me/${agent.whatsapp}`, "_blank")
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="19"
                  height="20"
                  viewBox="0 0 19 20"
                  fill="none"
                >
                  <g clip-path="url(#clip0_291_731)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.2316 3.25896C14.4458 1.4807 12.0706 0.500902 9.5399 0.5C4.32519 0.5 0.0811965 4.7201 0.079382 9.90736C0.0784748 11.5656 0.514396 13.1842 1.34224 14.6106L0 19.4861L5.01513 18.1779C6.39682 18.9277 7.95271 19.3224 9.53584 19.3229H9.5399C14.7537 19.3229 18.9982 15.1023 19 9.91502C19.0009 7.40104 18.0179 5.03768 16.2316 3.25941V3.25896ZM9.5399 17.7341H9.53673C8.12598 17.7336 6.74204 17.3565 5.53454 16.6442L5.24739 16.4746L2.27124 17.2509L3.06551 14.3652L2.87862 14.0693C2.0916 12.8242 1.67564 11.3852 1.67655 9.90784C1.67836 5.5966 5.20565 2.08879 9.54312 2.08879C11.6433 2.0897 13.6175 2.90395 15.1021 4.38222C16.5868 5.86005 17.4037 7.82508 17.4028 9.91413C17.401 14.2258 13.8737 17.7336 9.5399 17.7336V17.7341ZM13.8528 11.8778C13.6165 11.7601 12.4544 11.1916 12.2375 11.1132C12.0207 11.0347 11.8633 10.9955 11.7059 11.2309C11.5485 11.4664 11.0954 11.996 10.9575 12.1525C10.8196 12.3095 10.6816 12.3289 10.4453 12.2111C10.209 12.0934 9.44738 11.8453 8.54425 11.0446C7.84162 10.4211 7.36709 9.6516 7.22924 9.41609C7.09133 9.18064 7.21472 9.05341 7.33263 8.93658C7.43876 8.83103 7.56897 8.66186 7.68735 8.52472C7.80578 8.38757 7.84478 8.28927 7.92369 8.1327C8.00264 7.97571 7.96316 7.83862 7.90421 7.72084C7.84521 7.60311 7.37258 6.446 7.17524 5.97552C6.98334 5.5172 6.78833 5.57946 6.64361 5.57179C6.50571 5.56502 6.34832 5.56367 6.19046 5.56367C6.03261 5.56367 5.77674 5.62231 5.55993 5.85779C5.34312 6.09324 4.73254 6.66209 4.73254 7.81873C4.73254 8.97536 5.57946 10.0937 5.69784 10.2507C5.81622 10.4077 7.36482 12.7818 9.73586 13.8004C10.2997 14.0426 10.7402 14.1875 11.0835 14.2957C11.6497 14.4748 12.165 14.4496 12.5723 14.3891C13.0264 14.3215 13.9708 13.8203 14.1677 13.2713C14.3645 12.7222 14.3645 12.2513 14.3056 12.1534C14.2466 12.0555 14.0888 11.9964 13.8524 11.8787L13.8528 11.8778Z"
                      fill="#0A5C15"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_291_731">
                      <rect
                        width="19"
                        height="19"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
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
