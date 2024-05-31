import React, { useState, useEffect, useMemo } from "react";
import './DraftTeams.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Modal } from 'antd';

export default function DraftTeams() {
  const [Playerslist, setPlayerslist] = useState([]);
  const [Teamsstats, setTeamsstats] = useState([]);
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [showplayers, setShowPlayers] = useState([]);
  const [teamname, setSelectedteamname] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  const baseURL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    async function getallteamdetails() {
      try {
        const response = await fetch(baseURL + '/get_data?collectionName=eflDraft_ownerTeams');
        if (response.ok) {
          const stats = await response.json();
          console.log(stats);
          setTeamsstats(stats);
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }
    getallteamdetails();
  }, []);

  const mapTeamNameToDraftSequence = (teamData) => {
    return teamData.reduce((acc, team) => {
      acc.push({
        teamName: team.teamName,
        draftSequence: team.draftSequence
      });
      return acc;
    }, []);
  };

  const teamMapping = mapTeamNameToDraftSequence(Teamsstats);

  //console.log("map", teamMapping);

  const defaultColDef = {
    sortable: true,
    resizable: true,
    // filter: true,
  };

  const columnDefs = [
    { field: "teamName", headerName: "Team", width: 200, filter: true, sort: "asc" }
  ];

  const gridOptions = {
    rowSelection: 'single', // enable single-row selection mode
    onRowSelected: (event) => {
      if (event.node.isSelected()) {
        // handle row selection
        const selectedRow = event.node.data;
        setSelectedteamname(selectedRow.teamName);
        setShowPlayers(selectedRow.draftSequence.map(name => ({ name }))); // assuming draftSequence contains player details
        setIsModalOpen(true);
      }
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const playerColumns = [
    { headerName: 'Name', field: 'name' },
  ];

  return (
    <div className="teampage">
      <div className="teampagecontainer">
        <div className="ag-theme-alpine-dark" style={{ height: "72vh", width: "82vw" }}>
          <AgGridReact
            rowData={teamMapping}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            gridOptions={gridOptions}
          />
        </div>
        <div>
          <Modal
            title={teamname + " players"}
            style={{ top: 30, width: 700, zIndex: 9999 }}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleOk}
            cancelButtonProps={{ style: { display: 'none' } }}
          >
            {
              <div className="ag-theme-alpine" style={{ height: "72vh" }}>
                <AgGridReact
                  rowData={showplayers}
                  columnDefs={playerColumns}
                  defaultColDef={defaultColDef} />
              </div>
            }
          </Modal>
        </div>
      </div>
    </div>
  );
}
