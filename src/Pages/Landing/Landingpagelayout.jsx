import React, { useRef, useState, useEffect } from 'react';
import LocalBusinessPromo from './LocalBusinessPromo'
import Header from '../Home/Header'
import WhyLeeShop from './WhyLeeShop'
import ChooseRole from './ChooseRole'
import EmpoweringLocal from './EmpoweringLocal'
import Footer from '../Footer'

const navItems = [
  { href: "/", label: "Home" },
  { href: "/Why", label: "Why Lee Shop" },
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

  // Intersection Observer for active on scroll ("scroll spy")
  useEffect(() => {
    const sectionKeys = Object.keys(sectionRefs);
    const nodes = sectionKeys.map((key) => sectionRefs[key].current).filter(Boolean);

    if (!nodes.length) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        // At least 0.3 in view to be active
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.3)
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
      <Header navItems={navItems} activeKey={activeKey} onNavClick={handleNavClick} />
      <div ref={promoRef}><LocalBusinessPromo /></div>
      <div ref={whyRef}><WhyLeeShop /></div>
      <div ref={roleRef}><ChooseRole /></div>
      <div ref={empowerRef}><EmpoweringLocal /></div>
      <Footer />
    </div>
  );
}

export default Landingpagelayout;
