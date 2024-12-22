import React from 'react';
import { useParams } from 'react-router-dom';
import fallens from '../TempFallen'; 
import './FallenDetalis.css'
import { GiCandleFlame } from "react-icons/gi";
import { useState } from 'react';

const FallenDetails = () => {

    const [isLit, setIsLit] = useState(false); // מצב של הנר (דלוק או כבוי)

 
  const { id } = useParams(); 
  const fallen = fallens.find((f) => f.id === parseInt(id));

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
    </div>
    
    
        </div>
  );
};

export default FallenDetails;
