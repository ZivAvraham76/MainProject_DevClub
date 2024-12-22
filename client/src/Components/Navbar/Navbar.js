import React from 'react'
import './Navbar.css'
import { FaPhoneSquareAlt } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Navbar = () => {
  
  return (
    <nav>
      <Link to="/home" className="nav-button">
        Home
      </Link>
      <Link to="/about" className="nav-button">
        About
      </Link>
      <Link to="/contact" className="nav-button">
        Contact <FaPhoneSquareAlt/>
      </Link>
    </nav>
  )
}

export default Navbar