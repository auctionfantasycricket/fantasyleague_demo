import React from 'react';
import './PlayerCard.css'

 const PlayerCard = ({playerName, country,intro1,intro2,intro3, type, franchise}) => {
  return (
    <div className="player-card">
      <h1 className="player-name" style={{fontSize: '32px'}}>{playerName} ({franchise})</h1>
      <h2 className="player-country" style={{fontSize: '24px'}}>{type} from {country}</h2>
    </div>
  );
}

export default PlayerCard;