import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from "react-bootstrap";
import './Auction.css'
import PlayerCard from './PlayerCard';
import settings from '../settings.json'
import OwnerStats from '../components/OwnerStats'

const baseURL = process.env.REACT_APP_BASE_URL;

export const Auction = () => {

    const [selectedButton, setSelectedButton] = useState(null);
    const [bidder, setBidder] = useState('');
    const [amount, setAmount] = useState(20);
    const [disableMap, setDisableMap] = useState({})

    const buttonTexts = settings.setup.teamNames;

    const sample = {
        "_id":{"$oid":"63b90a44f4902c26b5359388"},
        "player_name": "Player Name",
        "ipl_salary": "50.0 L",
        "status": "unsold",
        "tier": 4,
        "player_role": "Type",
        "country": "Country Name",
        "ipl_team_name": "Franchise",
        "ownerTeam": "",
        "boughtFor": 0,
        "afc_base_salary": 20,
        "rank": 172,
        "points":0,
        "todayPoints":0
      }
    const [getPlayer, setPlayerData] = useState(sample);
    const [isflag, setFlag] = useState(false) 
    const [ownerToMaxBid, setOwnerToMaxBid] = useState({})
    const [ownersData, setOwnersData] = useState()
    const [isSold, setIsSold] = useState(false);
    const [isunSold, setIsunSold] = useState(false);
    const [buttonSold, setButtonSold] = useState(true);
    const [buttonunSold, setButtonUnSold] = useState(true);


    /*****Getting the Player code *******/
    const [requestedPlayer, setRequestedPlayerChange] = useState("");
    const handleRequestedPlayerChange = event => {
        setRequestedPlayerChange(event.target.value);
    };

    const handleClick = async () => {
        if(requestedPlayer!=="")
        {
          try{
          const response = await fetch(baseURL+'/getspecificplayer?playerName='+requestedPlayer);
          if(response.ok)
          {
            const json = await response.json();
            actionsAfterGetPlayer(json);
         } else {
           console.log('Error: ' + response.status + response.body);
         }
          
    
          }catch (error) {
            console.error(error);
          }
          return
          
        }
        try {
          const response = await fetch(baseURL+'/getplayer?collectionName=efl_playersCentral_test');
          if(response.ok){
            const json = await response.json();
            actionsAfterGetPlayer(json);
         } else {
           console.log('Error: ' + response.status + response.body);
         }
        } catch (error) {
          console.error(error);
        }
      };


      /*********Get Owners data ********/

      async function getOwnersData(prop)
    {
    try {
      const response = await fetch(baseURL+'/get_data?collectionName=efl_ownerTeams_test');
      if(response.ok){
        const json = await response.json();
        console.log(json)
        setOwnersData(json)
        const data = json.reduce((acc, curr) => {
          acc[curr.ownerName] = {maxBid:curr.maxBid,currentPurse: curr.currentPurse};
          return acc;
      }, {});
      const disableMapTemp = json.reduce((map, curr) => {
        //console.log('CURR',curr);
        // if squad is full or foreigner count is 6 or current amount is greater than maxBid for owner
        // set disable to true
        if(curr.totalCount===settings.squadSize||(curr.fCount===6 && prop !== 'India')||curr.maxBid<amount)
        {
          map[curr.ownerName]=true;
        }
        return map;
    }, {});
    //console.log(disableMapTemp);
    setDisableMap(disableMapTemp);
        //console.log(data)
        setOwnerToMaxBid(data)
     } else {
       console.log('Error: ' + response.status + response.body);
     }
    } catch (error) {
      console.error(error);
    }
  }



  function actionsAfterGetPlayer(json) {
    setPlayerData(json);
    setAmount(json.afc_base_salary);
    setBidder('');
    setSelectedButton(null);
    setRequestedPlayerChange("");
    getOwnersData(json.country);
  }

  return (
    <div className='auctionpage'>
        <div className='auctioncontainer'>
      <Row className="autiontoprow">
        <Col>
        <div className="owner-table-item">
          <div style={{display: "flex", flexDirection:"column",position:"relative",marginTop:"15px"}}>
          {ownersData && <OwnerStats data={ownersData}/> }
          </div>
      </div>
        </Col>
        <Col>
        <Row className='itemstoprow'>
        <div className="player-card-container">
        <PlayerCard playerName={getPlayer.player_name}
         country={getPlayer.country} 
         type={getPlayer.player_role} 
         franchise={getPlayer.ipl_team_name}/>
         </div>
         </Row>
         <Row className='itemsbottomrow'>
        <Col>
         <div className="text-boxes-container">
         <p style={{marginTop:"15px",marginRight:"20px"}} className='shiny-text'> Current Bidder: {bidder}</p>
         <p style={{marginTop:"15px",marginRight:"20px"}} className="shiny-text">
          BID: {amount} lacs
        </p>

        <p style={{marginTop:"15px",marginRight:"20px"}} className='shiny-text'>Current Purse:{ownerToMaxBid[bidder]?.currentPurse} lacs</p>
         <p style={{marginTop:"15px",marginRight:"20px"}} className='shiny-text'>Max Bid: {ownerToMaxBid[bidder]?.maxBid} lacs</p>

        </div>
        </Col>
        <Col>
        <div className="timer-container">
        {/* Timer component here */}
        </div>
        </Col>
        <Col>
        <div className='buttons-container'>
        <button className="action-button" >Mark Sold</button>
      <button className="action-button" >Mark Unsold</button>
        </div>
        </Col>
        </Row>
        </Col>
      </Row>
      <Row className="autionbottomrow">
        <Col>
        
        {buttonTexts.map((text, index) => (
        <div key={index} className="team-button-containers">
          <img src={require('../assets/images/auction_hand.png')} alt="my-image" className="my-image" style={{ display: selectedButton === index ? 'block' : 'none'}}/>
          <button id= {text} disabled={disableMap[text]} onClick={() => {setSelectedButton(index)
          setBidder(text)}} >{text}</button>
         </div>
      ))}
        </Col>
        <Col>
      
      <input type="text" placeholder="Player Name" value={requestedPlayer} onChange={handleRequestedPlayerChange} /> 
      <button className="action-button" onClick={handleClick}>Next Player</button>
        </Col>
      </Row>
    </div>
    </div>
  )
}
