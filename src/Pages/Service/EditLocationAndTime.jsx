import React, { useState } from 'react';
import './EditLocationAndTime.css';

const EditLocationAndTime = () => {
    const [formData, setFormData] = useState({
        shopAddress: '',
        state: '',
        city: ''
    });

    const [workingDays, setWorkingDays] = useState([
        'Mon', 'Tue', 'Wed', 'Thu', 'Fri'
    ]);

    const [openingTime, setOpeningTime] = useState({
        hour: '08:00',
        period: 'AM'
    });

    const [closingTime, setClosingTime] = useState({
        hour: '08:00',
        period: 'AM'
    });

    const [activeTab, setActiveTab] = useState('Location & Working Hours');

    const tabs = [
        'Basic Info',
        'Location & Working Hours',
        'Gallery',
        'Delivery & Contact Info'
    ];

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 12 }, (_, i) =>
        String(i + 1).padStart(2, '0') + ':00'
    );
    const periods = ['AM', 'PM'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const toggleWorkingDay = (day) => {
        setWorkingDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const handleTimeChange = (timeType, field, value) => {
        if (timeType === 'opening') {
            setOpeningTime(prev => ({ ...prev, [field]: value }));
        } else {
            setClosingTime(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleSave = () => {
        console.log('Form data:', {
            ...formData,
            workingDays,
            openingTime,
            closingTime
        });
    };

    const handleCancel = () => {
        console.log('Cancelled');
    };

    const handleBack = () => {
        console.log('Going back');
    };

    return (
        <div className="edit-location-container">
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
                {/* Address Section */}
                <div className="address-section">
                    <div className="form-group">
                        <label htmlFor="shopAddress" className="form-label">
                            Shop Address
                        </label>
                        <textarea
                            id="shopAddress"
                            name="shopAddress"
                            className="form-textarea"
                            value={formData.shopAddress}
                            onChange={handleInputChange}
                            placeholder="Enter your Shop Address."
                            rows={4}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="state" className="form-label">
                                State
                            </label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                className="form-input"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="Enter your State your shop in."
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="city" className="form-label">
                                City
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                className="form-input"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="Enter your State your shop in."
                            />
                        </div>
                    </div>
                </div>

                {/* Working Days Section */}
                <div className="working-days-section">
                    <h3 className="section-title">Working Days</h3>
                    <div className="days-container">
                        {days.map((day) => (
                            <button
                                key={day}
                                className={`day-btn ${workingDays.includes(day) ? 'selected' : ''}`}
                                onClick={() => toggleWorkingDay(day)}
                                type="button"
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Working Hours Section */}
                <div className="working-hours-section">
                    <h3 className="section-title">Opening & Closing Hours</h3>

                    <div className="hours-header">
                        <div className="opening-header">Opening</div>
                        <div className="separator">-</div>
                        <div className="closing-header">Closing</div>
                    </div>

                    <div className="time-selectors">
                        {/* Opening Time */}
                        <div className="time-group">
                            <div className="time-inputs">
                                <div className="select-wrapper">
                                    <select
                                        className="time-select"
                                        value={openingTime.hour}
                                        onChange={(e) => handleTimeChange('opening', 'hour', e.target.value)}
                                    >
                                        {hours.map(hour => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        className="period-select"
                                        value={openingTime.period}
                                        onChange={(e) => handleTimeChange('opening', 'period', e.target.value)}
                                    >
                                        {periods.map(period => (
                                            <option key={period} value={period}>{period}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="time-separator">-</div>

                        {/* Closing Time */}
                        <div className="time-group">
                            <div className="time-inputs">
                                <div className="select-wrapper">
                                    <select
                                        className="time-select"
                                        value={closingTime.hour}
                                        onChange={(e) => handleTimeChange('closing', 'hour', e.target.value)}
                                    >
                                        {hours.map(hour => (
                                            <option key={hour} value={hour}>{hour}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        className="period-select"
                                        value={closingTime.period}
                                        onChange={(e) => handleTimeChange('closing', 'period', e.target.value)}
                                    >
                                        {periods.map(period => (
                                            <option key={period} value={period}>{period}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EditLocationAndTime;
