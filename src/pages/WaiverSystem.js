import React, { useState } from 'react';
import './WaiverSystem.css';

export const WaiverSystem = () => {
  const initialTeams = ['Team E', 'Team D', 'Team C', 'Team B', 'Team A'];
  const [waiverRequests, setWaiverRequests] = useState(
    Array(5).fill(0).map(() => Array(4).fill(''))
  );
  const [results, setResults] = useState([]);
  const [logs, setLogs] = useState([]);

  const handleInputChange = (teamIndex, prefIndex, value) => {
    const newRequests = waiverRequests.map((teamRequests, tIdx) =>
      tIdx === teamIndex
        ? teamRequests.map((request, pIdx) =>
            pIdx === prefIndex ? value : request
          )
        : teamRequests
    );
    setWaiverRequests(newRequests);
  };

  const processWaivers = () => {
    const teams = initialTeams.slice();
    const replacementsCount = Array(teams.length).fill(0);
    const pickedPlayers = new Set();
    const results = Array(teams.length).fill().map(() => Array(4).fill(''));
    const logs = [];

    const priorityOrders = [
      ['E', 'D', 'C', 'B', 'A'], // Round 1
      ['D', 'C', 'B', 'A', 'E'], // Round 2
      ['C', 'B', 'A', 'E', 'D'], // Round 3
      ['B', 'A', 'E', 'D', 'C']  // Round 4
    ];

    // Map initialTeams to index for easier lookup
    const teamIndexMap = {
      'Team E': 0,
      'Team D': 1,
      'Team C': 2,
      'Team B': 3,
      'Team A': 4,
    };

    for (let round = 0; round < 4; round++) {
      const priorityOrder = priorityOrders[round];
      const roundLog = [`Round ${round + 1} : sequence ${priorityOrder.join('')}`];

      for (let priorityIdx = 0; priorityIdx < priorityOrder.length; priorityIdx++) {
        const currentPriorityTeam = `Team ${priorityOrder[priorityIdx]}`;
        const teamIndex = teamIndexMap[currentPriorityTeam];
        const playerToPick = waiverRequests[teamIndex][round]; // Use `round` as index to check 1st, 2nd, 3rd, 4th preferences in respective rounds
        if (playerToPick && !pickedPlayers.has(playerToPick) && replacementsCount[teamIndex] < 2) {
          pickedPlayers.add(playerToPick);
          results[teamIndex][round] = `Picked: ${playerToPick}`;
          replacementsCount[teamIndex]++;
          roundLog.push(`${currentPriorityTeam} - picked ${playerToPick}`);
        } else {
          if (!playerToPick) {
            results[teamIndex][round] = `Failed to pick: No player specified`;
            roundLog.push(`${currentPriorityTeam} - no pick (no player specified)`);
          } else if (pickedPlayers.has(playerToPick)) {
            results[teamIndex][round] = `Fail: ${playerToPick} taken`;
            roundLog.push(`${currentPriorityTeam} - no pick (already picked)`);
          } else {
            results[teamIndex][round] = `Fail: 2 pick limit reached`;
            roundLog.push(`${currentPriorityTeam} - no pick (2 pick limit reached)`);
          }
        }
      }

      const roundEndLog = priorityOrder.map(team => {
        const teamIndex = teamIndexMap[`Team ${team}`];
        const pickedPlayers = results[teamIndex].filter(result => result.startsWith('Picked')).map(result => result.split(': ')[1]);
        return `${team} - ${pickedPlayers.length > 0 ? pickedPlayers.join(', ') : '{}'}`;
      }).join(', ');

      roundLog.push(`At the end of round ${round + 1} : ${roundEndLog}`);
      logs.push(roundLog.join('\n'));
    }

    setResults(results);
    setLogs(logs);
  };

  return (
    <div className="waiver-system">
      <div className="teams-container">
        {initialTeams.map((team, teamIndex) => (
          <div key={team} className="team-section">
            <h2>{team}</h2>
            {Array(4).fill().map((_, prefIndex) => (
              <div key={prefIndex} className="preference-section">
                <input
                  type="text"
                  placeholder="Pick"
                  value={waiverRequests[teamIndex][prefIndex]}
                  onChange={(e) => handleInputChange(teamIndex, prefIndex, e.target.value)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={processWaivers}>Calculate</button>
      <div className="results-section">
        {results.map((teamResults, teamIndex) => (
          <div key={teamIndex} className="team-results">
            <h3>{initialTeams[teamIndex]}</h3>
            {teamResults.map((result, prefIndex) => (
              <p key={prefIndex}>Pref {prefIndex + 1}: {result}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="logs-section">
        {logs.map((log, index) => (
          <pre key={index}>{log}</pre>
        ))}
      </div>
    </div>
  );
};
