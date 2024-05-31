import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Snakedraft.css';

const baseURL = process.env.REACT_APP_BASE_URL;

const teams = ['Lions Of Mirzapur', 'Lazy Lions', 'The BAAPs', 'Gajjab Gujjus', 'No Mercy Any More', 'Nani'];
const rounds = 11;

const SnakeDraft = () => {
  const [rowData, setRowData] = useState([]);
  const [timer, setTimer] = useState(45);
  const [intervalId, setIntervalId] = useState(null);
  const [searchResult, setSearchResult] = useState('');
  const [selectedCell, setSelectedCell] = useState(null);
  const [playertodraft, setDraftplayer] = useState(null);
  const gridRef = useRef();

  useEffect(() => {
    fetchDraftBoard();
    return () => clearInterval(intervalId);
  }, []);

  const fetchDraftBoard = async () => {
    try {
      const response = await fetch(`${baseURL}/get_data?collectionName=eflDraft_ownerTeams`);
      if (response.ok) {
        const draftBoard = await response.json();
        const draftData = formatDraftBoard(draftBoard);
        setRowData(draftData);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching draft board:', error);
    }
  };

  const formatDraftBoard = (draftBoard) => {
    let draftData = [];
    for (let round = 0; round < rounds; round++) {
      let row = { round: `Round ${round + 1}` };
      teams.forEach((team, index) => {
        const teamData = draftBoard.find(t => t.teamName === team);
        row[`team${index}`] = teamData ? teamData.draftSequence[round] || '' : '';
      });
      draftData.push(row);
    }
    return draftData;
  };

  const startTimer = () => {
    if (intervalId) clearInterval(intervalId);

    setTimer(45);
    const id = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          autoPick();
          clearInterval(id);
          return 45;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) clearInterval(intervalId);
  };

  const autoPick = () => {
    // Implement auto pick logic here
  };

  const searchPlayer = async () => {
    stopTimer();
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();
    try {
      const response = await fetch(`${baseURL}/getspecificplayer?playerName=${searchQuery}`);
      if (response.ok) {
        const json = await response.json();
        setSearchResult(json.player_name || 'Player not found');
        setDraftplayer(json);
      } else {
        console.log('Error:', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveDraftPlayer = (playerobject, team) => {
    const payload = { ownerTeam: team, status: "sold" };

    return fetch(`${baseURL}/draftplayer/${playerobject._id.$oid}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const draftPlayer = async () => {
    if (!playertodraft || !selectedCell) {
      console.log("No player or cell selected");
      return;
    }

    const colId = selectedCell.column.colId;
    const teamIndex = parseInt(colId.replace('team', ''));
    const team = teams[teamIndex];
    
    await saveDraftPlayer(playertodraft, team);
    await fetchDraftBoard();

    setSearchResult('');
    startTimer();
  };

  const onCellClicked = (params) => {
    const { rowIndex, column } = params;
    setSelectedCell({ rowIndex, column });
    startTimer();
  };

  const columnDefs = [
    { headerName: '', field: 'round', width: 100 },
    ...teams.map((team, index) => ({ headerName: team, field: `team${index}`, width: 150 }))
  ];

  return (
    <div className='snakepage'>
      <div className="snakecontainer">
        <h1>Snake Draft</h1>
        <div className="timer" id="timer">{timer}</div>
        <div className="controls">
          <input type="text" id="searchBox" placeholder="Search for a player" />
          <button onClick={searchPlayer}>Search</button>
          <button onClick={draftPlayer}>Draft</button>
        </div>
        <div className="card" id="card">{searchResult}</div>
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact
            ref={gridRef}
            columnDefs={columnDefs}
            rowData={rowData}
            onCellClicked={onCellClicked}
          />
        </div>
      </div>
    </div>
  );
};

export default SnakeDraft;
