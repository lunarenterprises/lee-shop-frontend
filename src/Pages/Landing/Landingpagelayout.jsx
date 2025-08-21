import React, { useRef, useState, useEffect } from "react";
import LocalBusinessPromo from "./LocalBusinessPromo";
import Header from "../Home/Header";
import WhyLeeShop from "./WhyLeeShop";
import ChooseRole from "./ChooseRole";
import EmpoweringLocal from "./EmpoweringLocal";
import Footer from "../Footer";
import LoginModal from "../Home/LoginModal";
import ConfirmIdentityModal from "../Home/ConfirmIdentityModal";
import EmailVerificationModal from "../Home/EmailVerificationModal";
import ResetPasswordModal from "../Home/ResetPasswordModal";
import SuccessModal from "../Home/SuccessModal";
import SignUpModal from "../Home/SignUpModal";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/Why", label: "Why LeeShop" },
  { href: "/ourGoal", label: "Our Goal" },
];

function Landingpagelayout() {
  // create refs for each section
  const promoRef = useRef(null);
  const whyRef = useRef(null);
  const roleRef = useRef(null);
  const empowerRef = useRef(null);

  // Active tab state
  const [activeKey, setActiveKey] = useState("/");
  const [showLogin, setShowLogin] = useState(false);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Map nav hrefs to their refs
  const sectionRefs = {
    "/": promoRef,
    "/Why": whyRef,
    "/ourGoal": empowerRef,
  };

  // Handle nav click: scroll & set as active
  const handleNavClick = (href) => {
    setActiveKey(href);
    if (sectionRefs[href]?.current) {
      sectionRefs[href].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoginSuccess = (user) => {
    localStorage.setItem("userData", JSON.stringify(user));
    setUserData(user);
    navigate(
      user.role?.toLowerCase() === "shop"
        ? "/ShopProfile"
        : user.role?.toLowerCase() === "deliverystaff"
        ? "/DeliveryProfile"
        : "/UserProfile"
    );
    setShowLogin(false);
  };

  // Intersection Observer for active on scroll ("scroll spy")
  useEffect(() => {
    const sectionKeys = Object.keys(sectionRefs);
    const nodes = sectionKeys
      .map((key) => sectionRefs[key].current)
      .filter(Boolean);

    if (!nodes.length) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        // At least 0.3 in view to be active
        const visible = entries
          .filter(
            (entry) => entry.isIntersecting && entry.intersectionRatio > 0.3
          )
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = nodes.indexOf(visible[0].target);
          setActiveKey(sectionKeys[idx]);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px", // triggers a bit before section enters
        threshold: [0.2, 0.45, 0.8],
      }
    );
    nodes.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [promoRef, whyRef, roleRef, empowerRef]);

  return (
    <div>
      <Header
        navItems={navItems}
        activeKey={activeKey}
        onNavClick={handleNavClick}
      />
      <div ref={promoRef}>
        <LocalBusinessPromo onLoginClick={() => setShowLogin(true)} />
      </div>
      <div ref={whyRef}>
        <WhyLeeShop />
      </div>
      <div ref={roleRef}>
        <ChooseRole />
      </div>
      <div ref={empowerRef}>
        <EmpoweringLocal />
      </div>

      {/* ---------- MODALS ---------- */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          onSignUp={() => {
            setShowLogin(false);
            setShowSignUp(true);
          }}
          onForgotPassword={() => {
            setShowLogin(false);
            setShowIdentity(true);
          }}
        />
      )}
      {showIdentity && (
        <ConfirmIdentityModal
          onClose={() => setShowIdentity(false)}
          onConfirmEmail={(e) => {
            setUserEmail(e);
            setShowIdentity(false);
            setShowEmail(true);
          }}
        />
      )}
      {showEmail && (
        <EmailVerificationModal
          email={userEmail}
          onClose={() => setShowEmail(false)}
          onVerify={() => {
            setShowEmail(false);
            setShowReset(true);
          }}
        />
      )}
      {showReset && (
        <ResetPasswordModal
          email={userEmail}
          onClose={() => setShowReset(false)}
          onSuccess={() => {
            setShowReset(false);
            setShowSuccess(true);
          }}
        />
      )}
      {showSuccess && <SuccessModal onClose={() => setShowSuccess(false)} />}

      {/* ---------- Sign-up modal ---------- */}
      {showSignUp && (
        <SignUpModal
          onClose={() => setShowSignUp(false)}
          /* If you want to redirect after successful signup,
           add onSuccess={() => navigate('/UserProfile')} inside the modal */
        />
      )}

      <Footer />
    </div>
  );
}

export default Landingpagelayout;
