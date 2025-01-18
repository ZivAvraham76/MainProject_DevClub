import React, { useEffect, useState } from 'react';
import './Display.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Display() {
  const [fallens, setFallens] = useState([]); // State to hold data from the API

  // Fetch data from MongoDB via Flask API
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/fallens') // Replace with your API URL
      .then((response) => {
        setFallens(response.data); // Update state with fetched data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="display">
      <Swiper
        slidesPerView={8}
        spaceBetween={10}
        pagination={{ clickable: true }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {/* Map over the fetched data */}
        {fallens.map((fallen) => (
          <SwiperSlide key={fallen.id || fallen._id}> {/* Use `id` or `_id` */}
            <div className="card">
              <img src={fallen.img} alt={fallen.name} />
              <h3>
                <Link to={`/fallen/${fallen.id || fallen._id}`}>{fallen.name}</Link> {/* Use `id` or `_id` */}
              </h3>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Display;
