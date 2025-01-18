import React, { useState } from 'react';
import axios from 'axios';
import './AddFallen.css';

function AddFallen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [story, setStory] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState(null); // State to handle errors
  const [successMessage, setSuccessMessage] = useState(null); // State to handle success

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate form fields
    if (!name || !location || !date || !story || !image) {
      setError('Please fill in all fields.');
      return;
    }

    // Prepare data to send to the server
    const newFallen = {
      name,
      location,
      date,
      story,
      img: image,
    };

    try {
      // Send a POST request to the backend
      const response = await axios.post('http://localhost:5000/fallens', newFallen, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Clear form fields on success
      setName('');
      setLocation('');
      setDate('');
      setStory('');
      setImage('');
      setSuccessMessage('Fallen added successfully!');
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error adding fallen:', error);
      setError('Failed to add fallen. Please try again.');
    }
  };

  return (
    <div className="add-fallen">
      <h2>Add Fallen</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name :</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location :</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date :</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Story :</label>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image URL :</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddFallen;