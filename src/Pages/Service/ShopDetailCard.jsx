import { useState, useEffect } from "react";
import "./ShopDetailCard.css";
import { FaStar, FaWhatsapp } from "react-icons/fa";

const ShopDetailCard = ({
  shop,
  shopsList = [],
  servicesNearby = [],
  userId,
  // NEW PROPS - Add these three new props
  onSimilarShopClick,
  onSimilarServiceClick,
  onBackToHome,
}) => {
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [newReview, setNewReview] = useState({
    rating: 0,
    text: "",
  });

  // Fetch reviews when component mounts or shop changes
  useEffect(() => {
    if (shop?.sh_id) {
      fetchReviews();
    }
  }, [shop?.sh_id]);

  // NEW HANDLER - Handle similar shop clicks
  const handleSimilarShopClick = (shopData) => {
    if (onSimilarShopClick && shopData.id !== shop.sh_id) {
      onSimilarShopClick(shopData.id);
    }
  };

  // NEW HANDLER - Handle service clicks
  const handleSimilarServiceClick = (shopData) => {
    if (onSimilarServiceClick && shopData.id !== shop.sh_id) {
      onSimilarServiceClick(shopData.id);
    }
  };

  // Function to fetch reviews from API
  const fetchReviews = async () => {
    if (!shop?.sh_id) return;

    setIsLoadingReviews(true);
    try {
      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/shop/list/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shop_id: shop.sh_id,
          }),
        }
      );

      const data = await response.json();

      if (data.result) {
        // Transform API response to match your UI structure
        const formattedReviews =
          data.list?.map((review) => ({
            id: review.r_id,
            name: review.user_name || review.name || "Anonymous User",
            date: review.created_at
              ? new Date(review.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "Recent",
            rating: review.r_rating,
            text: generateHeadingFromRating(review.r_rating),
            description: review.r_comment || review.text || "",
          })) || [];

        setReviews(formattedReviews);
      } else {
        console.error("Failed to fetch reviews:", data.message);
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Generate dynamic heading based on rating
  const generateHeadingFromRating = (rating) => {
    const headings = {
      5: "Absolutely amazing experience!",
      4: "Really good service!",
      3: "Good overall experience",
      2: "Could be better",
      1: "Needs improvement",
    };
    return headings[rating] || "Customer feedback";
  };

  // Handle review submission - FIXED VERSION
  const handleSubmitReview = async () => {
    if (newReview.rating === 0 || newReview.text.trim() === "") {
      alert("Please provide a rating and write a review");
      return;
    }

    if (!userId) {
      alert("Please log in to submit a review");
      return;
    }

    if (!shop?.sh_id) {
      alert("Shop information not available");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const dynamicHeading = generateHeadingFromRating(newReview.rating);

      console.log("Submitting review:", {
        user_id: userId,
        shop_id: shop.sh_id,
        comment: newReview.text,
        heading: dynamicHeading,
        rating: newReview.rating,
      });

      const response = await fetch(
        "https://lunarsenterprises.com:6031/leeshop/shop/add/review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId,
            shop_id: shop.sh_id,
            comment: newReview.text,
            heading: dynamicHeading,
            rating: newReview.rating,
          }),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      // Check for successful response more carefully
      if (response.ok && (data.success === true || data.result === true)) {
        const newReviewData = {
          id: `temp_${Date.now()}`, // Temporary ID with prefix
          name: "You",
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          rating: newReview.rating,
          text: dynamicHeading,
          description: newReview.text,
        };

        console.log("Adding new review to state:", newReviewData);
        console.log("Current reviews count:", reviews.length);

        // Use functional state update and log the result
        setReviews((prevReviews) => {
          const updatedReviews = [newReviewData, ...prevReviews];
          console.log("Updated reviews count:", updatedReviews.length);
          return updatedReviews;
        });

        // Clear the form
        setNewReview({ rating: 0, text: "" });

        alert("Review submitted successfully!");

        // REMOVED: setTimeout fetchReviews to avoid conflicts
        // The local state update should be sufficient
      } else {
        console.error("Review submission failed:", data);
        alert(data.message || "Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!shop || shop.error) {
    return (
      <div className="shop-detail-error">
        {shop?.error || "No shop data found."}
      </div>
    );
  }

  // Main image and gallery
  const shopImage = shop.shopimages?.[0]?.si_image
    ? `https://lunarsenterprises.com:6031/${shop.shopimages[0].si_image}`
    : "/shop.png";

  const gallery =
    Array.isArray(shop.shopimages) && shop.shopimages.length > 0
      ? shop.shopimages.map(
          (img) => `https://lunarsenterprises.com:6031/${img.si_image}`
        )
      : [shopImage];

  // Info fields
  const category = shop.sh_category_name || shop.category_name || "";
  const address =
    shop.sh_address ||
    shop.address ||
    [shop.sh_location, shop.sh_city, shop.sh_state].filter(Boolean).join(", ");
  const phone = shop.sh_primary_phone || shop.primary_phone || "";
  const whatsapp = shop.sh_whatsapp_number || shop.whatsapp_number || "";

  // Parse products
  const productsString =
    shop.sh_product_and_service || shop.product_and_service || "";
  const products = productsString
    .replace(/[[\]]/g, "")
    .split(/[,;]/)
    .map((item) => item.trim())
    .filter(Boolean);

  // Calculate distance
  const calculateDistance = () => "1.5 km away";

  // UPDATED: Separate shops and services from shopsList based on sh_shop_or_service
  const actualShops = Array.isArray(shopsList)
    ? shopsList.filter(
        (item) =>
          (item.sh_shop_or_service === "shop" ||
            item.sh_shop_or_service === "Shop") &&
          item.sh_id !== shop.sh_id
      )
    : [];

  const actualServices = Array.isArray(shopsList)
    ? shopsList.filter(
        (item) =>
          (item.sh_shop_or_service === "service" ||
            item.sh_shop_or_service === "Service") &&
          item.sh_id !== shop.sh_id
      )
    : [];

  // UPDATED: Similar shops - only actual shops
  const similarShops = actualShops.slice(0, 5).map((item) => ({
    id: item.sh_id,
    name: item.sh_name || "Sweet Treats Bakery",
    distance: calculateDistance(),
    rating: item.sh_ratings.toFixed(1),
    reviewCount: item.sh_review_count ?? 0,
    location: [item.sh_location, item.sh_city].filter(Boolean).join(", "),
    image: item.shopimages?.[0]?.si_image
      ? `https://lunarsenterprises.com:6031/${item.shopimages[0].si_image}`
      : "/shop.png",
  }));

  // UPDATED: Service shops - only actual services
  const serviceShops = actualServices.slice(0, 5).map((item) => ({
    id: item.sh_id,
    name: item.sh_name || "Professional Service",
    distance: calculateDistance(),
    rating: item.sh_ratings.toFixed(1),
    reviewCount: item.sh_review_count ?? 0,
    location: [item.sh_location, item.sh_city].filter(Boolean).join(", "),
    image: item.shopimages?.[0]?.si_image
      ? `https://lunarsenterprises.com:6031/${item.shopimages[0].si_image}`
      : "/shop.png",
    category: item.sh_category_name,
  }));

  // Handle share
  const handleShare = async () => {
    const shareData = {
      title: shop.sh_name || shop.name,
      text: `Check out ${shop.sh_name || shop.name} - ${category}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Format opening hours
  const openingHours =
    shop.sh_opening_hours || shop.opening_hours || "7:00 AM - 9:00 PM";
  const isOpen = shop.sh_status === "active" || shop.isOpen;

  // Handle star rating click
  const handleStarClick = (rating) => {
    setNewReview({ ...newReview, rating });
  };

  return (
    <div className="shop-details-container">
      <div className="shop-details-wrapper">
        {/* ===== Left Sidebar ===== */}
        <div className="shop-sidebar">
          {/* Similar Shops Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Similar Shops Nearby</h3>
            <div className="sidebar-cards-list">
              {similarShops.length > 0 &&
                similarShops.map((item, index) => (
                  <div
                    className="sidebar-shop-card"
                    key={item.id || index}
                    onClick={() => handleSimilarShopClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="sidebar-shop-image"
                    />
                    <div className="sidebar-shop-info">
                      <div className="distance-badge">{item.distance}</div>
                      <h4 className="sidebar-shop-name2">{item.name}</h4>
                      <div className="sidebar-shop-rating2">
                        <svg
                          width="21"
                          height="22"
                          viewBox="0 0 21 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.4996 15.6154L6.86831 17.8029C6.70789 17.905 6.54018 17.9488 6.36518 17.9342C6.19018 17.9196 6.03706 17.8613 5.90581 17.7592C5.77456 17.6571 5.67247 17.5296 5.59956 17.3768C5.52664 17.224 5.51206 17.0525 5.55581 16.8623L6.51831 12.7279L3.30268 9.94981C3.15685 9.81855 3.06585 9.66893 3.02968 9.50093C2.99351 9.33293 3.00431 9.16901 3.06206 9.00918C3.11981 8.84935 3.20731 8.7181 3.32456 8.61543C3.44181 8.51276 3.60222 8.44714 3.80581 8.41856L8.04956 8.04668L9.69018 4.15293C9.7631 3.97793 9.87626 3.84668 10.0297 3.75918C10.1831 3.67168 10.3397 3.62793 10.4996 3.62793C10.6594 3.62793 10.816 3.67168 10.9694 3.75918C11.1228 3.84668 11.236 3.97793 11.3089 4.15293L12.9496 8.04668L17.1933 8.41856C17.3975 8.44772 17.5579 8.51335 17.6746 8.61543C17.7912 8.71751 17.8787 8.84876 17.9371 9.00918C17.9954 9.1696 18.0065 9.33381 17.9703 9.5018C17.9341 9.66981 17.8428 9.81914 17.6964 9.94981L14.4808 12.7279L15.4433 16.8623C15.4871 17.0519 15.4725 17.2234 15.3996 17.3768C15.3266 17.5302 15.2246 17.6577 15.0933 17.7592C14.9621 17.8607 14.8089 17.919 14.6339 17.9342C14.4589 17.9493 14.2912 17.9056 14.1308 17.8029L10.4996 15.6154Z"
                            fill="#E8C930"
                          />
                        </svg>
                        <span>
                          {item.rating} ({item.reviewCount} Reviews)
                        </span>
                      </div>
                      <div className="sidebar-shop-location2">
                        <svg
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.49967 9.60384C8.97477 9.60384 8.47136 9.39532 8.10019 9.02416C7.72903 8.65299 7.52051 8.14958 7.52051 7.62467C7.52051 7.09977 7.72903 6.59636 8.10019 6.22519C8.47136 5.85403 8.97477 5.64551 9.49967 5.64551C10.0246 5.64551 10.528 5.85403 10.8992 6.22519C11.2703 6.59636 11.4788 7.09977 11.4788 7.62467C11.4788 7.88458 11.4276 8.14195 11.3282 8.38207C11.2287 8.62219 11.0829 8.84037 10.8992 9.02416C10.7154 9.20794 10.4972 9.35372 10.2571 9.45319C10.0169 9.55265 9.75958 9.60384 9.49967 9.60384ZM9.49967 2.08301C8.02993 2.08301 6.62039 2.66686 5.58112 3.70612C4.54186 4.74539 3.95801 6.15493 3.95801 7.62467C3.95801 11.7809 9.49967 17.9163 9.49967 17.9163C9.49967 17.9163 15.0413 11.7809 15.0413 7.62467C15.0413 6.15493 14.4575 4.74539 13.4182 3.70612C12.379 2.66686 10.9694 2.08301 9.49967 2.08301Z"
                            fill="#0A5C15"
                          />
                        </svg>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Services Section - UPDATED to use actual services */}
          <div className="sidebar-section">
            <h3 className="sidebar-heading">Services Nearby</h3>
            <div className="sidebar-cards-list">
              {serviceShops.length > 0 &&
                serviceShops.slice(0, 3).map((item, index) => (
                  <div
                    className="sidebar-shop-card"
                    key={item.id || index}
                    onClick={() => handleSimilarServiceClick(item)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="sidebar-shop-image"
                    />
                    <div className="sidebar-shop-info">
                      <div className="distance-badge">{item.distance}</div>
                      <h4 className="sidebar-shop-name2">{item.name}</h4>
                      <div className="sidebar-shop-rating2">
                        <svg
                          width="21"
                          height="22"
                          viewBox="0 0 21 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.4996 15.6154L6.86831 17.8029C6.70789 17.905 6.54018 17.9488 6.36518 17.9342C6.19018 17.9196 6.03706 17.8613 5.90581 17.7592C5.77456 17.6571 5.67247 17.5296 5.59956 17.3768C5.52664 17.224 5.51206 17.0525 5.55581 16.8623L6.51831 12.7279L3.30268 9.94981C3.15685 9.81855 3.06585 9.66893 3.02968 9.50093C2.99351 9.33293 3.00431 9.16901 3.06206 9.00918C3.11981 8.84935 3.20731 8.7181 3.32456 8.61543C3.44181 8.51276 3.60222 8.44714 3.80581 8.41856L8.04956 8.04668L9.69018 4.15293C9.7631 3.97793 9.87626 3.84668 10.0297 3.75918C10.1831 3.67168 10.3397 3.62793 10.4996 3.62793C10.6594 3.62793 10.816 3.67168 10.9694 3.75918C11.1228 3.84668 11.236 3.97793 11.3089 4.15293L12.9496 8.04668L17.1933 8.41856C17.3975 8.44772 17.5579 8.51335 17.6746 8.61543C17.7912 8.71751 17.8787 8.84876 17.9371 9.00918C17.9954 9.1696 18.0065 9.33381 17.9703 9.5018C17.9341 9.66981 17.8428 9.81914 17.6964 9.94981L14.4808 12.7279L15.4433 16.8623C15.4871 17.0519 15.4725 17.2234 15.3996 17.3768C15.3266 17.5302 15.2246 17.6577 15.0933 17.7592C14.9621 17.8607 14.8089 17.919 14.6339 17.9342C14.4589 17.9493 14.2912 17.9056 14.1308 17.8029L10.4996 15.6154Z"
                            fill="#E8C930"
                          />
                        </svg>
                        <span>
                          {item.rating} ({item.reviewCount} Reviews)
                        </span>
                      </div>
                      <div className="sidebar-shop-location2">
                        <svg
                          width="19"
                          height="20"
                          viewBox="0 0 19 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.49967 9.60384C8.97477 9.60384 8.47136 9.39532 8.10019 9.02416C7.72903 8.65299 7.52051 8.14958 7.52051 7.62467C7.52051 7.09977 7.72903 6.59636 8.10019 6.22519C8.47136 5.85403 8.97477 5.64551 9.49967 5.64551C10.0246 5.64551 10.528 5.85403 10.8992 6.22519C11.2703 6.59636 11.4788 7.09977 11.4788 7.62467C11.4788 7.88458 11.4276 8.14195 11.3282 8.38207C11.2287 8.62219 11.0829 8.84037 10.8992 9.02416C10.7154 9.20794 10.4972 9.35372 10.2571 9.45319C10.0169 9.55265 9.75958 9.60384 9.49967 9.60384ZM9.49967 2.08301C8.02993 2.08301 6.62039 2.66686 5.58112 3.70612C4.54186 4.74539 3.95801 6.15493 3.95801 7.62467C3.95801 11.7809 9.49967 17.9163 9.49967 17.9163C9.49967 17.9163 15.0413 11.7809 15.0413 7.62467C15.0413 6.15493 14.4575 4.74539 13.4182 3.70612C12.379 2.66686 10.9694 2.08301 9.49967 2.08301Z"
                            fill="#0A5C15"
                          />
                        </svg>
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* ===== Main Content ===== */}
        <div className="shop-main-content">
          <div className="shop-hero-section2">
            <img
              src={gallery[selectedImage] || shopImage}
              alt={shop.sh_name || shop.name}
              className="shop-hero-image"
            />

            {/* Distance Badge */}
            <div className="image-distance-badge">1.5 km away</div>

            {/* Favorite Button */}
            <button
              className={`favorite-btn ${isFavorite ? "active" : ""}`}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <svg
                width="22"
                height="23"
                viewBox="0 0 22 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.8407 4.16131C15.3822 2.6534 13.2363 3.26115 11.9475 4.22915C11.4195 4.62606 11.1555 4.82498 10.9997 4.82498C10.8438 4.82498 10.5798 4.62606 10.0518 4.22915C8.76299 3.26115 6.61707 2.6534 4.15857 4.16131C0.932824 6.1404 0.203157 12.668 7.64466 18.1771C9.06182 19.2249 9.77041 19.7501 10.9997 19.7501C12.2289 19.7501 12.9375 19.2258 14.3547 18.1762C21.7962 12.6689 21.0665 6.1404 17.8407 4.16131Z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

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
                    <span className="status-text open">Open 7 am to 9 pm</span>
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
                    {shop.sh_review_count || shop.reviewCount || 120} Reviews)
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
                  {phone && (
                    <button
                      className="btn-contact"
                      onClick={() => (window.location.href = `tel:${phone}`)}
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
                  {whatsapp && (
                    <button
                      className="btn-whatsapp"
                      onClick={() =>
                        window.open(
                          `https://wa.me/${String(whatsapp).replace(
                            /[^0-9]/g,
                            ""
                          )}`,
                          "_blank"
                        )
                      }
                    >
                      <FaWhatsapp size={24} />
                      <span>WhatsApp</span>
                    </button>
                  )}
                </div>
                <button onClick={handleShare}>
                  <svg
                    width="60"
                    height="42"
                    viewBox="0 0 60 42"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="0.5"
                      width="59"
                      height="41"
                      rx="9.5"
                      stroke="#0A5C15"
                    />
                    <path
                      d="M41.3245 20.1749L31.9912 10.8416C31.828 10.6785 31.6202 10.5674 31.3939 10.5224C31.1676 10.4774 30.9331 10.5005 30.7199 10.5888C30.5068 10.6771 30.3246 10.8266 30.1964 11.0184C30.0682 11.2102 29.9997 11.4357 29.9997 11.6664V15.8023C26.8127 16.0972 23.8504 17.5708 21.6926 19.9346C19.5349 22.2985 18.3368 25.3825 18.333 28.5831V30.3331C18.3332 30.5753 18.4087 30.8114 18.5492 31.0087C18.6896 31.206 18.8879 31.3547 19.1167 31.4342C19.3454 31.5137 19.5933 31.5201 19.8258 31.4524C20.0583 31.3847 20.264 31.2463 20.4143 31.0564C21.5575 29.6974 22.9599 28.5797 24.5398 27.7687C26.1196 26.9576 27.8452 26.4694 29.6158 26.3326C29.6742 26.3256 29.82 26.3139 29.9997 26.3023V30.3331C29.9997 30.5638 30.0682 30.7893 30.1964 30.9811C30.3246 31.1729 30.5068 31.3224 30.7199 31.4107C30.9331 31.499 31.1676 31.5221 31.3939 31.4771C31.6202 31.4321 31.828 31.321 31.9912 31.1579L41.3245 21.8246C41.5432 21.6058 41.6661 21.3091 41.6661 20.9998C41.6661 20.6904 41.5432 20.3937 41.3245 20.1749ZM32.333 27.5168V25.0831C32.333 24.7737 32.2101 24.4769 31.9913 24.2581C31.7725 24.0393 31.4758 23.9164 31.1663 23.9164C30.8688 23.9164 29.6543 23.9748 29.344 24.0156C26.1996 24.305 23.2065 25.4996 20.727 27.4549C21.0085 24.8818 22.2291 22.5028 24.1553 20.7736C26.0815 19.0444 28.5778 18.0864 31.1663 18.0831C31.4758 18.0831 31.7725 17.9602 31.9913 17.7414C32.2101 17.5226 32.333 17.2258 32.333 16.9164V14.4828L38.85 20.9998L32.333 27.5168Z"
                      fill="#0A5C15"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Image Gallery */}
          {gallery.length > 1 && (
            <div className="image-gallery">
              {gallery.slice(0, 6).map((img, index) => (
                <div
                  key={index}
                  className={`gallery-item ${
                    selectedImage === index ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`Gallery ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Tabs Section */}
          <div className="tabs-container">
            <div
              className="tabs-header"
              style={{ maxWidth: "400px", marginLeft: "20px" }}
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
                      {products.length > 0 &&
                        products.map((item, idx) => <li key={idx}>{item}</li>)}
                    </ul>
                  </div>

                  <div className="info-section">
                    <h3>Opening Hours</h3>
                    <ul className="products-list2">
                      <li>Open Daily: {openingHours}</li>
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
                            disabled={isSubmittingReview}
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
                      disabled={isSubmittingReview}
                    />

                    <button
                      className="post-review-btn"
                      onClick={handleSubmitReview}
                      disabled={isSubmittingReview || !userId}
                    >
                      {isSubmittingReview ? "Posting..." : "Post Review"}
                    </button>

                    {!userId && (
                      <p
                        className="login-notice"
                        style={{
                          color: "#666",
                          fontSize: "14px",
                          marginTop: "10px",
                        }}
                      >
                        Please log in to post a review
                      </p>
                    )}
                  </div>

                  {/* Customer Reviews Section */}
                  <div className="customer-reviews-section">
                    <h3 className="customer-reviews-title">
                      Customer Reviews {isLoadingReviews && "(Loading...)"}
                    </h3>

                    {isLoadingReviews ? (
                      <div className="loading-reviews">Loading reviews...</div>
                    ) : reviews.length === 0 ? (
                      <div className="no-reviews">
                        <p>No reviews yet. Be the first to review this shop!</p>
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
    </div>
  );
};

export default ShopDetailCard;
