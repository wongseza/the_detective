import React from 'react';
import ReactDOM from 'react-dom';
import winner from './winner.png';
import loser from './loser.png';
import './App.css';
import Lobby from './Lobby';
    

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
    var suspectsRef = firebase.database().ref('games/'+ this.props.gameId+'/players/' + this.props.playerId + '/suspects');
    suspectsRef.once('value', function(snapshot) {
      var numSuspects = snapshot.numChildren();
      if (numSuspects === 1) {
        this.setState({
          result: "win"
        });
      }
    }.bind(this))
  },

  componentWillUnmount: function() {
    //this.firebase.off();
  },

  clickButtonFinish: function(e) {
    return ReactDOM.render(<Lobby userId={this.props.userId}/>, document.getElementById('root'))
  },

  render: function() {
    if (this.state.result === "win") {
      return (
        <div className="EndGame">
          <div className="EndGame-header">
            <img src={winner} className="EndGame-logo" alt="logo" />
            <h2>End game la na</h2>
          </div>
          <input type="button" onClick={this.clickButtonFinish} value="Back" />
        </div>
      );
    } else {
      return (
        <div className="EndGame">
          <div className="EndGame-header">
            <img src={loser} className="EndGame-logo" alt="logo" />
            <h2>End game la na</h2>
          </div>
          <input type="button" onClick={this.clickButtonFinish} value="Back" />
        </div>
      );
    }
      

  }
});

export default EndGame;
