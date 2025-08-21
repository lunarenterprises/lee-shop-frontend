"use client";

// DeliveryProfileComponent.jsx
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeliveryProfileComponent.css";

const DeliveryProfile = () => {
  /* ───────────── state ───────────── */
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobileNumber: "",
    secondaryMobile: "",
    whatsappNumber: "",
    vehicleType: "",
    workType: "",
    location: "",
  });

  const [availability, setAvailability] = useState("Not Available");
  const [profileImage, setProfileImage] = useState(
    "/placeholder.svg?height=120&width=120"
  );
  const [licenceImage, setLicenceImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [licenceFile, setLicenceFile] = useState(null);
  const [loading, setLoading] = useState(false); // Set to false for demo purposes
  const [error, setError] = useState(null);

  const getUserData = () => {
    try {
      const data = localStorage.getItem("userData");
      return data ? JSON.parse(data) : { u_id: 14, id: 14 };
    } catch {
      return { u_id: 14, id: 14 };
    }
  };

  const userData = getUserData();

  /* ───────────── fetch profile ───────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://lunarsenterprises.com:6031/leeshop/deliverystaff/list/delivery_staffs",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              u_id: userData?.u_id || userData?.id || 14,
            }),
          }
        );
        if (!res.ok) throw new Error("Network error");
        const json = await res.json();
        if (!json.result || !json.list?.length)
          throw new Error("No data found");

        const d = json.list[0];
        const fmt = (p) =>
          !p ? "" : p.toString().startsWith("+91") ? p.toString() : `+91${p}`;

        setProfileData({
          name: d.u_name?.trim() || "",
          email: d.u_email || "",
          mobileNumber: fmt(d.u_mobile),
          secondaryMobile: fmt(d.u_secondary_mobile),
          whatsappNumber: fmt(d.u_whatsapp_contact),
          vehicleType: d.u_vehicle_type?.trim() || "",
          workType: d.u_work_type?.trim() || "",
          location: d.u_location || d.u_district || "",
        });

        if (d.u_profile_pic)
          setProfileImage(
            `https://lunarsenterprises.com:6031${d.u_profile_pic}`
          );
        if (d.u_licence_pic)
          setLicenceImage(
            `https://lunarsenterprises.com:6031${d.u_licence_pic}`
          );

        setAvailability(
          d.u_delivery_status === "available"
            ? "Available"
            : d.u_delivery_status === "busy"
            ? "Busy"
            : "Not Available"
        );
      } catch (err) {
        console.log("Demo mode - using default data");
        setProfileData({
          name: "Alexis Sanchez",
          email: "alexis@example.com",
          mobileNumber: "+91 9876543210",
          secondaryMobile: "+91 9876543211",
          whatsappNumber: "+91 9876543210",
          vehicleType: "Bike",
          workType: "Full Time",
          location: "Edappally, Kochi",
        });
        setAvailability("Not Available");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.u_id, userData?.id]);

  /* ───────────── input handlers ───────────── */
  const onChange = (e) =>
    setProfileData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const onProfilePic = (e) => {
    const f = e.target.files[0];
    if (f) {
      setProfileFile(f);
      setProfileImage(URL.createObjectURL(f));
    }
  };

  const onLicencePic = (e) => {
    const f = e.target.files[0];
    if (f) {
      setLicenceFile(f);
      setLicenceImage(URL.createObjectURL(f));
    }
  };

  /* ───────────── SAVE (multipart) ───────────── */
  const handleSave = async () => {
    try {
      const fd = new FormData();
      const id = userData?.u_id || userData?.id;
      if (!id) throw new Error("User ID missing");

      fd.append("u_id", id);
      fd.append("u_name", profileData.name.trim());
      fd.append("u_email", profileData.email.trim());
      fd.append("u_mobile", profileData.mobileNumber.replace(/\D/g, ""));
      fd.append(
        "u_secondary_mobile",
        profileData.secondaryMobile.replace(/\D/g, "")
      );
      fd.append(
        "u_whatsapp_contact",
        profileData.whatsappNumber.replace(/\D/g, "")
      );
      fd.append("u_vehicle_type", profileData.vehicleType.trim());
      fd.append("u_work_type", profileData.workType.trim());

      if (profileFile) fd.append("profile", profileFile); // backend expects these keys
      if (licenceFile) fd.append("licence", licenceFile);

      const res = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/deliverystaff/edit/delivery_staffs",
        {
          method: "POST",
          body: fd,
        }
      );
      const json = await res.json();
      console.log("Result", json);
      if (!json.result) throw new Error(json.message || "Update failed");

      toast.success("Profile updated!", { position: "bottom-center" });
    } catch (err) {
      toast.error(err.message || "Save failed", { position: "bottom-center" });
    }
  };

  /* ───────────── helpers ───────────── */
  const StarIcon = ({ filled }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.26815 7.52838L10.3469 3.39785C10.4074 3.27831 10.5005 3.17777 10.6157 3.1075C10.7309 3.03722 10.8636 3 10.999 3C11.1345 3 11.2672 3.03722 11.3824 3.1075C11.4976 3.17777 11.5906 3.27831 11.6512 3.39785L13.7299 7.52838L18.3772 8.1947C18.5112 8.21304 18.6373 8.26819 18.7411 8.35387C18.8449 8.43954 18.9222 8.55228 18.9642 8.67922C19.0061 8.80616 19.0111 8.94218 18.9785 9.07177C18.9458 9.20135 18.8769 9.31927 18.7796 9.41207L15.4174 12.6252L16.2112 17.1647C16.3128 17.7473 15.6887 18.191 15.155 17.9163L10.999 15.7721L6.84229 17.9163C6.30939 18.1918 5.68528 17.7473 5.7869 17.1639L6.58064 12.6244L3.21844 9.41128C3.12161 9.31842 3.05313 9.20061 3.02078 9.07126C2.98842 8.94191 2.9935 8.8062 3.03542 8.67955C3.07735 8.5529 3.15444 8.4404 3.25794 8.35483C3.36144 8.26926 3.4872 8.21405 3.62091 8.19549L8.26815 7.52838Z"
        fill={filled ? "#E8C930" : "none"}
        stroke="#E8C930"
        strokeWidth="1.5"
      />
    </svg>
  );

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className="star">
        <StarIcon filled={i < rating} />
      </span>
    ));

  const availCls = (s) =>
    s === "Available" ? "available" : s === "Busy" ? "busy" : "not-available";

  /* ───────────── dummy reviews ───────────── */
  const reviews = [
    {
      id: 1,
      name: "Julia Kim",
      date: "Jan 11",
      rating: 5,
      comment: "Excellent delivery!",
      description: "Fast and professional.",
    },
    {
      id: 2,
      name: "Rahul Sharma",
      date: "Jan 15",
      rating: 4,
      comment: "Great service",
      description: "Friendly staff, on time.",
    },
  ];
  const reviewStats = {
    totalReviews: 120,
    averageRating: 4.9,
    ratingBreakdown: { 5: 50, 4: 39, 3: 20, 2: 4, 1: 1 },
  };

  /* ───────────── loading / error ───────────── */
  if (loading)
    return (
      <div className="delivery-profile-container loading">
        <div className="loading-spinner">Loading…</div>
      </div>
    );
  if (error)
    return (
      <div className="delivery-profile-container error">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );

  /* ───────────── render ───────────── */
  return (
    <>
      <ToastContainer />
      <div className="delivery-profile-container">
        {/* Header */}
        <header className="profile-header">
          <button
            className="back-btn"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            <svg
              width="56"
              height="15"
              viewBox="0 0 56 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.792892 8.20711C0.40237 7.81658 0.40237 7.18342 0.792892 6.79289L7.15685 0.428932C7.54738 0.0384078 8.18054 0.0384078 8.57107 0.428932C8.96159 0.819457 8.96159 1.45262 8.57107 1.84315L2.91422 7.5L8.57107 13.1569C8.96159 13.5474 8.96159 14.1805 8.57107 14.5711C8.18054 14.9616 7.54738 14.9616 7.15685 14.5711L0.792892 8.20711ZM55.5 7.5V8.5L1.5 8.5V7.5V6.5L55.5 6.5V7.5Z"
                fill="#0A5C15"
              />
            </svg>
          </button>
          <div className="availability-status">
            <div className={`status-indicator ${availCls(availability)}`}>
              <span className={`status-dot ${availCls(availability)}`} />
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="status-select"
                aria-label="Change availability status"
              >
                <option value="Available">Available</option>
                <option value="Not Available">Not Available</option>
                <option value="Busy">Busy</option>
              </select>
              <span className="dropdown-arrow">▼</span>
            </div>
          </div>
        </header>

        {/* Profile Section */}
        <section className="profile-section">
          {/* Avatar */}
          <div className="profile-image-container">
            <img
              src={profileImage || "/placeholder.svg"}
              alt="Profile"
              className="profile-image"
              onError={(e) => (e.target.src = "/api/placeholder/120/120")}
            />
            <label className="image-upload-btn">
              <input
                type="file"
                accept="image/*"
                onChange={onProfilePic}
                className="file-input"
              />
              <span className="camera-icon">📷</span>
            </label>
          </div>

          {/* Form */}
          <div className="profile-form">
            {/* row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  name="name"
                  value={profileData.name}
                  onChange={onChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp</label>
                <input
                  name="whatsappNumber"
                  value={profileData.whatsappNumber}
                  onChange={onChange}
                  className="form-input"
                  placeholder="+91…"
                />
              </div>
            </div>

            {/* row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  value={profileData.email}
                  onChange={onChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Secondary Mobile</label>
                <input
                  name="secondaryMobile"
                  value={profileData.secondaryMobile}
                  onChange={onChange}
                  className="form-input"
                  placeholder="+91…"
                />
              </div>
            </div>

            {/* row 3 */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  name="location"
                  value={profileData.location}
                  onChange={onChange}
                  className="form-input"
                  placeholder="City / Area"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Vehicle Type</label>
                <input
                  name="vehicleType"
                  value={profileData.vehicleType}
                  onChange={onChange}
                  className="form-input"
                  placeholder="Bike / Car…"
                />
              </div>
            </div>

            {/* row 4 */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Work Type</label>
                <select
                  name="workType"
                  value={profileData.workType}
                  onChange={onChange}
                  className="form-select"
                >
                  {[
                    "Full Time",
                    "Part Time",
                    "Contract",
                    "Freelance",
                    "Delivery",
                  ].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group mobile-group">
                <label className="form-label">Mobile</label>
                <div className="mobile-input">
                  <div className="country-code">
                    <span className="flag">🇮🇳</span>
                    <span className="dropdown-arrow">▼</span>
                  </div>
                  <input
                    name="mobileNumber"
                    value={profileData.mobileNumber}
                    onChange={onChange}
                    className="mobile-number-input"
                    placeholder="+91…"
                  />
                </div>
              </div>
            </div>

            {/* row 5 – licence */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Driving Licence</label>
                <input type="file" accept="image/*" onChange={onLicencePic} />
                {licenceImage && (
                  <img
                    src={licenceImage || "/placeholder.svg"}
                    alt="Licence preview"
                    style={{ width: 120, marginTop: "0.5rem", borderRadius: 6 }}
                  />
                )}
              </div>
            </div>

            {/* buttons */}
            <button className="save-btn" onClick={handleSave}>
              Save Profile
            </button>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="reviews-section">
          <h2 className="reviews-title">Reviews</h2>

          <div className="reviews-content">
            <div className="reviews-list">
              {reviews.map((r) => (
                <div key={r.id} className="review-card">
                  <div className="review-header">
                    <img
                      src="/api/placeholder/40/40"
                      alt={r.name}
                      className="reviewer-avatar"
                    />
                    <div className="review-info">
                      <h4 className="reviewer-name">{r.name}</h4>
                    </div>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <div className="review-rating">{renderStars(r.rating)}</div>
                  <h5 className="review-comment">{r.comment}</h5>
                  <p className="review-description">{r.description}</p>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: "10px",
                margin: "0px",
                padding: "0px",
              }}
            >
              <div style={{ margin: "0px", padding: "0px" }}>
                <div className="total-reviews">
                  <span className="reviews-label">Total Reviews</span>
                  <span className="reviews-count" style={{ marginTop: "5px" }}>
                    {reviewStats.totalReviews}
                  </span>
                </div>
                <div className="average-rating" style={{ marginTop: "5px" }}>
                  <span className="rating-label">Average Rating</span>
                  <span className="rating-number" style={{ marginTop: "5px" }}>
                    {reviewStats.averageRating}
                  </span>
                </div>
              </div>
              <div style={{ margin: "0px", padding: "0px" }}>
                <div className="rating-breakdown">
                  {Object.entries(reviewStats.ratingBreakdown)
                    .reverse()
                    .map(([s, c]) => (
                      <div key={s} className="rating-row">
                        <div className="rating-stars">{renderStars(+s)}</div>
                        <span className="rating-count">
                          ({c.toString().padStart(2, "0")})
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DeliveryProfile;
