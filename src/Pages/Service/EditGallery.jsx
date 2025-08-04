import React, { useState, useRef } from 'react';
import './EditGallery.css';

const EditGallery = () => {
    const [images, setImages] = useState([
        { id: 1, src: '/api/placeholder/150/120', alt: 'Bakery interior' },
        { id: 2, src: '/api/placeholder/150/120', alt: 'Coffee and pastry' },
        { id: 3, src: '/api/placeholder/150/120', alt: 'Baker at work' },
        { id: 4, src: '/api/placeholder/150/120', alt: 'Coffee preparation' },
        { id: 5, src: '/api/placeholder/150/120', alt: 'Pastry display' },
        { id: 6, src: '/api/placeholder/150/120', alt: 'Baked goods' }
    ]);

    const [dragOver, setDragOver] = useState(false);
    const [activeTab, setActiveTab] = useState('Gallery');
    const fileInputRef = useRef(null);

    const tabs = [
        'Basic Info',
        'Location & Working Hours',
        'Gallery',
        'Delivery & Contact Info'
    ];

    const handleFileSelect = (files) => {
        const newImages = Array.from(files).map((file, index) => ({
            id: Date.now() + index,
            src: URL.createObjectURL(file),
            alt: file.name,
            file: file
        }));

        setImages(prev => [...prev, ...newImages]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const files = e.dataTransfer.files;
        handleFileSelect(files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleFileInputChange = (e) => {
        const files = e.target.files;
        if (files) {
            handleFileSelect(files);
        }
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageDelete = (imageId) => {
        setImages(prev => prev.filter(img => img.id !== imageId));
    };

    const handleSave = () => {
        console.log('Saving gallery with images:', images);
    };

    const handleCancel = () => {
        console.log('Cancelled');
    };

    const handleBack = () => {
        console.log('Going back');
    };

    return (
        <div className="edit-gallery-container">
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

            {/* Gallery Content */}
            <main className="gallery-content">
                <div className="gallery-container">
                    {/* Upload Section */}
                    <div className="upload-section">
                        <div
                            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                        >
                            <div className="upload-icon">
                                <span className="icon">📷</span>
                            </div>
                            <p className="upload-text">
                                Drag and drop your images anywhere or
                            </p>
                            <button
                                className="upload-btn"
                                onClick={handleUploadClick}
                                type="button"
                            >
                                Upload a Image
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileInputChange}
                                className="file-input"
                            />
                        </div>
                    </div>

                    {/* Images Grid */}
                    <div className="images-grid">
                        {images.map((image) => (
                            <div key={image.id} className="image-card">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="gallery-image"
                                />
                                <button
                                    className="delete-btn"
                                    onClick={() => handleImageDelete(image.id)}
                                    aria-label="Delete image"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditGallery;
