import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column contact-info">
          <p>
            <FaEnvelope /> hello@leeshop.com
          </p>
          <p>
            <FaPhone /> +91 8894958883
          </p>
          <p>
            <FaMapMarkerAlt /> 14, Anna Salai, T. Nagar,
            <br />
            Chennai, Tamil Nadu - 600017
          </p>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>Groceries</li>
            <li>Food & Beverages</li>
            <li>Home</li>
            <li>Fashion</li>
            <li>Electronics</li>
            <li>Beauty</li>
            <li>Health</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>About Us</h4>
          <ul>
            <li>Company</li>
            <li>Achievements</li>
            <li>Our Goals</li>
          </ul>
        </div>
        <div className="footer-column social">
          <h4>Social Profiles</h4>
          <div className="social-icons">
            <span>
              <FaFacebookF />
            </span>
            <span>
              <FaTwitter />
            </span>
            <span>
              <FaLinkedinIn />
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Lunar Enterprises. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
