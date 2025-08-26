"use client"

import { useState } from "react"
import "./ServiceContactPage.css"
import { useNavigate } from "react-router-dom"
import ProgressSteps from "../ProgressSteps"

const ServiceContactPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    primaryContact: "",
    alternateContact: "",
    whatsappNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return (
      password.length >= 8 && /(?=.*[a-z])/.test(password) && /(?=.*[A-Z])/.test(password) && /(?=.*\d)/.test(password)
    )
  }

  const validateForm = () => {
    const newErrors = {}

    // Primary contact validation (required)
    if (!formData.primaryContact.trim()) {
      newErrors.primaryContact = "Primary contact number is required"
    } else if (!validatePhoneNumber(formData.primaryContact)) {
      newErrors.primaryContact = "Enter a valid 10-digit mobile number"
    }

    // Alternate contact validation (optional but must be valid if provided)
    if (formData.alternateContact.trim() && !validatePhoneNumber(formData.alternateContact)) {
      newErrors.alternateContact = "Enter a valid 10-digit mobile number"
    }

    // WhatsApp number validation (optional but must be valid if provided)
    if (formData.whatsappNumber.trim() && !validatePhoneNumber(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "Enter a valid 10-digit mobile number"
    }

    // Email validation (optional but must be valid if provided)
    if (formData.email.trim() && !validateEmail(formData.email)) {
      newErrors.email = "Enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must be at least 8 characters with uppercase, lowercase, and number"
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    // Check for duplicate numbers
    const numbers = [formData.primaryContact, formData.alternateContact, formData.whatsappNumber].filter((n) =>
      n.trim(),
    )
    if (new Set(numbers).size !== numbers.length) {
      newErrors.general = "Contact numbers must be unique"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field, value) => {
    // Remove non-numeric characters for phone inputs
    if (["primaryContact", "alternateContact", "whatsappNumber"].includes(field)) {
      value = value.replace(/\D/g, "").slice(0, 10)
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: false },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: true, active: true },
  ]

  const handleBack = () => navigate(-1)
  const handleSkip = () => {
    navigate("/ShopProfileLayout")
  }

  const handleNext = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (validateForm()) {
      // Form is valid, proceed to next step
      navigate("/ShopProfileLayout")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="registration-container">
      <div className="left-panel2">
        <img src="/Rectangle25.png" alt="Shop Owner" />
      </div>

      <div className="right-panel2">
        {/* Progress Header */}
        <ProgressSteps title={"Service Registration."} progressSteps={progressSteps} />

        {/* Form Content */}
        <form onSubmit={handleNext}>
          <div className="form-content2">
            <h2 className="section-title">▶ Add Contact Information</h2>

            {errors.general && (
              <div
                style={{
                  color: "#dc3545",
                  fontSize: "14px",
                  marginBottom: "10px",
                  padding: "8px",
                  backgroundColor: "#f8d7da",
                  borderRadius: "4px",
                }}
              >
                {errors.general}
              </div>
            )}

            <div className="section">
              <label>Primary Contact Number*</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={formData.primaryContact}
                  onChange={(e) => handleInputChange("primaryContact", e.target.value)}
                  style={{ borderColor: errors.primaryContact ? "#dc3545" : "" }}
                />
              </div>
              {errors.primaryContact && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.primaryContact}</span>
              )}
            </div>

            <div className="section">
              <label>Alternate Contact Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={formData.alternateContact}
                  onChange={(e) => handleInputChange("alternateContact", e.target.value)}
                  style={{ borderColor: errors.alternateContact ? "#dc3545" : "" }}
                />
              </div>
              {errors.alternateContact && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.alternateContact}</span>
              )}
            </div>

            <div className="section">
              <label>WhatsApp Number</label>
              <div className="phone-input">
                <span className="country-code">🇮🇳 +91</span>
                <input
                  type="tel"
                  placeholder="Enter number"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange("whatsappNumber", e.target.value)}
                  style={{ borderColor: errors.whatsappNumber ? "#dc3545" : "" }}
                />
              </div>
              {errors.whatsappNumber && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.whatsappNumber}</span>
              )}
            </div>

            <div className="section">
              <label>Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                style={{ borderColor: errors.email ? "#dc3545" : "" }}
              />
              {errors.email && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.email}</span>}
            </div>

            <div className="section">
              <label>Enter Password*</label>
              <input
                type="password"
                placeholder="Enter a password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                style={{ borderColor: errors.password ? "#dc3545" : "" }}
              />
              {errors.password && <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.password}</span>}
            </div>

            <div className="section">
              <label>Confirm Password*</label>
              <input
                type="password"
                placeholder="Enter a password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                style={{ borderColor: errors.confirmPassword ? "#dc3545" : "" }}
              />
              {errors.confirmPassword && (
                <span style={{ color: "#dc3545", fontSize: "12px" }}>{errors.confirmPassword}</span>
              )}
            </div>
          </div>
          {/* Navigation Footer */}
          <div className="button-row">
            <div className="left-buttons">
              <button className="back-btn2" type="button" onClick={handleBack}>
                Back
              </button>
            </div>
            <div className="right-buttons">
              <button className="skip-btn2" type="button" onClick={handleSkip}>
                Skip
              </button>
              <button className="next-btn2" type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Validating..." : "Next →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ServiceContactPage
