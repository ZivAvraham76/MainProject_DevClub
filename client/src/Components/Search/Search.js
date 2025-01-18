import './Search.css';
import React, { useState } from 'react';

const Search = ({ fallens, setFilteredFallens }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const filtered = fallens.filter(fallen =>
      (fallen.name && fallen.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fallen.location && fallen.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (fallen.unit && fallen.unit.toLowerCase().includes(searchQuery.toLowerCase()))
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
      <button className="search-button" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default Search;
