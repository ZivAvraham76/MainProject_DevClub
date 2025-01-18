import React, { useState } from 'react';
import axios from 'axios';
import './AddFallen.css';

function AddFallen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [story, setStory] = useState('');
  const [file, setFile] = useState(null); // Handle file uploads
  const [error, setError] = useState(null); // State to handle errors
  const [successMessage, setSuccessMessage] = useState(null); // State to handle success
  const [isFormVisible, setIsFormVisible] = useState(true); // State to toggle form visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate form fields
    if (!name || !location || !date || !story || !file) {
      setError('Please fill in all fields and upload an image.');
      return;
    }

    try {
      // Prepare FormData to send file and other data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('location', location);
      formData.append('date', date);
      formData.append('story', story);
      formData.append('file', file); // Append the file

      // Send a POST request to the backend
      const response = await axios.post('http://localhost:5000/fallens', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Clear form fields and hide the form on success
      setName('');
      setLocation('');
      setDate('');
      setStory('');
      setFile(null);
      setSuccessMessage('Fallen added successfully!');
      setIsFormVisible(false); // Hide the form
      console.log('Server response:', response.data);
    } catch (error) {
      console.error('Error adding fallen:', error);
      setError('Failed to add fallen. Please try again.');
    }
  };

  return (
    <div className="add-fallen">
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {/* Conditionally render the form */}
      {isFormVisible && (
        <form onSubmit={handleSubmit}>
          <h2>Add Fallen</h2>
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
            <label>Image :</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])} // Handle file selection
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
}

export default AddFallen;
