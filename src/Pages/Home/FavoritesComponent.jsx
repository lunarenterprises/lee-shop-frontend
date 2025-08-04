import React, { useState } from 'react';
import './FavoritesComponent.css';

const FavoritesComponent = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('shops');

    const favoritesData = {
        shops: [
            {
                id: 1,
                name: 'QuickWash Dry Clean',
                rating: 4.5,
                reviewCount: 120,
                distance: '1.5 km Away',
                status: 'Open 7 am to 9 pm',
                image: '/api/placeholder/60/60',
                isOpen: true
            },
            {
                id: 2,
                name: 'QuickWash Dry Clean',
                rating: 4.5,
                reviewCount: 120,
                distance: '1.5 km Away',
                status: 'Open 7 am to 9 pm',
                image: '/api/placeholder/60/60',
                isOpen: true
            },
            {
                id: 3,
                name: 'QuickWash Dry Clean',
                rating: 4.5,
                reviewCount: 120,
                distance: '1.5 km Away',
                status: 'Open 7 am to 9 pm',
                image: '/api/placeholder/60/60',
                isOpen: true
            }
        ],
        services: [
            {
                id: 1,
                name: 'Express Laundry Service',
                rating: 4.8,
                reviewCount: 95,
                distance: '2.1 km Away',
                status: 'Open 6 am to 10 pm',
                image: '/api/placeholder/60/60',
                isOpen: true
            },
            {
                id: 2,
                name: 'Premium Dry Cleaning',
                rating: 4.3,
                reviewCount: 87,
                distance: '3.2 km Away',
                status: 'Closed',
                image: '/api/placeholder/60/60',
                isOpen: false
            }
        ]
    };

    const handleRemoveFavorite = (type, id) => {
        console.log(`Removing ${type} favorite with id: ${id}`);
        // Add your remove favorite logic here
    };

    const handleItemClick = (item) => {
        console.log('Clicked on:', item.name);
        // Add navigation or detailed view logic here
    };

    const renderStars = (rating) => {
        return (
            <div className="rating-container">
                <span className="star">⭐</span>
                <span className="rating-text">{rating} ({reviewCount} Reviews)</span>
            </div>
        );
    };

    const renderFavoriteItems = () => {
        const items = favoritesData[activeTab];

        if (items.length === 0) {
            return (
                <div className="empty-state">
                    <p>No {activeTab} in your favorites yet</p>
                </div>
            );
        }

        return items.map((item) => (
            <div key={item.id} className="favorite-item">
                <div className="item-image">
                    <img src={item.image} alt={item.name} />
                </div>

                <div className="item-content" onClick={() => handleItemClick(item)}>
                    <div className="item-header">
                        <div className="rating-container">
                            <span className="star">⭐</span>
                            <span className="rating-text">
                                {item.rating} ({item.reviewCount} Reviews)
                            </span>
                        </div>
                        <button
                            className="remove-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveFavorite(activeTab, item.id);
                            }}
                            aria-label="Remove from favorites"
                        >
                            ×
                        </button>
                    </div>

                    <h3 className="item-name">{item.name}</h3>

                    <div className="item-details">
                        <span className="distance">{item.distance}</span>
                        <span className={`status ${item.isOpen ? 'open' : 'closed'}`}>
                            {item.isOpen && <span className="status-dot"></span>}
                            {item.status}
                        </span>
                    </div>
                </div>
            </div>
        ));
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div className="favorites-overlay" onClick={onClose}></div>

            {/* Favorites Modal */}
            <div className="favorites-modal">
                <div className="favorites-header">
                    <h2 className="favorites-title">My Favorites</h2>
                    <button className="close-btn" onClick={onClose} aria-label="Close favorites">
                        ×
                    </button>
                </div>

                <div className="favorites-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'shops' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shops')}
                    >
                        Shops
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Services
                    </button>
                </div>

                <div className="favorites-content">
                    {renderFavoriteItems()}
                </div>
            </div>
        </>
    );
};

export default FavoritesComponent;
