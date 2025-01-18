import './Search.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Search = ({ setFilteredFallens }) => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = () => {
    const filtered = fallens.filter(fallen =>
      fallen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fallen.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fallen.unit.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFallens(filtered); 
  };


  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by Name/Location/Date/Unit"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className="search-button" onClick={handleSearch}>Serach</button>
    </div>
  );
};

export default Search;
