import React, { useEffect, useState } from "react";
import './Quote.css'


const Quote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/quote");
        const data = await response.json();
        setQuote(data.quote);
      } catch (error) {
        console.error("Error fetching quote:", error);
      }
    };
    fetchQuote();
  }, []);

  return (
    <div className="quete-container">
      <h2>Motivational Quote</h2>
      <p className="quote-text">"{quote}"</p>
    </div>
  );
};

export default Quote;
