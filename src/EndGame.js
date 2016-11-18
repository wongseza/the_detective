import React, { Component } from 'react';
import winner from './winner.png';
import loser from './logo.svg';
import './App.css';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config, "endGameFirebase");

// Get a reference to the database service

var EndGame = React.createClass({

  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: "",
      result: "lose"
    };
  },

  componentWillMount: function() {
    var currentTime = new Date();
    var value = 0;
    var value2 = 0;
   
    var player0 = firebase.database().ref('games/'+ this.props.gameId+'/players/player0/id');
    var player1 = firebase.database().ref('games/'+ this.props.gameId+'/players/player1/id');
    console.log("Kao " + 'games/'+ this.props.gameId+'/players/player0/id')
    player0.once('value', function(snapshot) {
      value = snapshot.val();
      if (value == this.props.userId) {
        var suspect0 = firebase.database().ref('games/'+ this.props.gameId+'/players/player0/suspect');
        suspect0.once('value', function(snapshot2) {
          value2 = snapshot2.numChildren();
          if (value2 == 1) {
            this.setState({
              result: "win"
            });
          }
        }.bind(this))
        
      } else {
        var suspect1 = firebase.database().ref('games/'+ this.props.gameId+'/players/player1/suspect');
        suspect1.once('value', function(snapshot2) {
          value2 = snapshot2.numChildren();
          if (value2 == 1) {
            this.setState({
              result: "win"
            });
          }
        }.bind(this))
      }
    }.bind(this));
  },

  componentWillUnmount: function() {
    //this.firebase.off();
  },

  clickButtonFinish: function(e) {
    return window.location.href = '/index.html';
  },

  render: function() {
    if (this.state.result == "win") {
      return (
        <div className="EndGame">
          <div className="EndGame-header">
            <img src={winner} className="EndGame-logo" alt="logo" />
            <h2>End game la na</h2>
          </div>
          <input type="button" onClick={this.clickButtonFinish} value="Finish" />
        </div>
      );
    } else {
      return (
        <div className="EndGame">
          <div className="EndGame-header">
            <img src={loser} className="EndGame-logo" alt="logo" />
            <h2>End game la na</h2>
          </div>
          <input type="button" onClick={this.clickButtonFinish} value="Finish" />
        </div>
      );
    }
      

  }
});

export default EndGame;
