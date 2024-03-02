import React, { useState, useEffect, useMemo} from "react";
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
    const response = await fetch(baseURL+'/get_data?collectionName=playersCentral');
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return response.json();
  };



export const AllPlayers = () => {
  const [Allplayers, setAllPlayerslist] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [soldPlayers, setSoldPlayers] = useState([]);


  const { isLoading, error, data } = useQuery({queryKey:['players'], queryFn:fetchPlayerslist});

  useEffect(() => {
    if (data) {
      setAllPlayerslist(data);
    }
  }, [data]); 

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  //setAllPlayerslist(data)

  console.log(Allplayers)

  const defaultColDef = {
    sortable: true,
    resizable: true,
    //filter: true,
  };

  const columnDefs = [
    { field: "player_name", headerName: "Name", width: 200, filter: true},
    { field: "ipl_team_name", headerName: "IPL Team", width: 120, filter: true },
   // { field: "status", headerName: "Status", width: 150,filter: true },
    { field: "player_role", headerName: "Role", width: 120, filter: true },
   { field: "country", headerName: "Country", width: 120,filter: true },
   // { field: "tier", headerName: "Tier", width: 80, filter: true },
   // { field: "points", headerName: "Points", width: 95 },
    { field: "ipl_salary", headerName: "Salary", width: 100 },
    { field: "afc_base_salary", headerName: "EFL Base Salary", width: 150 },
   // { field: "rank", headerName: "Rank",sort:'asc', width: 100 },
  ];

  /*
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

    
    const handleFilter = (e) => {
    const value = e.target.value;
    const filtered = soldPlayers.filter((player) =>
    player.name.toLowerCase().includes(value.toLowerCase()) ||
    player.iplTeam.toLowerCase().includes(value.toLowerCase()) ||
    player.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlayers(filtered);
    };*/
  
    return (
      <Container fluid>
      <Row>
        <Col>
          <div className="ag-container">
            <div className="ag-theme-alpine">
              <AgGridReact
                rowData={Allplayers}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
    );
    }

    /*
     <SideBar pagedata={
        
     }/>*/