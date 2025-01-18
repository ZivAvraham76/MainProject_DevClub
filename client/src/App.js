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
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
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
  const [filteredFallens, setFilteredFallens] = useState(fallens); 

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
          <Route path="/fallen/:id" element={<FallenDetails />} />
          <Route path="/add-fallen" element={<AddFallen />} />
          <Route path="/update-fallen" element={<UpdateFallen />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
