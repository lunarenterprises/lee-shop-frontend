import React, { useRef } from 'react'
import LocalBusinessPromo from './LocalBusinessPromo'
import Header from '../Home/Header'
import WhyLeeShop from './WhyLeeShop'
import ChooseRole from './ChooseRole'
import EmpoweringLocal from './EmpoweringLocal'
import Footer from '../Footer'

function Landingpagelayout() {
  // create refs for the scroll-to sections
  const promoRef = useRef(null);
  const whyRef = useRef(null);
  const roleRef = useRef(null);
  const empowerRef = useRef(null);

  // Map nav hrefs to their refs
  const sectionRefs = {
    "/": promoRef,
    "/Why": whyRef,
    "/NearbyService": roleRef,
    // add more as needed
  };

  // Scroll handler
  const handleNavClick = (href) => {
    // if ref exists, scroll to it
    if (sectionRefs[href]?.current) {
      sectionRefs[href].current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      <Header onNavClick={handleNavClick} />
      <div ref={promoRef}><LocalBusinessPromo /></div>
      <div ref={whyRef}><WhyLeeShop /></div>
      <div ref={roleRef}><ChooseRole /></div>
      <div ref={empowerRef}><EmpoweringLocal /></div>
      <Footer />
    </div>
  )
}

export default Landingpagelayout;
