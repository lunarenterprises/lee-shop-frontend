// DeliveryProfileComponent.jsx
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeliveryProfileComponent.css';

const DeliveryProfile = () => {
  /* ───────────── state ───────────── */
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    secondaryMobile: '',
    whatsappNumber: '',
    vehicleType: '',
    workType: '',
    location: '',
  });

  const [availability, setAvailability] = useState('Not Available');
  const [profileImage, setProfileImage] = useState('/api/placeholder/120/120');
  const [licenceImage, setLicenceImage] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [licenceFile, setLicenceFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem('userData')); // must contain u_id

  /* ───────────── fetch profile ───────────── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          'https://lunarsenterprises.com:6031/leeshop/deliverystaff/list/delivery_staffs',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ u_id: userData?.u_id || userData?.id || 14 }),
          }
        );
        if (!res.ok) throw new Error('Network error');
        const json = await res.json();
        if (!json.result || !json.list?.length) throw new Error('No data found');

        const d = json.list[0];
        const fmt = (p) =>
          !p ? '' : p.toString().startsWith('+91') ? p.toString() : `+91${p}`;

        setProfileData({
          name: d.u_name?.trim() || '',
          email: d.u_email || '',
          mobileNumber: fmt(d.u_mobile),
          secondaryMobile: fmt(d.u_secondary_mobile),
          whatsappNumber: fmt(d.u_whatsapp_contact),
          vehicleType: d.u_vehicle_type?.trim() || '',
          workType: d.u_work_type?.trim() || '',
          location: d.u_location || d.u_district || '',
        });

        if (d.u_profile_pic)
          setProfileImage(`https://lunarsenterprises.com:6031${d.u_profile_pic}`);
        if (d.u_licence_pic)
          setLicenceImage(`https://lunarsenterprises.com:6031${d.u_licence_pic}`);

        setAvailability(
          d.u_delivery_status === 'available'
            ? 'Available'
            : d.u_delivery_status === 'busy'
              ? 'Busy'
              : 'Not Available'
        );
      } catch (err) {
        setError(err.message);
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
      if (!id) throw new Error('User ID missing');

      fd.append('u_id', id);
      fd.append('u_name', profileData.name.trim());
      fd.append('u_email', profileData.email.trim());
      fd.append('u_mobile', profileData.mobileNumber.replace(/\D/g, ''));
      fd.append('u_secondary_mobile', profileData.secondaryMobile.replace(/\D/g, ''));
      fd.append('u_whatsapp_contact', profileData.whatsappNumber.replace(/\D/g, ''));
      fd.append('u_vehicle_type', profileData.vehicleType.trim());
      fd.append('u_work_type', profileData.workType.trim());

      if (profileFile) fd.append('profile', profileFile); // backend expects these keys
      if (licenceFile) fd.append('licence', licenceFile);

      const res = await fetch(
        'https://lunarsenterprises.com:6031/leeshop/deliverystaff/edit/delivery_staffs',
        { method: 'POST', body: fd }
      );
      const json = await res.json();
      console.log('Result', json);
      if (!json.result) throw new Error(json.message || 'Update failed');

      toast.success('Profile updated!', { position: 'bottom-center' });
    } catch (err) {
      toast.error(err.message || 'Save failed', { position: 'bottom-center' });
    }
  };

  /* ───────────── helpers ───────────── */
  const renderStars = (r) =>
    [...Array(5)].map((_, i) => (
      <span key={i} className={`star ${i < r ? 'filled' : ''}`}>★</span>
    ));
  const availCls = (s) =>
    s === 'Available' ? 'available' : s === 'Busy' ? 'busy' : 'not-available';

  /* ───────────── dummy reviews ───────────── */
  const reviews = [
    {
      id: 1, name: 'Julia Kim', date: 'Jan 11', rating: 5,
      comment: 'Excellent delivery!', description: 'Fast and professional.'
    },
    {
      id: 2, name: 'Rahul Sharma', date: 'Jan 15', rating: 4,
      comment: 'Great service', description: 'Friendly staff, on time.'
    }
  ];
  const reviewStats = {
    totalReviews: 120, averageRating: 4.9,
    ratingBreakdown: { 5: 50, 4: 39, 3: 20, 2: 4, 1: 1 }
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
          <button className="back-btn" onClick={() => window.history.back()} aria-label="Go back">
            ←
          </button>
          <div className="availability-status">
            <div className={`status-indicator ${availCls(availability)}`}>
              <span className="status-dot" />
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="status-select"
              >
                {['Available', 'Not Available', 'Busy'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
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
              src={profileImage}
              alt="Profile"
              className="profile-image"
              onError={(e) => (e.target.src = '/api/placeholder/120/120')}
            />
            <label className="image-upload-btn">
              <input type="file" accept="image/*" onChange={onProfilePic} className="file-input" />
              <span className="camera-icon">📷</span>
            </label>
          </div>

          {/* Form */}
          <div className="profile-form">
            {/* row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input name="name" value={profileData.name} onChange={onChange} className="form-input" />
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
                <input name="email" value={profileData.email} onChange={onChange} className="form-input" />
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
                  {['Full Time', 'Part Time', 'Contract', 'Freelance', 'Delivery'].map((t) => (
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
                    src={licenceImage}
                    alt="Licence preview"
                    style={{ width: 120, marginTop: '0.5rem', borderRadius: 6 }}
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
                    <img src="/api/placeholder/40/40" alt={r.name} className="reviewer-avatar" />
                    <div className="review-info">
                      <h4 className="reviewer-name">{r.name}</h4>
                      <div className="review-rating">{renderStars(r.rating)}</div>
                    </div>
                    <span className="review-date">{r.date}</span>
                  </div>
                  <h5 className="review-comment">{r.comment}</h5>
                  <p className="review-description">{r.description}</p>
                </div>
              ))}
            </div>

            <div className="reviews-summary">
              <div className="total-reviews">
                <span className="reviews-count">{reviewStats.totalReviews}</span>
                <span className="reviews-label">Total Reviews</span>
              </div>

              <div className="rating-breakdown">
                {Object.entries(reviewStats.ratingBreakdown)
                  .reverse()
                  .map(([s, c]) => (
                    <div key={s} className="rating-row">
                      <div className="rating-stars">{renderStars(+s)}</div>
                      <span className="rating-count">({c.toString().padStart(2, '0')})</span>
                    </div>
                  ))}
              </div>

              <div className="average-rating">
                <span className="rating-number">{reviewStats.averageRating}</span>
                <span className="rating-label">Average Rating</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default DeliveryProfile;
