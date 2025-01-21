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
    unit: ' ',
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
        const response = await axios.get(`http://127.0.0.1:5001/fallens/${id}`);
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
      const formDataToSend = new FormData();
  
      // Append all form data fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('unit', formData.unit);
      formDataToSend.append('story', formData.story);
  
      // Append the file (if provided)
      if (formData.photo && formData.photo instanceof File) {
        formDataToSend.append('file', formData.photo);
      }
  
      // Send the form data directly to the backend
      const response = await fetch(`http://127.0.0.1:5001/fallens/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
  
      if (response.ok) {
        setMessage('Fallen updated successfully!');
        setIsUpdated(true);
      } else {
        setMessage('Failed to update fallen. Please try again.');
      }
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
            <label>Unit:</label>
            <input
              type="unit"
              name="unit"
              placeholder="Unit"
              value={formData.unit}
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
            <label>Photo:</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })}
              />
          </div>
          <button type="submit">Update Fallen</button>
        </form>
      )}
    </div>
  );
};

export default UpdateFallen;