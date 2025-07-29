import React from 'react'
import LocalBusinessPromo from './LocalBusinessPromo'
import Header from '../Home/Header'
import WhyLeeShop from './WhyLeeShop'
import ChooseRole from './ChooseRole'
import EmpoweringLocal from './EmpoweringLocal'
import Footer from '../Footer'

function Landingpagelayout() {
  return (
    <div>
        <Header />
      <LocalBusinessPromo />
      <WhyLeeShop/>
      <ChooseRole/>
      <EmpoweringLocal />
     <Footer/>
    </div>
  )
}

export default Landingpagelayout
