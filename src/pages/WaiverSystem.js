import React, { useState, useEffect } from 'react';
import './WaiverSystem.css';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { useSelector } from 'react-redux';
import { encryptData,decryptData } from '../components/Encryption';



const baseURL = process.env.REACT_APP_BASE_URL;

const fetchPlayerslist = async () => {
  const response = await fetch(baseURL+'/get_data?collectionName=eflDraft_playersCentral');
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export const WaiverSystem = () => {
  const [preferences, setPreferences] = useState(['', '', '', '']);
  const [drops, setDrops] = useState(['', '']);
  const [soldPlayers, setSoldPlayers] = useState([]);
  const [unsoldPlayers, setUnSoldPlayers] = useState([]);
  const [Teamswaiver, setTeamswaiver] = useState([])
 
  const userProfile = useSelector((state) => state.login.userProfile);
  const useremail = userProfile ? userProfile.email : '';
  //const useremail ="saksharhere@gmail.com"
  

  const { isLoading, error, data } = useQuery({queryKey:['players'], queryFn:fetchPlayerslist});

  useEffect(() => {
    if (data) {
      setUnSoldPlayers(data.filter((item) => item.status === 'unsold'));
      setSoldPlayers(data.filter((item) => item.status === 'sold'));
    }
  }, [data]); 

  useEffect(() => {
    async function getteaminfo() {
      try {
        const response = await fetch(`${baseURL}/getTeamOwnerByEmail/${useremail}`);
        if (response.ok) {
          const stats = await response.json();
          setTeamswaiver(stats);
          handledecrypt(stats.currentWaiver.in, "pref");
          handledecrypt(stats.currentWaiver.out, "drop");
        } else {
          console.log('Error: ' + response.status + response.body);
        }
      } catch (error) {
        console.error(error);
      }
    }

    if (useremail) {
      getteaminfo();
    }
  }, [useremail]);


  const handledecrypt = (val, opt) => {
    if (opt === "pref") {
      const newPreferences = val.map(item => decryptData(item));
      setPreferences(newPreferences);
    } else if (opt === "drop") {
      const newDrops = val.map(item => decryptData(item));
      setDrops(newDrops);
    }
  };

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:'250px' }}>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (Teamswaiver.length === 0) return <div>Loading teams data...</div>;

  const transformedunsoldPlayers = unsoldPlayers.map(unsoldPlayers => ({
    value: unsoldPlayers.player_name,
    label: unsoldPlayers.player_name
  }));

  const teamname = Teamswaiver.teamName
  const teamplayers = soldPlayers.filter((item) => item.ownerTeam === teamname)
  const transformedsoldPlayers = teamplayers.map(teamplayers => ({
    value: teamplayers.player_name,
    label: teamplayers.player_name
  }));


  const handlePreferenceChange = (index, value) => {
    const newPreferences = [...preferences];
    const encryptedprefvalue = encryptData(value)
    newPreferences[index] = encryptedprefvalue;
    setPreferences(newPreferences);
  };

  const handleDropChange = (index, value) => {
    const newDrops = [...drops];
    const encrypteddropvalue = encryptData(value)
    newDrops[index] = encrypteddropvalue;
    setDrops(newDrops);
  };

  const handleSubmit = () => {
    const payload = {  "currentWaiver": {
      "in": preferences,
      "out": drops
    } };
    
    fetch(`${baseURL}/updateCurrentWaiver/${useremail}`, {
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

    alert('Your waivers saved successfully!!The selection will be locked on Tuesday at 11:59 pm');
  };


  return (
    <div className="waiverpage">
    <div className="waiversystem">
      <h1>Waivers for {teamname}</h1>
      <div className="preference-section">
        <h2>Preferences</h2>
        {preferences.map((preference, index) => (
          <div key={index} className="preference-input">
            <label>Preference {index + 1}</label>
            <Select
              showSearch
              style={{width:300,border:"1px solid black",borderRadius:"5px",color:"black"}}
              placeholder={preference?preference:"Search Player to Select"}
              optionFilterProp="children"
              onChange={(value) => handlePreferenceChange(index, value)}
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
              options={transformedunsoldPlayers}
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
              <Select
                placeholder={drop?drop:"Search Player to drop"}
                style={{width:250,border:"1px solid black",borderRadius:"5px",color:"black"}}
                optionFilterProp="children"
                onChange={(value) => handleDropChange(index, value)}
                options ={transformedsoldPlayers}
              />
            </div>
          ))}
        </div>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
    </div>
  );
};
