import React from 'react'
import Banner from '../components/Layouts/Banner'
import Watchgallery from '../components/Layouts/Watchgallery'

const Men = () => {
  return (
    <div>
      <Banner image='/Banners/men_watches.jpg'/>
      <Watchgallery initialFilter={{ gender: 'Men' }} />;
    </div>
  )
}

export default Men
