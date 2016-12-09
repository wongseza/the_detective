import React, { Component } from 'react';
import tileA from './TileA.png';
import tileB from './TileB.png';
import tileC from './TileC.png';
import tileD from './TileD.png';
import suspectA from './SuspectA.png';
import detectiveA from './DetectiveA.png';
import detectiveB from './DetectiveB.png';
import detectiveC from './DetectiveC.png';
import detectiveD from './DetectiveD.png';
import './GamePlay.css';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config, "gamePlayFirebase");

// Get a reference to the database service

var GamePlay = React.createClass({

  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: "",
      result: "lose",
      tile0: tileA,
      player0Detective1: "1N",
      player0Detective2: "2N",
      player1Detective1: "3N",
      player1Detective2: "4N"
    };
  },

  componentWillMount: function() {
    var tile0 = firebase.database().ref('games/'+ this.props.gameId+'/tiles/tile0/name');
    var value = 0;

    tile0.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "a":
          newState["tile0"] = tileA;
          break;
        case "b":
          newState["tile0"] = tileB;
          break;
        case "c":
          newState["tile0"] = tileC;
          break;
        case "d":
          newState["tile0"] = tileD;
          break;
        default:
          newState["tile0"] = tileA;
      }
      this.setState(newState);
    }.bind(this))

    var player0Detective1 = firebase.database().ref('games/'+ this.props.gameId + '/players/player1/detective1');
    var player0Detective2 = firebase.database().ref('games/'+ this.props.gameId + '/players/player1/detective2');

    player0Detective1.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player0Detective1: value
      });
    }.bind(this))

    player0Detective2.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player0Detective2: value
      });
    }.bind(this))

    var player1Detective1 = firebase.database().ref('games/'+ this.props.gameId + '/players/player2/detective1');
    var player1Detective2 = firebase.database().ref('games/'+ this.props.gameId + '/players/player2/detective2');

    player1Detective1.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player1Detective1: value
      });
    }.bind(this))

    player1Detective2.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player1Detective2: value
      });
    }.bind(this))
  },

  componentWillUnmount: function() {
  },

  clickTile0: function(e) {
    var tile0Name = firebase.database().ref('games/'+ this.props.gameId+'/tiles/tile0/name');
    var value = 0;
    var newValue = 0;

    tile0Name.once('value', function(snapshot) {
      value = snapshot.val();

      switch (value) {
        case "a":
          newValue = "b";
          break;
        case "b":
          newValue = "c";
          break;
        case "c":
          newValue = "d";
          break;
        case "d":
          newValue = "a";
          break;
        default:
          newValue = "a";
      }
    });

    var tile0 = firebase.database().ref('games/'+ this.props.gameId+'/tiles/tile0');
    tile0.set({
      name: newValue
    })

    return ;
  },

  clickDetectiveTile: function(id) {
    var cells = document.getElementsByClassName("DetectiveCell");

    for (var i=0,len=cells.length; i<len; i++){
      cells[i].style.backgroundColor = "";
    }

    var activeCell = document.getElementById(id);
    activeCell.style.backgroundColor = "lightslategray";
      

    // var cells = document.getElementById('GameBoard').getElementsByTagName('td');

    // for (var i=0,len=cells.length; i<len; i++){
    //   cells[i].onclick = function(){
    //     console.log("Test");
    //     this.style.backgroundColor = "none";
    //   }
    // }
  },

  addPlayer0Detective: function(id) {
    console.log("add detective " + id);

    if (this.state.player0Detective1 === id)
      return (<img src={detectiveA} alt="logo" />);
    else if (this.state.player0Detective2 === id)
      return (<img src={detectiveB} alt="logo" />);
    else
      return ("");
  },

  addPlayer1Detective: function(id) {
    console.log("add detective " + id);

    if (this.state.player1Detective1 === id)
      return (<img src={detectiveC} alt="logo" />);
    else if (this.state.player1Detective2 === id)
      return (<img src={detectiveD} alt="logo" />);
    else
      return ("");
  },

  render: function() {
    return (
      <div className="Board">
        <table>
          <tr>
            <td>
              <table id="GameBoard">
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1N")} >
                    {this.addPlayer0Detective.bind(this, "1N")()}
                    {this.addPlayer1Detective.bind(this, "1N")()}
                  </td>
                  <td id="2N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2N")} >
                    {this.addPlayer0Detective.bind(this, "2N")()}
                    {this.addPlayer1Detective.bind(this, "2N")()}
                  </td>
                  <td id="3N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3N")} >
                    {this.addPlayer0Detective.bind(this, "3N")()}
                    {this.addPlayer1Detective.bind(this, "3N")()}
                  </td>
                  <td id="4N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4N")} >
                    {this.addPlayer0Detective.bind(this, "4N")()}
                    {this.addPlayer1Detective.bind(this, "4N")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
                <tr>
                  <td id="1W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1W")} >
                    {this.addPlayer0Detective.bind(this, "1W")()}
                    {this.addPlayer1Detective.bind(this, "1W")()}
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile0} alt="logo" onClick={this.clickTile0}/>
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileA} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileA} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileA} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="1E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1E")} >
                    {this.addPlayer0Detective.bind(this, "1E")()}
                    {this.addPlayer1Detective.bind(this, "1E")()}
                  </td>
                </tr>
                <tr>
                  <td id="2W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2W")} >
                    {this.addPlayer0Detective.bind(this, "2W")()}
                    {this.addPlayer1Detective.bind(this, "2W")()}
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="2E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2E")} >
                    {this.addPlayer0Detective.bind(this, "2E")()}
                    {this.addPlayer1Detective.bind(this, "2E")()}
                  </td>
                </tr>
                <tr>
                  <td id="3W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3W")} >
                    {this.addPlayer0Detective.bind(this, "3W")()}
                    {this.addPlayer1Detective.bind(this, "3W")()}
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="3E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3E")} >
                    {this.addPlayer0Detective.bind(this, "3E")()}
                    {this.addPlayer1Detective.bind(this, "3E")()}
                  </td>
                </tr>
                <tr>
                  <td id="4W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4W")} >
                    {this.addPlayer0Detective.bind(this, "4W")()}
                    {this.addPlayer1Detective.bind(this, "4W")()}
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={tileB} alt="logo" />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="4E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4E")} >
                    {this.addPlayer0Detective.bind(this, "4E")()}
                    {this.addPlayer1Detective.bind(this, "4E")()}
                  </td>
                </tr>
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1S")} >
                    {this.addPlayer0Detective.bind(this, "1S")()}
                    {this.addPlayer1Detective.bind(this, "1S")()}
                  </td>
                  <td id="2S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2S")} >
                    {this.addPlayer0Detective.bind(this, "2S")()}
                    {this.addPlayer1Detective.bind(this, "2S")()}
                  </td>
                  <td id="3S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3S")} >
                    {this.addPlayer0Detective.bind(this, "3S")()}
                    {this.addPlayer1Detective.bind(this, "3S")()}
                  </td>
                  <td id="4S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4S")} >
                    {this.addPlayer0Detective.bind(this, "4S")()}
                    {this.addPlayer1Detective.bind(this, "4S")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
              </table>
            </td>
            <td className="PlayerInfo">
              dfjkdf
            </td>
          </tr>
        </table>
      </div>
    );
  }
});

export default GamePlay;
