import React, { Component } from 'react';
import winner from './winner.png';
import './App.css';

// var firebase = require("firebase");
// var config = {
//   apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
//   authDomain: "the-detective.firebaseapp.com",
//   databaseURL: "https://the-detective.firebaseio.com",
//   storageBucket: "the-detective.appspot.com",
//   messagingSenderId: "551652425284"
// };
// firebase.initializeApp(config);

// // Get a reference to the database service

// function writeData(userId, name, email) {
//   var usersRef = firebase.database().ref('users/' + userId);
//   usersRef.set({
//     username: name,
//     email: email,
//   });
// }

var EndGame = React.createClass({
  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: "",
      gameName: "Game1",
      gameStatus: "winner",
      imgUrl: ""
    };
  },

  componentWillUnmount: function() {
    //this.firebase.off();
  },

  render: function() {
    return (
      <div className="EndGame">
        <div className="EndGame-header">
          <img src={winner} className="EndGame-logo" alt="logo" />
          <h2>End game la na</h2>
        </div>
        <p className="EndGame-intro">
          To get started, edit <code>src/App.js</code> and save to reload.<br/>
          Game Status : {this.state.gameStatus}{this.state.imgUrl}<br/>
        </p>
        <input type="button" onClick={this.clickButtonRemoveLast} value="Remove last" />
      </div>
    );
  }
});

export default EndGame;
