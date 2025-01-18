import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <div id="footer-container">
      <Link to="/add-fallen" className="footer-button">
        Add Fallen
      </Link>
      <Link to="/update-fallen" className="footer-button">
        Edit Fallen
      </Link>
    </div>
  );
}

export default Footer;
