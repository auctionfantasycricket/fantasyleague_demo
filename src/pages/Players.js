import React, { useState, useEffect, useMemo, useRef,useCallback} from "react";
import './Players.css'
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useQuery } from '@tanstack/react-query';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const baseURL = process.env.REACT_APP_BASE_URL;

const fetchPlayerslist = async () => {
    const response = await fetch(baseURL+'/get_data?collectionName=efl_playersCentral_test');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  };


export const AllPlayers = () => {
  const [Allplayers, setAllPlayerslist] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);

  const gridRef = useRef();


  const { isLoading, error, data } = useQuery({queryKey:['players'], queryFn:fetchPlayerslist});

  useEffect(() => {
    if (data) {
      setAllPlayerslist(data);
    }
  }, [data]); 

  const onBtnExport = useCallback(() => {
    gridRef.current.api.exportDataAsCsv();
  }, [gridRef]);

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'250px' }}>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;



  //setAllPlayerslist(data)

  //console.log(Allplayers)

  const defaultColDef = {
    sortable: true,
    resizable: true,
    //filter: true,
  };

  const columnDefs = [
    { field: "player_name", headerName: "Name", width: 150, filter: true},
    { field: "ipl_team_name", headerName: "IPL Team", width: 200, filter: true },
    { field: "status", headerName: "Status", width: 150,filter: true },
    { field: "player_role", headerName: "Role", width: 120, filter: true },
   { field: "country", headerName: "Country", width: 120,filter: true },
   { field: "tier", headerName: "Tier", width: 80, filter: true },
   // { field: "points", headerName: "Points", width: 95 },
    { field: "ipl_salary", headerName: "Salary", width: 100 },
    { field: "afc_base_salary", headerName: "EFL Base Salary", width: 150 },
   { field: "rank", headerName: "Rank",sort:'asc', width: 100 },
  ];

  
  const getRowStyle = (params) => {
    const tier = params.data.tier;
    switch (tier) {
      case 1:
        return { backgroundColor: "lightgreen" };
      case 2:
        return { backgroundColor: "lightblue" };
      case 3:
        return { backgroundColor: "orange" };
      case 4:
        return { backgroundColor: "lightpink" };
      default:
        return null;
    }
  };

    /*
    const handleFilter = (e) => {
    const value = e.target.value;
    const filtered = soldPlayers.filter((player) =>
    player.name.toLowerCase().includes(value.toLowerCase()) ||
    player.iplTeam.toLowerCase().includes(value.toLowerCase()) ||
    player.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlayers(filtered);
    };
    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection:'column' }}
    */
  
  
    return (
      <div className ="ag-page">
        <div className="ag-container">
        <div style={{backgroundColor:'red'}}>
          <button onClick={onBtnExport}>Download CSV export file</button>
        </div>
            <div className="ag-theme-alpine" style={{height: '71vh',width:"95%"}}>
              <AgGridReact
                ref={gridRef}
                rowData={Allplayers}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                getRowStyle={getRowStyle}
                suppressExcelExport={true}
              />
            </div>
            </div>
    </div>
    );
    }
