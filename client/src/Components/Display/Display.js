import React from 'react';
import './Display.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import tempfallen from '../TempFallen'
import { Link } from 'react-router-dom';



function Display() {

  return (
    <div className="display">
      <Swiper
        slidesPerView={8}
        spaceBetween={10}
        pagination={{ clickable: true }}

        modules={[Pagination]}
        className="mySwiper"
        >
      {tempfallen.map((fallen) => (
          <SwiperSlide key={fallen.id}>
            <div className="card">
              <img src={fallen.img} alt={fallen.name} />
              <h3>
                <Link to={`/fallen/${fallen.id}`}>{fallen.name}</Link>
              </h3>
        </div>
        </SwiperSlide>
      ))}
      </Swiper>
    </div>
  );
}

export default Display;
