import { useState, useEffect } from "react"
import "./ServiceRegistration.css" // renamed CSS file
import { useNavigate } from "react-router-dom"
import ProgressSteps from "../ProgressSteps"

const ServiceRegistration = () => {
  const [categoriesVisible, setCategoriesVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    businessCategory: "",
    shopAddress: "",
    state: "",
    district: "",
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const progressSteps = [
    { id: 1, completed: false, active: false },
    { id: 2, completed: false, active: true },
    { id: 3, completed: false, active: false },
    { id: 4, completed: false, active: false },
    { id: 5, completed: false, active: false },
  ]

  const businessCategories = [
    "Salon",
    "Cleaning",
    "Tailoring & Fashion Services",
    "Home Repairs",
    "Moving Services",
    "Health",
    "Education",
    "Events",
    "Pet Care",
    "Beauty",
    "Consulting",
    "Marketing",
    "Legal Services",
  ]

  const validateField = (name, value) => {
    const newErrors = { ...errors }

    switch (name) {
      case "shopName":
        if (!value.trim()) {
          newErrors.shopName = "Service name is required"
        } else if (value.trim().length < 2) {
          newErrors.shopName = "Service name must be at least 2 characters"
        } else if (value.trim().length > 100) {
          newErrors.shopName = "Service name must be less than 100 characters"
        } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(value.trim())) {
          newErrors.shopName = "Service name contains invalid characters"
        } else {
          delete newErrors.shopName
        }
        break

      case "ownerName":
        if (!value.trim()) {
          newErrors.ownerName = "Owner name is required"
        } else if (value.trim().length < 2) {
          newErrors.ownerName = "Owner name must be at least 2 characters"
        } else if (value.trim().length > 50) {
          newErrors.ownerName = "Owner name must be less than 50 characters"
        } else if (!/^[a-zA-Z\s.'-]+$/.test(value.trim())) {
          newErrors.ownerName = "Owner name can only contain letters, spaces, dots, hyphens, and apostrophes"
        } else {
          delete newErrors.ownerName
        }
        break

      case "businessCategory":
        if (!value) {
          newErrors.businessCategory = "Business category is required"
        } else if (!businessCategories.includes(value)) {
          newErrors.businessCategory = "Please select a valid business category"
        } else {
          delete newErrors.businessCategory
        }
        break

      case "shopAddress":
        if (value.trim() && value.trim().length < 10) {
          newErrors.shopAddress = "Address must be at least 10 characters if provided"
        } else if (value.trim().length > 200) {
          newErrors.shopAddress = "Address must be less than 200 characters"
        } else {
          delete newErrors.shopAddress
        }
        break

      case "state":
        if (value.trim() && value.trim().length < 2) {
          newErrors.state = "State must be at least 2 characters if provided"
        } else if (value.trim().length > 50) {
          newErrors.state = "State must be less than 50 characters"
        } else if (value.trim() && !/^[a-zA-Z\s.-]+$/.test(value.trim())) {
          newErrors.state = "State can only contain letters, spaces, dots, and hyphens"
        } else {
          delete newErrors.state
        }
        break

      case "district":
        if (value.trim() && value.trim().length < 2) {
          newErrors.district = "City must be at least 2 characters if provided"
        } else if (value.trim().length > 50) {
          newErrors.district = "City must be less than 50 characters"
        } else if (value.trim() && !/^[a-zA-Z\s.-]+$/.test(value.trim())) {
          newErrors.district = "City can only contain letters, spaces, dots, and hyphens"
        } else {
          delete newErrors.district
        }
        break

      default:
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateForm = () => {
    const newErrors = {}

    // Required field validations
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Service name is required"
    } else if (formData.shopName.trim().length < 2) {
      newErrors.shopName = "Service name must be at least 2 characters"
    } else if (!/^[a-zA-Z0-9\s&.-]+$/.test(formData.shopName.trim())) {
      newErrors.shopName = "Service name contains invalid characters"
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required"
    } else if (formData.ownerName.trim().length < 2) {
      newErrors.ownerName = "Owner name must be at least 2 characters"
    } else if (!/^[a-zA-Z\s.'-]+$/.test(formData.ownerName.trim())) {
      newErrors.ownerName = "Owner name can only contain letters, spaces, dots, hyphens, and apostrophes"
    }

    if (!selectedCategory) {
      newErrors.businessCategory = "Business category is required"
    }

    // Optional field validations
    if (formData.shopAddress.trim() && formData.shopAddress.trim().length < 10) {
      newErrors.shopAddress = "Address must be at least 10 characters if provided"
    }

    if (formData.state.trim() && formData.state.trim().length < 2) {
      newErrors.state = "State must be at least 2 characters if provided"
    } else if (formData.state.trim() && !/^[a-zA-Z\s.-]+$/.test(formData.state.trim())) {
      newErrors.state = "State can only contain letters, spaces, dots, and hyphens"
    }

    if (formData.district.trim() && formData.district.trim().length < 2) {
      newErrors.district = "City must be at least 2 characters if provided"
    } else if (formData.district.trim() && !/^[a-zA-Z\s.-]+$/.test(formData.district.trim())) {
      newErrors.district = "City can only contain letters, spaces, dots, and hyphens"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const sanitizeInput = (value) => {
    return value.replace(/[<>]/g, "").trim()
  }

  // Load service info from localStorage when component mounts
  useEffect(() => {
    const savedServiceInfo = localStorage.getItem("serviceInfo")
    if (savedServiceInfo) {
      try {
        const parsedData = JSON.parse(savedServiceInfo)
        console.log("Loading serviceInfo from localStorage:", parsedData)

        const sanitizedData = {
          shopName: sanitizeInput(parsedData.shopName || ""),
          ownerName: sanitizeInput(parsedData.ownerName || ""),
          businessCategory: parsedData.businessCategory || "",
          shopAddress: sanitizeInput(parsedData.shopAddress || ""),
          state: sanitizeInput(parsedData.state || ""),
          district: sanitizeInput(parsedData.district || ""),
        }

        // Set form data
        setFormData(sanitizedData)

        // Set selected category if it exists
        if (sanitizedData.businessCategory) {
          setSelectedCategory(sanitizedData.businessCategory)
        }
      } catch (error) {
        console.error("Error parsing localStorage serviceInfo:", error)
        // If there's an error parsing, remove the corrupted data
        localStorage.removeItem("serviceInfo")
      }
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const sanitizedValue = sanitizeInput(value)

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }))

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate field on change
    validateField(name, sanitizedValue)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setFormData((prev) => ({
      ...prev,
      businessCategory: category,
    }))

    // Mark as touched and validate
    setTouched((prev) => ({
      ...prev,
      businessCategory: true,
    }))
    validateField("businessCategory", category)
  }

  const handleNextService = async () => {
    setIsSubmitting(true)

    // Mark all fields as touched
    setTouched({
      shopName: true,
      ownerName: true,
      businessCategory: true,
      shopAddress: true,
      state: true,
      district: true,
    })

    // Validate entire form
    const isValid = validateForm()

    if (!isValid) {
      setIsSubmitting(false)
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        if (element) {
          element.focus()
        }
      }
      return
    }

    try {
      const sanitizedFormData = {
        shopName: sanitizeInput(formData.shopName),
        ownerName: sanitizeInput(formData.ownerName),
        businessCategory: formData.businessCategory,
        shopAddress: sanitizeInput(formData.shopAddress),
        state: sanitizeInput(formData.state),
        district: sanitizeInput(formData.district),
      }

      localStorage.setItem("serviceInfo", JSON.stringify(sanitizedFormData))
      console.log("Storing serviceInfo:", sanitizedFormData)

      navigate("/OperationDetails")
    } catch (error) {
      console.error("Error saving service info:", error)
      alert("An error occurred while saving your information. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  const handleSkip = () => {
    navigate("/OperationDetails")
  }

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName] ? errors[fieldName] : ""
  }

  return (
    <div className="registration-container">
      {/* Left Panel with Background Image */}
      <div className="left-panel2">
        <img src="/ServiceRegistration-one.png" alt="Business Owner" className="left-image2" />
      </div>
      <div className="right-panel_2">
        {/* Progress Header */}
        <ProgressSteps title={"Business Registration."} progressSteps={progressSteps} />

        {/* Form Content */}
        <div className="form-content2">
          <h2 className="section-title">▶ Basic Service & Shop Location Info</h2>

          {/* Service Name and Owner Name Row */}
          <div className="section">
            <div className="service-input-row">
              <div className="service-input-group">
                <label>Service Name *</label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Enter your Shop Name."
                  required
                  maxLength="100"
                  style={{
                    borderColor: getFieldError("shopName") ? "#ef4444" : undefined,
                  }}
                />
                {getFieldError("shopName") && (
                  <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {getFieldError("shopName")}
                  </span>
                )}
              </div>
              <div className="service-input-group">
                <label>Owner Name *</label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter Owner Name."
                  required
                  maxLength="50"
                  style={{
                    borderColor: getFieldError("ownerName") ? "#ef4444" : undefined,
                  }}
                />
                {getFieldError("ownerName") && (
                  <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {getFieldError("ownerName")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Business Category */}
          <div className="section">
            <div className="service-category-section">
              <label>Business Category *</label>
              {getFieldError("businessCategory") && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginBottom: "8px", display: "block" }}>
                  {getFieldError("businessCategory")}
                </span>
              )}
              <div className="service-category-grid">
                {businessCategories.slice(0, categoriesVisible ? businessCategories.length : 12).map((cat, i) => (
                  <button
                    key={i}
                    className={`service-category-btn ${selectedCategory === cat ? "selected" : ""}`}
                    onClick={() => handleCategorySelect(cat)}
                    type="button"
                    style={{
                      borderColor: getFieldError("businessCategory") && !selectedCategory ? "#ef4444" : undefined,
                    }}
                  >
                    {cat}
                  </button>
                ))}
                {!categoriesVisible && (
                  <button
                    className="service-category-btn view-more"
                    onClick={() => setCategoriesVisible(true)}
                    type="button"
                  >
                    View more
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Full Address */}
          <div className="section">
            <div className="service-input-group">
              <label>Full Address</label>
              <input
                type="text"
                name="shopAddress"
                value={formData.shopAddress}
                onChange={handleInputChange}
                placeholder="Enter your Shop Address."
                maxLength="200"
                style={{
                  borderColor: getFieldError("shopAddress") ? "#ef4444" : undefined,
                }}
              />
              {getFieldError("shopAddress") && (
                <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                  {getFieldError("shopAddress")}
                </span>
              )}
            </div>
          </div>

          {/* State and City Row */}
          <div className="section">
            <div className="service-input-row">
              <div className="service-input-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your State your shop in."
                  maxLength="50"
                  style={{
                    borderColor: getFieldError("state") ? "#ef4444" : undefined,
                  }}
                />
                {getFieldError("state") && (
                  <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {getFieldError("state")}
                  </span>
                )}
              </div>
              <div className="service-input-group">
                <label>City</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Enter your City your shop in."
                  maxLength="50"
                  style={{
                    borderColor: getFieldError("district") ? "#ef4444" : undefined,
                  }}
                />
                {getFieldError("district") && (
                  <span style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px", display: "block" }}>
                    {getFieldError("district")}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="button-row">
          <div className="left-buttons">
            <button className="back-btn2" onClick={handleBack}>
              Back
            </button>
          </div>
          <div className="right-buttons">
            <button className="skip-btn2" onClick={handleSkip}>
              Skip
            </button>
            <button className="next-btn2" onClick={handleNextService} disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceRegistration
