import React, { Component } from 'react';
import tileA from './TileA.png';
import tileB from './TileB.png';
import tileC from './TileC.png';
import tileD from './TileD.png';
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
      tile0: tileA
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
    console.log(this.state.tile0);
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

  render: function() {
    return (
      <div className="Board">
        <div className="Board-alignment">
          <img src={this.state.tile0} className="Tile-logo" alt="logo" onClick={this.clickTile0}/>
          <img src={tileA} className="Tile-logo" alt="logo"  />
          <img src={tileA} className="Tile-logo" alt="logo" />
          <img src={tileA} className="Tile-logo" alt="logo" />
        </div>
        <div className="Board-alignment">
          <img src={tileB} className="Tile-logo" alt="logo" />
          <img src={tileA} className="Tile-logo" alt="logo" />
          <img src={tileA} className="Tile-logo" alt="logo" />
          <img src={tileA} className="Tile-logo" alt="logo" />
        </div>
        <div className="Board-alignment">
          <img src={tileA} className="Tile-logo" alt="logo" />
          <img src={tileB} className="Tile-logo" alt="logo" />
          <img src={tileB} className="Tile-logo" alt="logo" />
          <img src={tileB} className="Tile-logo" alt="logo" />
        </div>
        <div className="Board-alignment">
          <img src={tileB} className="Tile-logo" alt="logo" />
          <img src={tileB} className="Tile-logo" alt="logo" />
          <img src={tileD} className="Tile-logo" alt="logo" />
          <img src={tileC} className="Tile-logo" alt="logo" />
        </div>
      </div>
    );
  }
});

export default GamePlay;
