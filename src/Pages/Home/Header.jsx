import React, { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./HomePage.css";
import { FaBell, FaHeart, FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import axiosInstance from "../../constant/axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ProfileEditModal from "../Profiles/ProfileEditModal";
const navItems = [
  { href: "/", label: "Home" },
  { href: "/Why", label: "Why Lee Shop" },
  { href: "/ourGoal", label: "Our Goal" },
];
const Header = ({ activeKey, onNavClick, navItems }) => {
  const location = useLocation();
  const [profileModal, setProfileModal] = useState(false);
  const [childModal, setChildModal] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(16);
  const [userData, setUserData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const formData = useRef(new FormData());
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const getUser = async () => {
      try {
        const response = await axiosInstance.post("/user/list/user", {
          u_id: userId,
        });
        if (!response?.data?.result) {
          // Swal.fire({
          //   title: 'Error!',
          //   text: response.data.message,
          //   icon: 'error',
          //   confirmButtonText: 'Ok'
          // })
        } else {
          setUserData(response?.data?.list[0]);
          localStorage.setItem(
            "userData",
            JSON.stringify(response?.data?.list[0])
          );
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    if (!userData) {
      getUser();
    } else {
      setUserData(userData);
      setUserId(userData.u_id);
    }
  }, [userId]); // only depends on userId
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Optionally: Append to FormData
      formData.current.append("image", file);

      // Optionally: Preview
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async (e) => {
    // Debug: Show contents of formData
    for (let [key, value] of formData.current.entries()) {
      //validation pending
      console.log(key + " : " + value);
    }
    e.preventDefault();
    formData.current.append("u_id", userId);
    const response = await axiosInstance.post(
      "/user/edit/profile",
      formData.current,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    setChildModal(false);
    if (response.data.result) {
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } else {
      // Swal.fire({
      //   title: "Error!",
      //   text: response.data.message,
      //   icon: "error",
      //   confirmButtonText: "Ok",
      // });
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("userData");
    setProfileModal(false);
    setUserId(null);
  };
  const handleChangePassword = () => {
    Swal.fire({
      title: "Successfully!",
      text: "Your password has been successfully updated",
      icon: "success",
      showConfirmButton: false,
      footer: '<a href="/login" class="text-[#0A5C15] text-xl">Go to Login</a>',
    });
  };
  const handleDeleteButton = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axiosInstance.post("/user/delete/user", {
          u_id: userId,
        });
        if (response.data.result) {
          Swal.fire({
            title: "Deleted!",
            text: response.data.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Failed!",
            text: response.data.message,
            icon: "error",
          });
        }
      }
    });
  };
  const [menuOpen, setMenuOpen] = useState(false);

  // Handles nav button click (and closes menu on mobile)
  const handleMenuItemClick = (href) => {
    if (onNavClick) onNavClick(href);
    setMenuOpen(false);
  };
  return (
    <div>
      <header className="homepage-header">
        <div
          className="homepage-logo"
          onClick={() => onNavClick && onNavClick("/")}
          style={{ cursor: "pointer" }}
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-14 cursor-pointer animate-pulse"
            style={{ height: "42px" }}
          />
        </div>

        {/* Hamburger icon for mobile */}
        <button
          className="homepage-hamburger"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}

        >
          {menuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>

        {/* NAV: on mobile, .open shows menu as overlay */}
        <nav className={`homepage-nav${menuOpen ? " open" : ""}`}>
          {navItems.map((item) => (
            <button
              type="button"
              key={item.href}
              className={`homepage-menu-item${activeKey === item.href ? " active" : ""}`}
              onClick={() => handleMenuItemClick(item.href)}
            >
              {item.label}
            </button>
          ))}
          {/* Login/Register only in mobile nav */}
          <div className="homepage-login-register-mobile">
            Login / Register
          </div>
        </nav>

        {/* Desktop only: hide this on mobile */}
        <div className="homepage-login-register-desktop">
          Login / Register
        </div>
      </header>


      {profileModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex justify-end items-start pt-16">
          {/* Modal */}
          <div className="bg-white rounded-xl shadow-xl p-6 w-full sm:w-[80%] md:w-[50%] lg:w-[30%] xl:w-[25%] z-50 m-4 font-inter">
            {/* Close Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setProfileModal(false)}
                className="text-gray-400 hover:text-black text-lg hover:cursor-pointer"
              >
                <img src="/Close_button.png" alt="Close" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex flex-col items-center mt-2">
              <img
                src={userData?.u_profile_pic || "https://i.pravatar.cc/100"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <h3 className="mt-4 text-lg font-semibold">
                {userData?.u_name || "User name"}
              </h3>
              <p className="text-sm text-gray-500">
                {userData?.u_role || "User role"}
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 space-y-3 text-[16px] font-medium leading-6">
              <button
                className="flex items-center w-full px-4 py-3 rounded-md hover:bg-gray-100 text-left shadow-sm"
                onClick={() => [setChildModal(true), setProfileModal(false)]}
              >
                <img
                  className="w-5 h-5 mr-4"
                  src="/profile.png"
                  alt="My Profile"
                />{" "}
                My Profile
              </button>
              {/* <button className="flex items-center w-full px-4 py-3 rounded-md hover:bg-gray-100 text-left shadow-sm">
                <img className="w-5 h-5 mr-4" src="/edit_profile.png" alt="Edit Profile" /> Edit Profile
              </button> */}
              <button
                className="flex items-center w-full px-4 py-3 rounded-md hover:bg-gray-100 text-left shadow-sm"
                onClick={() => [setSettingsModal(true), setProfileModal(false)]}
              >
                <img
                  className="w-5 h-5 mr-4"
                  src="/mynaui_edit.png"
                  alt="Settings"
                />{" "}
                Settings
              </button>
            </div>

            {/* Logout */}
            <div className="mt-6">
              <button
                className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-100 rounded-lg text-left"
                onClick={handleLogout}
              >
                <img className="w-5 h-5 mr-4" src="/logout.png" alt="Logout" />{" "}
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Child modal */}
      {childModal && userData?.u_role == "user" && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setChildModal(false)}
        >
          <div
            className="relative bg-[#f4f4f4] w-[90%] max-w-md rounded-2xl p-6 shadow-xl font-inter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button */}
            <button
              onClick={() => setChildModal(false)}
              className="absolute top-4 left-4 p-2 rounded-full border border-green-700 text-green-700 hover:bg-green-100"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Profile Section */}
            <div className="flex justify-center mt-4">
              <div className="relative">
                {/* Profile Preview */}
                <img
                  src={previewUrl || "https://i.pravatar.cc/100"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />

                {/* Camera Icon Trigger */}
                <div
                  className="absolute bottom-0 right-0 bg-[#DFDFDF] rounded-full p-1 shadow-md cursor-pointer"
                  onClick={() =>
                    document.getElementById("profile-upload").click()
                  }
                >
                  <img src="/camera.png" alt="Upload" className="w-5 h-5" />
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e)}
                />
              </div>
            </div>

            {/* Form */}
            <form className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-green-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Alexis Sanchez"
                  onChange={(e) => formData.current.set("name", e.target.value)}
                  className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-green-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alexis@gmail.com"
                  onChange={(e) =>
                    formData.current.set("email", e.target.value)
                  }
                  className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-green-700">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="MG Corporate Building"
                  onChange={(e) =>
                    formData.current.set("address", e.target.value)
                  }
                  className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="text-sm font-semibold text-green-700">
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="Trivandrum"
                    onChange={(e) =>
                      formData.current.set("district", e.target.value)
                    }
                    className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-green-700">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Kerala"
                    onChange={(e) =>
                      formData.current.set("district", e.target.value)
                    }
                    className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div>
                  <label className="text-sm font-semibold text-green-700">
                    Pincode
                  </label>
                  <input
                    type="number"
                    placeholder="695011"
                    onChange={(e) =>
                      formData.current.set("zip_code", e.target.value)
                    }
                    className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-green-700">
                    Mobile
                  </label>
                  <input
                    type="number"
                    placeholder="9874563210"
                    onChange={(e) =>
                      formData.current.set("mobile", e.target.value)
                    }
                    className="mt-1 w-full border border-green-700 rounded-md p-2 focus:outline-none"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center pt-4">
                <button
                  className="bg-green-700 text-white px-8 py-2 rounded-lg hover:bg-green-800"
                  onClick={handleProfileSave}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {childModal && userData?.u_role != "user" && (
        <ProfileEditModal onClose={() => setChildModal(false)} />
      )}

      {/* Settings modal */}
      {settingsModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
          onClick={() => setSettingsModal(false)}
        >
          <div
            className="relative bg-white w-[90%] max-w-sm rounded-2xl p-6 shadow-2xl font-inter"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Section */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={() => setSettingsModal(false)}
                className="p-2 rounded-full border border-green-700 text-green-700 hover:bg-green-100"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-[#0A5C15] text-2xl font-semibold font-raleway">
                Settings
              </h1>
            </div>

            {/* Change Password */}
            <div className="mb-6">
              <label className="text-base font-medium text-green-800 mb-2 block">
                Change password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter new password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg shadow-md  focus:ring-1 focus:ring-green-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    // Eye (open)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    // Eye Off (closed)
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19
      c-5.523 0-10-4.477-10-10 0-.457.031-.908.092-1.35M6.228 6.228
      A9.982 9.982 0 0112 5c5.523 0 10 4.477 10 10 0 1.747-.457
      3.386-1.257 4.825M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Delete Button */}
            <div className="flex gap-2">
              <button
                className="w-1/2 py-3 bg-white text-[#0A5C15] border border-green-200 rounded-lg font-semibold shadow hover:bg-green-100 "
                onClick={() => handleChangePassword()}
              >
                Change Password
              </button>
              <button
                className="w-1/2 py-3 bg-white text-red-500 border border-red-200 rounded-lg font-semibold shadow hover:bg-red-100 "
                onClick={() => handleDeleteButton()}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
