import React, { useState } from 'react';
import './UpdateFallen.css';
import axios from 'axios';

const UpdateFallen = () => {
  const [id, setId] = useState(''); // ID of the fallen to update
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    story: '',
    img: '',
  });
  const [message, setMessage] = useState(''); // Success or error message

  // Handle changes to form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Reset any previous messages

    if (!id) {
      setMessage('Please provide an ID.');
      return;
    }

    try {
      // Send a PUT request to the server
      const response = await axios.put(`http://localhost:5000/fallens/${id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Fallen updated successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error updating fallen:', error);
      setMessage('Failed to update fallen. Please try again.');
    }
  };

  return (
    <div className="update-fallen">
      <h2>Update Fallen</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID:</label>
          <input
            type="text"
            placeholder="Enter Fallen ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>
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
    </div>
  );
};

export default UpdateFallen;