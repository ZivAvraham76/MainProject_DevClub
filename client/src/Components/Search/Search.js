import React, { useState } from "react";
import TempFallen from "../TempFallen"; 
import './Search.css'


const Search = ({ setFilteredFallens }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const filtered = TempFallen.filter(fallen =>
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
