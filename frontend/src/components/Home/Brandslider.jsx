import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const brandImages = [
    '/easyslide/banner1.png',
    '/easyslide/banner2.png',
    '/easyslide/banner3.png',
]

const Brandslider = () => {
  return (
    <div className="mt-15 w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="w-full"
        >
          {brandImages.map((img, index) => (
            <SwiperSlide key={index}>
              <a href="/offers">
                <img
                  src={img}
                  alt={`Branner ${index}`}
                  className="w-full h-[620px] object-cover shadow-lg transition duration-700 ease-in-out"
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="w-full flex justify-around items-center text-sm md:text-base font-medium mt-6">
            <span>BUY WITH TRUST</span>
            <span>GET REWARDED EVERY TIME</span>
            <span>FREE BATTERY REPLACEMENT</span>
            <span>FAST & SECURE DELIVERY</span>
            <span>TRACK YOUR ORDER EASILY</span>
        </div>
    </div>
  )
}

export default Brandslider
