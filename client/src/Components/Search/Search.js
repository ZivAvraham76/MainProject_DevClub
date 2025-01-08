import React, { useState } from "react";
import './Search.css';

const Search = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    location: "",
    unit: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(filters); 
  };

  return (
    <form className="search-container" onSubmit={handleSearch}>
      <input
        type="text"
        name="name"
        placeholder="Search by Name"
        value={filters.name}
        onChange={handleChange}
        className="search-input"
      />
      <input
        type="date"
        name="date"
        placeholder="Search by Date"
        value={filters.date}
        onChange={handleChange}
        className="search-input"
      />
      <input
        type="text"
        name="location"
        placeholder="Search by Location"
        value={filters.location}
        onChange={handleChange}
        className="search-input"
      />
      <input
        type="text"
        name="unit"
        placeholder="Search by Unit"
        value={filters.unit}
        onChange={handleChange}
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
};

export default Search;
