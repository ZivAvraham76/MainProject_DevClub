import React, { useState } from 'react';
import './AddFallen.css'

function AddFallen() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [story, setStory] = useState('');




  return (
    <div className="add-fallen">
      <h2>Add Fallen</h2>
      <form>
        <div>
          <label>Name :</label>
          <input
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location :</label>
          <input
            type="text"
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Date :</label>
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Story :</label>
          <textarea
            onChange={(e) => setStory(e.target.value)}
            required
          />
          
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddFallen;
