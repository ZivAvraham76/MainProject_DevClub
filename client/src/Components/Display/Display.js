import React from 'react';
import './Display.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';

function Display({ fallens }) {
  return (
    <div className="display">
      {/* Check if there are any fallens */}
      {fallens.length > 0 ? (
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          pagination={{ clickable: true }}
          modules={[Pagination]}
          className="mySwiper"
        >
          {/* Map over the filtered data */}
          {fallens.map((fallen) => (
            <SwiperSlide key={fallen.id || fallen._id}> {/* Use `id` or `_id` */}
              <div className="card">
                <img src={`http://localhost:5000${fallen.img}`} alt={fallen.name} />
                <h3>
                  <Link to={`/fallens/${fallen._id}`}>{fallen.name}</Link> {/* Use `_id` */}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        // Message to display when no results match
        <p className="no-results">No matching results found for your search.</p>
      )}
    </div>
  );
}

export default Display;
