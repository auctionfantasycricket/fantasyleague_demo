import React, { useState } from 'react';
import './WaiverSystem.css';

export const WaiverSystem = () => {
  const [preferences, setPreferences] = useState(['', '', '', '']);
  const [drops, setDrops] = useState(['', '']);

  const handlePreferenceChange = (index, value) => {
    const newPreferences = [...preferences];
    newPreferences[index] = value;
    setPreferences(newPreferences);
  };

  const handleDropChange = (index, value) => {
    const newDrops = [...drops];
    newDrops[index] = value;
    setDrops(newDrops);
  };

  const handleSubmit = () => {
    alert('The selection will be locked on Tuesday at 11:59 pm');
  };

  return (
    <div className="waiver-system">
      <h1>Waiver System</h1>
      <div className="preference-section">
        <h2>Preferences</h2>
        {preferences.map((preference, index) => (
          <div key={index} className="preference-input">
            <label>Preference {index + 1}</label>
            <input
              type="text"
              value={preference}
              onChange={(e) => handlePreferenceChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="drop-section">
        <h2>Drops</h2>
        <div className="drop-input-container">
          {drops.map((drop, index) => (
            <div key={index} className="drop-input">
              <label>Drop {index + 1}</label>
              <select
                value={drop}
                onChange={(e) => handleDropChange(index, e.target.value)}
              >
                <option value="">Select Player</option>
                <option value="Player 1">Player 1</option>
                <option value="Player 2">Player 2</option>
                <option value="Player 3">Player 3</option>
                <option value="Player 4">Player 4</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
