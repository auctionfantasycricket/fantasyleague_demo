import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Snakedraft.css';
import { json } from 'react-router-dom';

const baseURL = process.env.REACT_APP_BASE_URL;

const SnakeDraft = () => {


    const sampleplayer = {
        "_id":{"$oid":"63b90a44f4902c26b5359388"},
        "player_name": "Player Name",
        "status": "unsold",
        "player_role": "Type",
        "country": "Country Name",
      }

  const initialPlayers = ['Virat Kohli, Batter, India', 'Maxwell', 'Dhoni', 'Kohli', 'Axar', 'Rana', 'Thala', '7', 'Bhuvi', 'Harshal'];
  const teams = ['Lions Of Mirzapur', 'Lazy Lions', 'The BAAPs', 'Gajjab Gujjus', 'No Mercy Any More', 'Nani'];
  const rounds = 11;
  const [players, setPlayers] = useState(initialPlayers);
  const [playertodraft, setDraftplayer] = useState(sampleplayer)
  const [rowData, setRowData] = useState([]);
  const [currentCellIndex, setCurrentCellIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [intervalId, setIntervalId] = useState(null);
  const [searchResult, setSearchResult] = useState('');

  useEffect(() => {
    initializeDraftBoard();
    fetchDraftBoard();
    //startTimer();
    return () => clearInterval(intervalId);
  }, []);

  const fetchDraftBoard = async () => {
    try {
      const response = await fetch(baseURL+'/get_data?collectionName=eflDraft_ownerTeams');
      if(response.ok){
        const draftBoard = await response.json();
        //console.log("sha",draftBoard.draftsequence)
        //create team to draft sequence map

        const draftData = formatDraftBoard(draftBoard);
        setRowData(draftData);
      }else {
        console.log('Error: ' + response.status + response.body);
      }
    } catch (error) {
      console.error('Error fetching draft board:', error);
    }
  };

  const formatDraftBoard = (draftBoard) => {
    let draftData = [];
    console.log("lbc",draftBoard)
    for (let round = 0; round < rounds; round++) {
      let row = { round: `Round ${round + 1}` };
      teams.forEach((team, index) => {
        row[`team${index}`] = draftBoard[team] ? draftBoard[team].draftsequence[index] || '' : '';
        console.log("kbc",draftBoard[team])
      });
      console.log("rbc",row)
      draftData.push(row);
    }
    return draftData;
  };

  const initializeDraftBoard = () => {
    let draftData = [];
    for (let round = 0; round < rounds; round++) {
      let row = { round: `Round ${round + 1}` };
      teams.forEach((team, index) => {
        row[`team${index}`] = '';
      });
      draftData.push(row);
    }
    setRowData(draftData);
  };

  const saveDraftPlayer = (playerobject, team) => {
    const payload = { ownerTeam: team , status: "sold"}

    console.log("pl",payload)
    fetch(baseURL+'/draftplayer/'+playerobject._id.$oid, {
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

  const getNextCell = () => {
    const row = Math.floor(currentCellIndex / teams.length);
    const col = currentCellIndex % teams.length;
    return { row, col };
  };

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          autoPick();
          return 60;
        }
        return prevTimer - 1;
      });
    }, 1000);
    setIntervalId(id);
  };

  const autoPick = () => {
    draftPlayer(players[0]);
  };

  const searchPlayer = async () => {
    const searchQuery = document.getElementById('searchBox').value.toLowerCase();
    try{
        const response = await fetch(baseURL+'/getspecificplayer?playerName='+searchQuery);
        if(response.ok)
        {
          const json = await response.json();
          setSearchResult(json.player_name || 'Player not found');
          setDraftplayer(json)
       } else {
         console.log('Error: ' + response.status + response.body);
       }
        
        }catch (error) {
          console.error(error);
        }
    //const player = players.find(p => p.toLowerCase().includes(searchQuery));
    //console.log("abc",playertodraft)
  };

  const draftPlayer = async (player = searchResult) => {

    if (!player || player === 'Player not found') return;

    clearInterval(intervalId);
    setPlayers(players.filter(p => p !== player));

    const { row, col } = getNextCell();
    const team = teams[col];
    console.log("ghj",playertodraft, team)
    await saveDraftPlayer(playertodraft, team);

    setCurrentCellIndex(currentCellIndex + 1);
    setSearchResult('');
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
          <button onClick={() => draftPlayer()}>Draft</button>
        </div>
        <div className="card" id="card">{searchResult}</div>
        <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
          <AgGridReact columnDefs={columnDefs} rowData={rowData} />
        </div>
      </div>
    </div>
  );
};

export default SnakeDraft;
