import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './FallenDetails.css'
import { GiCandleFlame } from "react-icons/gi";
import { Link } from 'react-router-dom';

const FallenDetails = () => {
  const { id } = useParams(); // Get the fallen ID from the URL
  const [fallen, setFallen] = useState(null); // Store the fetched fallen details
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isLit, setIsLit] = useState(false); // Candle lit state

  useEffect(() => {
    // Fetch the fallen details by ID from the backend
    const fetchFallen = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/fallens/${id}`);
        setFallen(response.data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch fallen details.');
        setIsLoading(false);
      }
    };

    fetchFallen();
  }, [id]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!fallen) return <p>No fallen found with the provided ID.</p>;

  return (
    <div className='fallen-page'>
      <div className="candle-container" onClick={() => setIsLit(true)}>
        <GiCandleFlame className={`candle-icon ${isLit ? "lit" : ""}`} />
        <p>Click the candle to light it in his memory</p>
      </div>

      <div className='fallen-details'>
        <h1>{fallen.name}</h1>
        <p><strong>Location:</strong> {fallen.location}</p>
        <p><strong>Date:</strong> {fallen.date}</p>
        <p><strong>Story:</strong> {fallen.story}</p>
        <img src={fallen.img} alt={fallen.name} />
        <Link to= {`/update-fallen/${fallen._id}`} className="edit-button">
        Edit Fallen
      </Link>

      </div>
    </div>
  );
};

export default FallenDetails;
