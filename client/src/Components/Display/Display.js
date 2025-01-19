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
                {/* Use the `img` field directly if it contains a valid URL */}
                {fallen.img ? (
                  <img
                    src={fallen.img} // Use the Cloudinary URL or any valid URL in the `img` field
                    alt={fallen.name}
                    style={{
                      width: '100%',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#ccc',
                      borderRadius: '10px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '14px',
                    }}
                  >
                    No Image Available
                  </div>
                )}
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