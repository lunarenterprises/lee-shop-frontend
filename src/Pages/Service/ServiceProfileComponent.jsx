import { useState, useEffect } from "react";
import "./ServiceProfileComponent.css";
import { FaStar, FaEdit, FaWhatsapp } from "react-icons/fa";
import EditShopModal from "./EditShopModal";
import axios from "axios";

const ServiceProfileComponent = ({ shopData, isOwner = true }) => {
  const [activeTab, setActiveTab] = useState("about");
  const [shopInfo, setShopInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem("userData"));

  // Default shop data fallback
  const defaultShopData = {
    name: "Cakezone",
    rating: 4.5,
    reviewCount: 120,
    location: "Panampilly Nagar, Kochi",
    availability: "Open 7 am to 9 pm",
    deliveryAvailable: true,
    distance: "1.5 km away",
    phone: "+91 98765 43210",
    whatsapp: "+91 98765 43210",
    description:
      "CakeZone is your go-to neighborhood bakery known for fresh, handcrafted cakes and a cozy, personalized service experience.",
    products: [
      "Customized Birthday Cakes",
      "Chocolate Truffle, Red Velvet, and Photo Cakes",
      "Eggless and Sugar-free Options",
      "Pre-orders for Events",
    ],
    openingHours: "7:00 AM – 9:00 PM",
    images: ["/api/placeholder/800/400"],
  };

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
  });

  // Function to generate heading based on rating
  const generateHeadingByRating = (rating) => {
    const headings = {
      5: "Excellent service!",
      4: "Great experience!",
      3: "Good service",
      2: "Average experience",
      1: "Needs improvement",
    };
    return headings[rating] || "Good service";
  };

  // Fetch reviews from API
  const fetchReviews = async (shopId) => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);

      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/shop/list/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop_id: shopId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      if (data.result && data.list && Array.isArray(data.list)) {
        // Process the reviews data
        const processedReviews = data.list.map((review) => ({
          id: review.r_id || review.id,
          name: review.u_name || review.name || "Anonymous",
          date: review.sr_created_at
            ? new Date(review.sr_created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
          rating: review.r_rating || review.rating || 5,
          text: generateHeadingByRating(review.r_rating),
          description: review.r_comment || review.comment || "Great service!",
        }));

        setReviews(processedReviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewsError(err.message);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Submit review to API
  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || newReview.text.trim() === "") {
      alert("Please provide a rating and write a review");
      return;
    }

    if (!userData?.id && !userData?.user_id) {
      alert("Please login to submit a review");
      return;
    }

    const shopId = shop?.shopId || shop?.sh_id;
    if (!shopId) {
      alert("Shop information not available");
      return;
    }

    try {
      setSubmittingReview(true);

      const reviewData = {
        user_id: userData?.id || userData?.user_id,
        shop_id: shopId,
        comment: newReview.text.trim(),
        heading: generateHeadingByRating(newReview.rating),
        rating: newReview.rating,
      };

      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      const data = await response.json();

      if (data.result || data.success) {
        // Reset form
        setNewReview({ rating: 0, text: "" });

        // Refresh reviews list
        await fetchReviews(shopId);

        alert("Review submitted successfully!");
      } else {
        throw new Error(data.message || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle star rating click
  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  // Fetch shop data from API
  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://lunarsenterprises.com:6031/leeshop/shop/list/shop",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sh_id: userData?.id || userData?.sh_id || "16",
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch shop data");
        }

        const data = await response.json();

        if (data.result && data.list && data.list.length > 0) {
          const shop = data.list[0];
          console.log({ shop }, "shop data");
          // Parse products/services string to array
          let products = [];
          try {
            const productData = shop.sh_product_and_service;

            if (Array.isArray(productData)) {
              // Already an array
              products = productData;
            } else if (typeof productData === "string") {
              products = JSON.parse(productData);
            }
          } catch (e) {
            products = [
              "Hair Styling",
              "Skin Care",
              "Bridal Makeup",
              "Spa Services",
            ];
          }

          // Format phone numbers
          const formatPhone = (phone) => {
            if (!phone) return "";
            const phoneStr = phone.toString();
            return phoneStr.startsWith("+91") ? phoneStr : `+91${phoneStr}`;
          };

          // Process shop images
          const shopImages =
            shop.shopimages && shop.shopimages.length > 0
              ? shop.shopimages.map(
                  (img) => `https://lunarsenterprises.com:6031${img.si_image}`
                )
              : ["/api/placeholder/800/400"];

          const previousImages =
            shop.shopimages && shop.shopimages.length > 0
              ? shop.shopimages.map((img) => ({
                  id: img.si_id,
                  url: `https://lunarsenterprises.com:6031${img.si_image}`,
                }))
              : [{ id: null, url: "/api/placeholder/800/400" }];

          const processedShopData = {
            shopId: shop.sh_id,
            name: shop.sh_name || "Shop Name",
            rating: shop.sh_ratings || 0,
            reviewCount: 0, // Will be updated from reviews API
            location: `${shop.sh_location || ""}, ${shop.sh_city || ""}, ${
              shop.sh_state || ""
            }`.replace(/^,\s*|,\s*$/g, ""),
            availability: shop.sh_opening_hours
              ? `Open ${shop.sh_opening_hours}`
              : "Contact for hours",
            deliveryAvailable: shop.sh_delivery_option === "Available",
            distance: "1.5 km away",
            phone: formatPhone(shop.sh_primary_phone),
            whatsapp: formatPhone(shop.sh_whatsapp_number),
            description: shop.sh_description || "Professional service provider",
            products: products,
            openingHours: shop.sh_opening_hours
              ? `${shop.sh_opening_hours}`
              : "Contact for hours",
            category: shop.sh_category_name || "Service",
            owner: shop.sh_owner_name || "Owner",
            email: shop.sh_email || "",
            address: shop.sh_address || "",
            workingDays: shop.sh_working_days || "",
            images: shopImages,
            previousImages: previousImages,
          };

          setShopInfo(processedShopData);

          // Fetch reviews for this shop
          if (processedShopData.shopId) {
            await fetchReviews(processedShopData.shopId);
          }
        } else {
          throw new Error("No shop data found");
        }
      } catch (err) {
        console.error("Error fetching shop data:", err);
        setError(err.message);
        setShopInfo(defaultShopData);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.id || userData?.sh_id) {
      fetchShopData();
    } else {
      setShopInfo(defaultShopData);
      setLoading(false);
      setReviewsLoading(false);
    }
  }, [userData?.id, userData?.sh_id]);

  const shop = shopData || shopInfo || defaultShopData;

  const handleWhatsapp = () => {
    if (shop.whatsapp) {
      const message = `Hi! I'm interested in your services at ${shop.name}`;
      const phoneNumber = shop.whatsapp.replace(/\D/g, "");
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    }
  };

  const handleEdit = () => {
    console.log("Edit shop profile");
    setIsEditModalOpen(true);
  };

  // Add this function to refetch shop data
  const refetchShopData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/shop/list/shop",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sh_id: userData?.id || userData?.sh_id || "16",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch shop data");
      }

      const data = await response.json();

      if (data.result && data.list && data.list.length > 0) {
        const shop = data.list[0];

        // Same processing logic as in useEffect
        let products = [];
        try {
          const productData = shop.sh_product_and_service;
          if (Array.isArray(productData)) {
            products = productData;
          } else if (typeof productData === "string") {
            products = JSON.parse(productData);
          }
        } catch (e) {
          products = [
            "Hair Styling",
            "Skin Care",
            "Bridal Makeup",
            "Spa Services",
          ];
        }

        const formatPhone = (phone) => {
          if (!phone) return "";
          const phoneStr = phone.toString();
          return phoneStr.startsWith("+91") ? phoneStr : `+91${phoneStr}`;
        };

        const shopImages =
          shop.shopimages && shop.shopimages.length > 0
            ? shop.shopimages.map(
                (img) => `https://lunarsenterprises.com:6031${img.si_image}`
              )
            : ["/api/placeholder/800/400"];

        const previousImages =
          shop.shopimages && shop.shopimages.length > 0
            ? shop.shopimages.map((img) => ({
                id: img.si_id,
                url: `https://lunarsenterprises.com:6031${img.si_image}`,
              }))
            : [{ id: null, url: "/api/placeholder/800/400" }];

        const processedShopData = {
          shopId: shop.sh_id,
          name: shop.sh_name || "Shop Name",
          rating: shop.sh_ratings || 0,
          reviewCount: reviews.length || 0,
          location: `${shop.sh_location || ""}, ${shop.sh_city || ""}, ${
            shop.sh_state || ""
          }`.replace(/^,\s*|,\s*$/g, ""),
          availability: shop.sh_opening_hours
            ? `Open ${shop.sh_opening_hours}`
            : "Contact for hours",
          deliveryAvailable: shop.sh_delivery_option === "Available",
          distance: "1.5 km away",
          phone: formatPhone(shop.sh_primary_phone),
          whatsapp: formatPhone(shop.sh_whatsapp_number),
          description: shop.sh_description || "Professional service provider",
          products: products,
          openingHours: shop.sh_opening_hours
            ? `${shop.sh_opening_hours}`
            : "Contact for hours",
          category: shop.sh_category_name || "Service",
          owner: shop.sh_owner_name || "Owner",
          email: shop.sh_email || "",
          address: shop.sh_address || "",
          workingDays: shop.sh_working_days || "",
          images: shopImages,
          previousImages: previousImages,
        };

        setShopInfo(processedShopData);
      }
    } catch (err) {
      console.error("Error refetching shop data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShopData = async (updatedData, formDataToSend) => {
    console.log("Saving shop data:", formDataToSend);

    try {
      // Make API call with the FormData
      const response = await axios.post(
        "https://lunarsenterprises.com:6031/leeshop/shop/edit/shop",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response.data);

      // Option 1: Update local state with comprehensive data merge
      setShopInfo((prev) => ({
        ...prev,
        name: updatedData.shopName || updatedData.name || prev.name,
        sh_name: updatedData.shopName || updatedData.name || prev.sh_name,
        owner: updatedData.ownerName || updatedData.owner || prev.owner,
        sh_owner_name:
          updatedData.ownerName || updatedData.owner || prev.sh_owner_name,
        sh_category_name:
          updatedData.businessType ||
          updatedData.category ||
          prev.sh_category_name,
        category:
          updatedData.selectedCategory || updatedData.category || prev.category,
        address: updatedData.address || prev.address,
        phone: updatedData.phone || prev.phone,
        whatsapp: updatedData.whatsapp || prev.whatsapp,
        email: updatedData.email || prev.email,
        description: updatedData.description || prev.description,
        sh_description: updatedData.description || prev.sh_description,
        deliveryAvailable:
          updatedData.deliveryAvailable ?? prev.deliveryAvailable,
        sh_delivery_option: updatedData.deliveryAvailable
          ? "Available"
          : prev.sh_delivery_option,
        workingDays: updatedData.workingDays || prev.workingDays,
        sh_working_days: updatedData.workingDays || prev.sh_working_days,
        openingHours: updatedData.openingHours || prev.openingHours,
        sh_opening_hours: updatedData.openingHours || prev.sh_opening_hours,
        images: updatedData.images || prev.images,
        products: updatedData.products || prev.products,
      }));

      // Close the modal
      setIsEditModalOpen(false);

      // Option 2: Refetch data from server to ensure consistency
      await refetchShopData();

      // Close the modal
      setIsEditModalOpen(false);

      // Show success message
      alert("Shop details updated successfully!");

      return response.data;
    } catch (error) {
      console.error("Error updating shop:", error);

      // Handle different types of errors
      let errorMessage = "Failed to update shop details. Please try again.";

      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || errorMessage;
        console.error(
          "Server error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error. Please check your connection.";
        console.error("Network error:", error.request);
      } else {
        // Something else happened
        console.error("Error:", error.message);
      }

      // Show error message
      alert(errorMessage);
      throw error; // Re-throw to let the modal handle loading states
    }
  };

  if (loading) {
    return (
      <div className="shop-profile loading">
        <div className="loading-spinner">Loading shop information...</div>
      </div>
    );
  }

  const isOpen = shop.openingHours || shop.isOpen;

  return (
    <div className="shop-details-container">
      <div className="shop-details-wrapper">
        {/* ===== Main Content ===== */}
        <div className="shop-main-content">
          <div className="shop-hero-section2">
            <img
              src={shop.images[0] || "/placeholder.svg"}
              alt={shop.sh_name || shop.name}
              className="shop-hero-image"
            />

            {/* Distance Badge */}
            <div className="image-distance-badge">{shop.distance}</div>

            {/* Shop Info Card - Overlapping image and extending below */}
            <div className="shop-info-card">
              {/* Row 1: Shop Name + Opening Hours */}
              <div className="shop-header-row">
                <h1 className="shop-title2">
                  {shop.sh_name || shop.name || "Cakezone"}
                </h1>
                {isOpen && (
                  <div className="status-section">
                    <svg
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="4" cy="4" r="4" fill="black" />
                    </svg>
                    <span className="status-text open">
                      {shop.openingHours}
                    </span>
                  </div>
                )}
              </div>
              {/* Row 2: Rating + Delivery */}
              <div className="shop-meta-row">
                <div className="rating-section">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.9999 21.5938L9.81242 24.7187C9.58326 24.8646 9.34367 24.9271 9.09367 24.9062C8.84367 24.8854 8.62492 24.8021 8.43742 24.6562C8.24992 24.5104 8.10409 24.3283 7.99992 24.11C7.89576 23.8917 7.87492 23.6467 7.93742 23.375L9.31242 17.4688L4.71867 13.5C4.51034 13.3125 4.38034 13.0988 4.32867 12.8587C4.27701 12.6187 4.29242 12.3846 4.37492 12.1563C4.45742 11.9279 4.58242 11.7404 4.74992 11.5938C4.91742 11.4471 5.14659 11.3533 5.43742 11.3125L11.4999 10.7812L13.8437 5.21875C13.9478 4.96875 14.1095 4.78125 14.3287 4.65625C14.5478 4.53125 14.7716 4.46875 14.9999 4.46875C15.2283 4.46875 15.452 4.53125 15.6712 4.65625C15.8903 4.78125 16.052 4.96875 16.1562 5.21875L18.4999 10.7812L24.5624 11.3125C24.8541 11.3542 25.0833 11.4479 25.2499 11.5938C25.4166 11.7396 25.5416 11.9271 25.6249 12.1563C25.7083 12.3854 25.7241 12.62 25.6724 12.86C25.6208 13.1 25.4903 13.3133 25.2812 13.5L20.6874 17.4688L22.0624 23.375C22.1249 23.6458 22.1041 23.8908 21.9999 24.11C21.8958 24.3292 21.7499 24.5112 21.5624 24.6562C21.3749 24.8013 21.1562 24.8846 20.9062 24.9062C20.6562 24.9279 20.4166 24.8654 20.1874 24.7187L14.9999 21.5938Z"
                      fill="#E8C930"
                    />
                  </svg>
                  <span className="rating-text2">
                    {(shop.sh_ratings || shop.rating || 4.5).toFixed(1)} (
                    {reviews.length || shop.reviewCount || 0} Reviews)
                  </span>
                  {/* Location - Full width */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 11.5C11.337 11.5 10.7011 11.2366 10.2322 10.7678C9.76339 10.2989 9.5 9.66304 9.5 9C9.5 8.33696 9.76339 7.70107 10.2322 7.23223C10.7011 6.76339 11.337 6.5 12 6.5C12.663 6.5 13.2989 6.76339 13.7678 7.23223C14.2366 7.70107 14.5 8.33696 14.5 9C14.5 9.3283 14.4353 9.65339 14.3097 9.95671C14.1841 10.26 13.9999 10.5356 13.7678 10.7678C13.5356 10.9999 13.26 11.1841 12.9567 11.3097C12.6534 11.4353 12.3283 11.5 12 11.5ZM12 2C10.1435 2 8.36301 2.7375 7.05025 4.05025C5.7375 5.36301 5 7.14348 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 7.14348 18.2625 5.36301 16.9497 4.05025C15.637 2.7375 13.8565 2 12 2Z"
                      fill="#0A5C15"
                    />
                  </svg>
                  <span className="rating-text2">
                    {shop.sh_location || shop.location || "Panampilly Nagar"},{" "}
                    {shop.sh_city || shop.city || "Kochi"}
                  </span>
                </div>
                {(shop.sh_delivery_option === "Available" ||
                  shop.delivery !== false) && (
                  <div className="delivery-section">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.33366 13.7497L10.8337 14.583C10.8337 14.583 17.0837 13.333 17.917 13.333C18.7503 13.333 18.7503 14.1663 17.917 14.9997C17.0837 15.833 14.167 18.333 11.667 18.333C9.16699 18.333 7.50033 17.083 5.83366 17.083H1.66699"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.66699 12.083C2.50033 11.2497 4.16699 9.99967 5.83366 9.99967C7.50033 9.99967 11.4587 11.6663 12.0837 12.4997C12.7087 13.333 10.8337 14.583 10.8337 14.583M6.66699 7.49967V4.16634C6.66699 3.94533 6.75479 3.73337 6.91107 3.57709C7.06735 3.42081 7.27931 3.33301 7.50033 3.33301H17.5003C17.7213 3.33301 17.9333 3.42081 18.0896 3.57709C18.2459 3.73337 18.3337 3.94533 18.3337 4.16634V10.833"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.417 3.33301H14.5837V7.08301H10.417V3.33301Z"
                        stroke="#0A5C15"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Delivery Available</span>
                  </div>
                )}
              </div>

              {/* Row 3: Action Buttons */}
              <div className="action-buttons-row">
                <div className="left-buttons">
                  {shop.phone && (
                    <button
                      className="btn-contact"
                      onClick={() =>
                        (window.location.href = `tel:${shop.phone}`)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                      >
                        <path
                          d="M16.537 20.1876C15.7364 20.1876 14.6117 19.898 12.9276 18.9571C10.8797 17.8087 9.29568 16.7484 7.25884 14.7169C5.29501 12.7543 4.33935 11.4837 3.00183 9.04982C1.49082 6.30177 1.74839 4.8613 2.03632 4.24565C2.37921 3.50983 2.88535 3.06974 3.53955 2.63292C3.91113 2.38947 4.30435 2.18077 4.71423 2.00948C4.75525 1.99185 4.79339 1.97503 4.82744 1.95985C5.03046 1.86839 5.33808 1.73017 5.72773 1.87782C5.98777 1.97544 6.21992 2.17519 6.58332 2.53407C7.32857 3.26907 8.34699 4.90601 8.72269 5.70991C8.97494 6.25173 9.14187 6.60939 9.14228 7.01052C9.14228 7.48015 8.90603 7.84232 8.61933 8.23319C8.5656 8.30661 8.51228 8.37675 8.4606 8.44483C8.14847 8.85499 8.07998 8.97353 8.12509 9.18517C8.21656 9.6105 8.89865 10.8767 10.0196 11.9951C11.1406 13.1136 12.3702 13.7527 12.7972 13.8437C13.0178 13.8909 13.1388 13.8195 13.5621 13.4963C13.6228 13.45 13.6852 13.402 13.7504 13.354C14.1876 13.0287 14.533 12.7986 14.9915 12.7986H14.994C15.3931 12.7986 15.7347 12.9717 16.3007 13.2572C17.039 13.6296 18.7252 14.6349 19.4647 15.381C19.8244 15.7436 20.025 15.9749 20.123 16.2345C20.2706 16.6254 20.1316 16.9318 20.041 17.1369C20.0258 17.1709 20.009 17.2082 19.9913 17.2497C19.8187 17.6588 19.6087 18.0512 19.3642 18.4219C18.9282 19.074 18.4865 19.5789 17.749 19.9222C17.3703 20.1014 16.9559 20.1921 16.537 20.1876Z"
                          fill="#D4F49C"
                        />
                      </svg>
                      <span>Contact Now</span>
                    </button>
                  )}
                  {shop.whatsapp && (
                    <button className="btn-whatsapp" onClick={handleWhatsapp}>
                      <FaWhatsapp size={"24"} />
                      <span>What's app</span>
                    </button>
                  )}
                  <button className="btn-whatsapp" onClick={handleEdit}>
                    <FaEdit size={22} />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          <div
            className="images-gallery"
            style={{ marginTop: "10rem", backgroundColor: "#e2e2e2" }}
          >
            <div className="main-image">
              <img
                src={shop.images[0] || "/placeholder.svg"}
                alt="Gallery main"
                onError={(e) => {
                  e.target.src = "/api/placeholder/200/150";
                }}
              />
            </div>
            <div className="side-images">
              {shop.images.slice(1, 5).map((image, index) => (
                <div key={index} className="side-image">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Gallery ${index + 2}`}
                    onError={(e) => {
                      e.target.src = "/api/placeholder/200/150";
                    }}
                  />
                  {index === 3 && shop.images.length > 5 && (
                    <div className="more-overlay">
                      <span>+{shop.images.length - 5}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="tabs-container" style={{ marginTop: "0px" }}>
            <div
              style={{
                display: "flex",
                gap: "20px",
                maxWidth: "400px",
                marginLeft: "20px",
              }}
            >
              <button
                className={`tab-btn ${activeTab === "about" ? "active" : ""}`}
                onClick={() => setActiveTab("about")}
              >
                About Us
              </button>
              <button
                className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({reviews.length})
              </button>
            </div>

            <div className="tabs-content">
              {activeTab === "about" ? (
                <div className="about-content">
                  <p className="description">
                    {shop.sh_description || shop.description}
                  </p>

                  <div className="info-section">
                    <h3>Products and services</h3>
                    <ul className="products-list2">
                      {shop.products.length > 0 &&
                        shop.products.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h3>Opening Hours</h3>
                    <ul className="products-list2">
                      <li>{shop.openingHours}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="reviews-content">
                  {/* Write a Review Section */}
                  <div className="write-review-section">
                    <h3 className="write-review-title">Write a Review</h3>

                    <div className="rating-input">
                      <span className="rating-label2">Rating:</span>
                      <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${
                              star <= newReview.rating ? "active" : ""
                            }`}
                            onClick={() => handleStarClick(star)}
                            disabled={submittingReview}
                          >
                            <svg
                              width="25"
                              height="24"
                              viewBox="0 0 25 24"
                              fill={
                                star <= newReview.rating ? "#FFD700" : "none"
                              }
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M8.26839 7.52838L10.3472 3.39785C10.4077 3.27831 10.5007 3.17777 10.6159 3.1075C10.7311 3.03722 10.8639 3 10.9993 3C11.1347 3 11.2675 3.03722 11.3826 3.1075C11.4978 3.17777 11.5909 3.27831 11.6514 3.39785L13.7302 7.52838L18.3774 8.1947C18.5114 8.21304 18.6376 8.26819 18.7414 8.35386C18.8452 8.43954 18.9225 8.55228 18.9644 8.67922C19.0064 8.80616 19.0113 8.94218 18.9787 9.07177C18.9461 9.20135 18.8772 9.31927 18.7799 9.41207L15.4177 12.6252L16.2114 17.1647C16.313 17.7473 15.6889 18.191 15.1552 17.9163L10.9993 15.7721L6.84253 17.9163C6.30964 18.1918 5.68553 17.7473 5.78715 17.1639L6.58089 12.6244L3.21869 9.41128C3.12186 9.31842 3.05337 9.20061 3.02102 9.07126C2.98867 8.94191 2.99374 8.8062 3.03567 8.67955C3.07759 8.5529 3.15469 8.4404 3.25819 8.35483C3.36169 8.26926 3.48744 8.21405 3.62116 8.19549L8.26839 7.52838Z"
                                stroke={
                                  star <= newReview.rating
                                    ? "#FFD700"
                                    : "#000000"
                                }
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>

                    <textarea
                      className="review-textarea"
                      placeholder="Write about the shop & more."
                      value={newReview.text}
                      onChange={(e) =>
                        setNewReview({ ...newReview, text: e.target.value })
                      }
                      rows={4}
                      disabled={submittingReview}
                    />

                    <button
                      className="post-review-btn"
                      onClick={handleSubmitReview}
                      disabled={submittingReview}
                    >
                      {submittingReview ? "Posting..." : "Post Review"}
                    </button>
                  </div>

                  {/* Customer Reviews Section */}
                  <div className="customer-reviews-section">
                    <h3 className="customer-reviews-title">Customer Reviews</h3>

                    {reviewsLoading ? (
                      <div className="reviews-loading">
                        <p>Loading reviews...</p>
                      </div>
                    ) : reviewsError ? (
                      <div className="reviews-error">
                        <p>Error loading reviews: {reviewsError}</p>
                        <button
                          onClick={() =>
                            fetchReviews(shop?.shopId || shop?.sh_id)
                          }
                          style={{
                            marginTop: "10px",
                            padding: "8px 16px",
                            backgroundColor: "#0A5C15",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Retry
                        </button>
                      </div>
                    ) : reviews.length === 0 ? (
                      <div className="no-reviews">
                        <p>No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      <div className="reviews-grid">
                        {reviews.map((review) => (
                          <div key={review.id} className="review-card">
                            <div className="review-header">
                              <div className="reviewer-info">
                                <div className="reviewer-avatar">
                                  <img
                                    src="/icons-user-default.png"
                                    alt={review.name}
                                  />
                                </div>
                                <h4 className="reviewer-name2">
                                  {review.name}
                                </h4>
                              </div>

                              <span className="review-date">{review.date}</span>
                            </div>

                            <div className="review-rating">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  width="25"
                                  height="25"
                                  viewBox="0 0 25 25"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.26839 7.52838L10.3472 3.39785C10.4077 3.27831 10.5007 3.17777 10.6159 3.1075C10.7311 3.03722 10.8639 3 10.9993 3C11.1347 3 11.2675 3.03722 11.3826 3.1075C11.4978 3.17777 11.5909 3.27831 11.6514 3.39785L13.7302 7.52838L18.3774 8.1947C18.5114 8.21304 18.6376 8.26819 18.7414 8.35387C18.8452 8.43954 18.9225 8.55228 18.9644 8.67922C19.0064 8.80616 19.0113 8.94218 18.9787 9.07177C18.9461 9.20135 18.8772 9.31927 18.7799 9.41207L15.4177 12.6252L16.2114 17.1647C16.313 17.7473 15.6889 18.191 15.1552 17.9163L10.9993 15.7721L6.84253 17.9163C6.30964 18.1918 5.68553 17.7473 5.78715 17.1639L6.58089 12.6244L3.21869 9.41128C3.12186 9.31842 3.05337 9.20061 3.02102 9.07126C2.98867 8.94191 2.99374 8.8062 3.03567 8.67955C3.07759 8.5529 3.15469 8.4404 3.25819 8.35483C3.36169 8.26926 3.48744 8.21405 3.62116 8.19549L8.26839 7.52838Z"
                                    fill={
                                      star <= (review?.rating || 0)
                                        ? "#E8C930"
                                        : "none"
                                    }
                                    stroke={
                                      star <= (review?.rating || 0)
                                        ? "none"
                                        : "#E8C930"
                                    }
                                    strokeWidth={
                                      star <= (review?.rating || 0)
                                        ? "0"
                                        : "1.5"
                                    }
                                  />
                                </svg>
                              ))}
                            </div>

                            <div className="review-content">
                              <h5 className="review-title">{review.text}</h5>
                              <p className="review-description">
                                {review.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <EditShopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        shopData={shop}
        onSave={handleSaveShopData}
      />
    </div>
  );
};

export default ServiceProfileComponent;
