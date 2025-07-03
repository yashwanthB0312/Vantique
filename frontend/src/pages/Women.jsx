import React from 'react'
import Banner from '../components/Layouts/Banner'
import Watchgallery from '../components/Layouts/Watchgallery'

const Women = () => {
  return (
    <div>
      <Banner image='/Banners/women_watches.jpg'/>
      <Watchgallery initialFilter={{ gender: 'Women' }} />;
    </div>
  )
}

export default Women
