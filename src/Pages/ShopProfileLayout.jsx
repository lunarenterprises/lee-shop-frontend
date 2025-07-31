import React from 'react'
import Header from "./Home/Header"
import Footer from "./Footer"
import LocationSearchBar from './LocationSearchBar'
import ListingCard from './Home/ListingCard'
function ShopProfileLayout() {
  return (
    <div>
      <Header />
      <LocationSearchBar />
      <ListingCard />
      <Footer />
    </div>
  )
}

export default ShopProfileLayout
