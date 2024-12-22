import './App.css';
import Navbar from './Components/Navbar/Navbar';
import Search from './Components/Search/Search';
import Footer from './Components/Footer/Footer';
import Display from './Components/Display/Display';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddFallen
 from './Components/Footer/AddFallen/AddFallen';
 import About from './Components/About/About';
 import Contact from './Components/Contact/Contact';
 import FallenDetails from './Components/FallenDetails/FallenDetails';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>

      <Routes>
          <Route path="/" element={<><Search /><Display /> <Footer /></>} />
          <Route path="/home" element={<><Search /><Display /> <Footer /></>} />
          <Route path="/about" element={<About/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/fallen/:id" element={<FallenDetails />} />



          <Route path="/add-fallen" element={<AddFallen />} />
        </Routes>
        
      </div>
    </Router>
  );
}

export default App;
