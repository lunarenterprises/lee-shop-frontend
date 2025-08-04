import React, { useState } from 'react';
import './BasicInfoEdit.css';

const BasicInfoEdit = () => {
    const [formData, setFormData] = useState({
        businessType: 'Product Seller',
        shopName: 'CakeZone',
        ownerName: 'Aurobindo'
    });

    const [selectedCategories, setSelectedCategories] = useState([
        'Grocery', 'Bakery', 'Gifts & Custom Products', 'Pet Care',
        'Hardware & Utilities', 'Fashion Accessories', 'Stationery & Printing',
        'Beauty', 'Furniture & Decor', 'Kitchen'
    ]);

    const [activeTab, setActiveTab] = useState('Basic Info');

    const tabs = [
        'Basic Info',
        'Location & Working Hours',
        'Gallery',
        'Delivery & Contact Info'
    ];

    const categories = [
        'Grocery', 'Bakery', 'Gifts & Custom Products', 'Pet Care',
        'Hardware & Utilities', 'Fashion Accessories', 'Stationery & Printing',
        'Beauty', 'Furniture & Decor', 'Kitchen', 'Electronics', 'Sports',
        'Books', 'Toys', 'Automotive', 'Health & Wellness'
    ];

    const businessTypes = [
        'Product Seller',
        'Service Provider',
        'Restaurant',
        'Retail Store',
        'Online Business'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleCategory = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(cat => cat !== category)
                : [...prev, category]
        );
    };

    const handleSave = () => {
        console.log('Form data:', formData);
        console.log('Selected categories:', selectedCategories);
        // Add your save logic here
    };

    const handleCancel = () => {
        // Reset form or navigate away
        console.log('Cancelled');
    };

    const handleBack = () => {
        // Navigate back
        console.log('Going back');
    };

    return (
        <div className="profile-edit-container">
            {/* Header */}
            <header className="profile-header">
                <div className="header-left">
                    <button
                        className="back-btn"
                        onClick={handleBack}
                        aria-label="Go back"
                    >
                        ←
                    </button>
                    <h1 className="profile-title">Profile Edit</h1>
                </div>
                <div className="header-actions">
                    <button className="cancel-btn" onClick={handleCancel}>
                        Cancel
                    </button>
                    <button className="save-btn" onClick={handleSave}>
                        Save
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="tab-navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {/* Form Content */}
            <main className="form-content">
                {/* Business Type */}
                <div className="form-group">
                    <label htmlFor="businessType" className="form-label">
                        Business Type
                    </label>
                    <div className="select-wrapper">
                        <select
                            id="businessType"
                            name="businessType"
                            className="form-select"
                            value={formData.businessType}
                            onChange={handleInputChange}
                        >
                            {businessTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Shop Name and Owner Name Row */}
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="shopName" className="form-label">
                            Shop Name
                        </label>
                        <input
                            type="text"
                            id="shopName"
                            name="shopName"
                            className="form-input"
                            value={formData.shopName}
                            onChange={handleInputChange}
                            placeholder="Enter shop name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ownerName" className="form-label">
                            Owner Name
                        </label>
                        <input
                            type="text"
                            id="ownerName"
                            name="ownerName"
                            className="form-input"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            placeholder="Enter owner name"
                        />
                    </div>
                </div>

                {/* Business Category */}
                <div className="form-group">
                    <label className="form-label">Business Category</label>
                    <div className="category-tags">
                        {categories.slice(0, 10).map((category) => (
                            <button
                                key={category}
                                className={`category-tag ${selectedCategories.includes(category) ? 'selected' : ''
                                    }`}
                                onClick={() => toggleCategory(category)}
                                type="button"
                            >
                                {category}
                            </button>
                        ))}
                        <button className="view-more-btn" type="button">
                            View more
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default BasicInfoEdit;
