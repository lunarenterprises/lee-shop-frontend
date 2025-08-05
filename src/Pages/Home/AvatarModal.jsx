import React, { useState, useEffect } from 'react';
import './AvatarModal.css';
import { FaUser, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';

const AvatarModal = ({ isOpen, onClose, userData, onProfileClick, onSettingsClick, onLogout }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);
    // Fetch profile data based on role
    useEffect(() => {
        if (!isOpen || !userData?.id || !userData?.role) return;

        const fetchProfileData = async () => {
            setLoading(true);
            try {
                let endpoint = '';
                let payload = {};

                // Determine API endpoint and payload based on role
                switch (userData.role.toLowerCase()) {
                    case 'user':
                        endpoint = 'https://lunarsenterprises.com:6031/leeshop/user/list/user';
                        payload = { u_id: userData.id.toString() };
                        break;
                    case 'deliverystaff':
                        endpoint = 'https://lunarsenterprises.com:6031/leeshop/deliverystaff/list/delivery_staffs';
                        payload = { u_id: userData.id };
                        break;
                    case 'shop':
                        endpoint = 'https://lunarsenterprises.com:6031/leeshop/shop/list/shop';
                        payload = { sh_id: userData.id.toString() };
                        break;
                    default:
                        console.warn('Unknown user role:', userData.role);
                        setLoading(false);
                        return;
                }

                // Fixed fetch call
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (data.result) {
                    let profileInfo = {};

                    // Extract profile data based on role
                    switch (userData.role.toLowerCase()) {
                        case 'user':
                            const userList = data.list || [];
                            if (userList.length > 0) {
                                const user = userList[0];
                                profileInfo = {
                                    id: user.u_id,
                                    name: user.u_name || user.name || 'User',
                                    image: user.u_profile_pic || user.profile_image || null,
                                    email: user.u_email || user.email,
                                    phone: user.u_phone || user.phone,
                                    role: 'User'
                                };
                            }
                            break;
                        case 'deliverystaff':
                            const staffList = data.delivery_staffs || [];
                            if (staffList.length > 0) {
                                const staff = staffList[0];
                                profileInfo = {
                                    id: staff.u_id,
                                    name: staff.name || staff.u_name || 'Delivery Staff',
                                    image: staff.profile_pic || staff.profile_image || null,
                                    email: staff.email,
                                    phone: staff.phone,
                                    role: 'Delivery Staff'
                                };
                            }
                            break;
                        case 'shop':
                            const shopList = data.shop || [];
                            if (shopList.length > 0) {
                                const shop = shopList[0];
                                profileInfo = {
                                    id: shop.sh_id,
                                    name: shop.sh_name || shop.name || 'Shop',
                                    image: shop.shopimages && shop.shopimages.length > 0
                                        ? shop.shopimages[0].si_image
                                        : shop.shop_image || null,
                                    email: shop.sh_email || shop.email,
                                    phone: shop.sh_phone || shop.phone,
                                    role: 'Shop Owner'
                                };
                            }
                            break;
                    }

                    setProfileData(profileInfo);
                } else {
                    console.error('Failed to fetch profile data:', data.message);
                    // Set fallback data from userData
                    setProfileData(createFallbackProfile(userData));
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Set fallback data from userData on error
                setProfileData(createFallbackProfile(userData));
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [isOpen, userData?.id, userData?.role]);

    // Helper function to create fallback profile data
    const createFallbackProfile = (userData) => {
        return {
            id: userData?.id || userData?.u_id || userData?.sh_id,
            name: userData?.name || userData?.u_name || userData?.sh_name || 'User',
            image: userData?.image || userData?.u_profile_pic || userData?.profile_picture || null,
            email: userData?.email || userData?.u_email || userData?.sh_email,
            phone: userData?.phone || userData?.u_phone || userData?.sh_phone,
            role: getRoleDisplay(userData?.role || 'user')
        };
    };

    // Helper function to format role display
    const getRoleDisplay = (role) => {
        if (!role) return "User";

        const roleMap = {
            'user': 'User',
            'deliverystaff': 'Delivery Staff',
            'delivery_staff': 'Delivery Staff',
            'shop': 'Shop Owner',
            'shopowner': 'Shop Owner'
        };

        return roleMap[role.toLowerCase()] || role;
    };

    // Helper function to get profile image with multiple fallbacks
    const getProfileImage = (data) => {
        // Try multiple image field names
        const imageFields = [
            data?.image,
            data?.u_profile_pic,
            data?.profile_picture,
            data?.profile_pic,
            data?.avatar
        ];

        // Check shopimages array for shop users
        if (data?.shopimages && Array.isArray(data.shopimages) && data.shopimages.length > 0) {
            imageFields.unshift(data.shopimages[0]?.si_image);
        }

        // Return first non-null, non-empty image
        for (const imageUrl of imageFields) {
            if (imageUrl && imageUrl.trim() !== '') {
                return imageUrl;
            }
        }

        return "/api/placeholder/80/80";
    };

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

    // Use fetched profile data or fallback to userData
    const displayData = profileData || createFallbackProfile(userData);

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
                        {loading ? (
                            <div className="avatar-loading">
                                <div className="loading-spinner"></div>
                                <span>Loading...</span>
                            </div>
                        ) : (
                            <img
                                src={getProfileImage(displayData)}
                                alt="User avatar"
                                onError={(e) => {
                                    e.target.src = "/api/placeholder/80/80";
                                }}
                            />
                        )}
                    </div>
                    <h3 className="user-name">
                        {loading ? "Loading..." : (displayData?.name || "User")}
                    </h3>
                    <p className="user-role">
                        {displayData?.role || "User"}
                    </p>
                </div>

                {/* Menu Options */}
                <div className="avatar-modal-menu">
                    <button
                        className="menu-item"
                        onClick={handleProfileClick}
                        disabled={loading}
                    >
                        <div className="menu-icon">
                            <FaUser />
                        </div>
                        <span>My Profile</span>
                    </button>

                    <button
                        className="menu-item"
                        onClick={handleSettingsClick}
                        disabled={loading}
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
