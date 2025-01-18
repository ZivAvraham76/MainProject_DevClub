import React, { useEffect, useState } from 'react';
import './UpdateFallen.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UpdateFallen = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    story: '',
    img: '',
  });
  const [message, setMessage] = useState(''); // Success or error message
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isUpdated, setIsUpdated] = useState(false); // State to track if form is submitted

  useEffect(() => {
    const fetchFallenData = async () => {
      try {
        // Fetch data directly from the backend using the ID from the URL
        const response = await axios.get(`http://127.0.0.1:5000/fallens/${id}`);
        setFormData(response.data); // Populate form with data
        setMessage(''); // Clear any previous messages
      } catch (error) {
        console.error('Failed to fetch fallen data:', error);
        setMessage('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFallenData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset any previous messages

    try {
      // Exclude _id from the data before sending the request
      const updatedData = { ...formData };
      delete updatedData._id;

      // Send a PUT request to update the fallen
      await axios.put(`http://127.0.0.1:5000/fallens/${id}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Fallen updated successfully!');
      setIsUpdated(true); // Mark the form as submitted successfully
    } catch (error) {
      console.error('Failed to update fallen:', error);
      setMessage('Failed to update fallen. Please try again.');
    }
  };

  if (isLoading) return <p>Loading data...</p>;

  return (
    <div className="update-fallen">
      {message && <p className="message">{message}</p>}
      {!isUpdated && (
        <form onSubmit={handleSubmit}>
          <h2>Update Fallen</h2>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Location:</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              placeholder="Date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Story:</label>
            <textarea
              name="story"
              placeholder="Story"
              value={formData.story}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label>Image URL:</label>
            <input
              type="text"
              name="img"
              placeholder="Image URL"
              value={formData.img}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Update Fallen</button>
        </form>
      )}
    </div>
  );
};

export default UpdateFallen;
