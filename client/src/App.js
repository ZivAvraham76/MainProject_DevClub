import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Search from './Components/Search/Search';
import Footer from './Components/Footer/Footer';
import Display from './Components/Display/Display';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddFallen from './Components/Footer/AddFallen/AddFallen';
import UpdateFallen from './Components/Footer/UpdateFallen/UpdateFallen';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import FallenDetails from './Components/FallenDetails/FallenDetails';
import Quote from './Components/Quote/Quote';
import axios from 'axios';

function App() {
  const [fallens, setFallens] = useState([]); // State to hold all data from the API
  const [filteredFallens, setFilteredFallens] = useState([]); // State to hold filtered data

  // Fetch data from MongoDB via Flask API
  useEffect(() => {
    axios.get('http://127.0.0.1:5001/fallens') // Replace with your API URL
      .then((response) => {
        setFallens(response.data); // Update state with fetched data
        setFilteredFallens(response.data); // Set filtered data to show all fallens by default
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Search fallens={fallens} setFilteredFallens={setFilteredFallens} />
                <Display fallens={filteredFallens} />
                <Quote />
                <Footer />
              </>
            }
          />
          <Route
            path="/home"
            element={
              <>
                <Search fallens={fallens} setFilteredFallens={setFilteredFallens} />
                <Display fallens={filteredFallens} />
                <Quote />
                <Footer />
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/fallens/:id" element={<FallenDetails />} />
          <Route path="/add-fallen" element={<AddFallen />} />
          <Route path="/update-fallen/:id" element={<UpdateFallen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
