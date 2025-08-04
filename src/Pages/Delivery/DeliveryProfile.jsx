import React, { useState } from 'react';
import './DeliveryProfile.css';

const DeliveryProfile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Alexis Sanchez',
    whatsappNumber: '+91',
    location: 'Edapally, Kochi',
    workType: 'Full Time',
    mobileNumber: '+91',
    countryCode: 'IN'
  });

  const [availability, setAvailability] = useState('Not Available');
  const [profileImage, setProfileImage] = useState('/api/placeholder/120/120');

  const reviews = [
    {
      id: 1,
      name: 'Julia Kim',
      date: 'Jan 11',
      rating: 5,
      comment: 'Absolutely delicious and beautifully made!',
      description: 'I ordered a custom chocolate truffle cake from CakeZone for my sister\'s birthday — it was rich, moist, perfectly designed.'
    },
    {
      id: 2,
      name: 'Julia Kim',
      date: 'Jan 11',
      rating: 5,
      comment: 'Absolutely delicious and beautifully made!',
      description: 'I ordered a custom chocolate truffle cake from CakeZone for my sister\'s birthday — it was rich, moist, perfectly designed.'
    }
  ];

  const reviewStats = {
    totalReviews: 120,
    averageRating: 4.9,
    ratingBreakdown: {
      5: 50,
      4: 39,
      3: 20,
      2: 4,
      1: 1
    }
  };

  const locations = [
    'Edapally, Kochi',
    'Kakkanad, Kochi',
    'Marine Drive, Kochi',
    'Fort Kochi',
    'Ernakulam'
  ];

  const workTypes = [
    'Full Time',
    'Part Time',
    'Contract',
    'Freelance'
  ];

  const availabilityOptions = [
    'Available',
    'Not Available',
    'Busy'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = () => {
    console.log('Saving profile:', profileData);
  };

  const handleBack = () => {
    console.log('Going back');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Available': return 'available';
      case 'Busy': return 'busy';
      default: return 'not-available';
    }
  };

  return (
    <div className="delivery-profile-container">
      {/* Header */}
      <header className="profile-header">
        <button 
          className="back-btn" 
          onClick={handleBack}
          aria-label="Go back"
        >
          ←
        </button>
        <div className="availability-status">
          <div className={`status-indicator ${getAvailabilityColor(availability)}`}>
            <span className="status-dot"></span>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="status-select"
            >
              {availabilityOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </header>

      {/* Profile Section */}
      <section className="profile-section">
        <div className="profile-image-container">
          <img
            src={profileImage}
            alt="Profile"
            className="profile-image"
          />
          <label className="image-upload-btn">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input"
            />
            <span className="camera-icon">📷</span>
          </label>
        </div>

        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">What's app Number</label>
              <input
                type="tel"
                name="whatsappNumber"
                value={profileData.whatsappNumber}
                onChange={handleInputChange}
                className="form-input"
                placeholder="+91"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Choose your Location</label>
              <div className="select-wrapper">
                <select
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {locations.map(location => (
                    <option key={location} value={location}>
                      📍 {location}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Work type</label>
              <div className="select-wrapper">
                <select
                  name="workType"
                  value={profileData.workType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {workTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group mobile-group">
              <label className="form-label">Mobile Number</label>
              <div className="mobile-input">
                <div className="country-code">
                  <span className="flag">🇮🇳</span>
                  <span className="dropdown-arrow">▼</span>
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={handleInputChange}
                  className="mobile-number-input"
                  placeholder="+91"
                />
              </div>
            </div>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <h2 className="reviews-title">Reviews</h2>
        
        <div className="reviews-content">
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <img
                    src="/api/placeholder/40/40"
                    alt={review.name}
                    className="reviewer-avatar"
                  />
                  <div className="review-info">
                    <h4 className="reviewer-name">{review.name}</h4>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <h5 className="review-comment">{review.comment}</h5>
                <p className="review-description">{review.description}</p>
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
                .map(([stars, count]) => (
                <div key={stars} className="rating-row">
                  <div className="rating-stars">
                    {renderStars(parseInt(stars))}
                  </div>
                  <span className="rating-count">({count.toString().padStart(2, '0')})</span>
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
  );
};

export default DeliveryProfile;
