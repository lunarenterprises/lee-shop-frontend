import React from 'react';
import './AvatarModal.css';
import { FaUser, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const AvatarModal = ({ isOpen, onClose, userData, onProfileClick, onSettingsClick, onLogout }) => {
    if (!isOpen) return null;

    const handleProfileClick = () => {
        onProfileClick();
        onClose();
    };

    const handleSettingsClick = () => {
        onSettingsClick();
        onClose();
    };

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div className="avatar-modal-overlay" onClick={onClose}></div>

            {/* Modal */}
            <div className="avatar-modal">
                {/* Close Button */}
                <button
                    className="avatar-modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <FaTimes />
                </button>

                {/* User Info Section */}
                <div className="avatar-modal-header">
                    <div className="user-avatar">
                        <img
                            src={userData?.profileImage || "/api/placeholder/80/80"}
                            alt="User avatar"
                        />
                    </div>
                    <h3 className="user-name">{userData?.name || "Alexis Sanchez"}</h3>
                    <p className="user-role">User</p>
                </div>

                {/* Menu Options */}
                <div className="avatar-modal-menu">
                    <button
                        className="menu-item"
                        onClick={handleProfileClick}
                    >
                        <div className="menu-icon">
                            <FaUser />
                        </div>
                        <span>My Profile</span>
                    </button>

                    <button
                        className="menu-item"
                        onClick={handleSettingsClick}
                    >
                        <div className="menu-icon">
                            <FaCog />
                        </div>
                        <span>Settings</span>
                    </button>

                    <button
                        className="menu-item logout"
                        onClick={handleLogout}
                    >
                        <div className="menu-icon">
                            <FaSignOutAlt />
                        </div>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default AvatarModal;
