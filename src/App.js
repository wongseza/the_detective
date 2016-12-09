import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import WaitRoom from './WaitRoom';
import EndGame from './EndGame';
import AppLogin from './AppLogin';
import Lobby from './Lobby';
import GamePlay from './GamePlay';
import Action from './Action';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config);

var usersRef = firebase.database().ref('users/');

// Get a reference to the database service

function writeData(userId, name, email) {
  var usersRef = firebase.database().ref('users/' + userId);
  usersRef.set({
    username: name,
    email: email,
  });
}

var App = React.createClass({
  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: ""
    };
  },

  componentWillMount: function() {
    var currentTime = new Date();
    var value = 0;
    /*writeData('' + currentTime.getHours() + ' ' + currentTime.getMinutes() + ' ' + currentTime.getSeconds(), 'aaaa', 'bbbbb');*/

    // usersRef = firebase.database().ref('users/');
    usersRef.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        count: Object.keys(value).length,
        items: value,
        json: JSON.stringify(value)
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    console.log('Unmounting firebase "users/"');
    usersRef.off();
  },

  clickButtonRemoveLast: function(e) {
    var length = Object.keys(this.state.items).length;
    var usersRef = firebase.database().ref('users/' + Object.keys(this.state.items)[length - 1]);
    usersRef.remove();
  },

  clickWaitRoom: function(e) {
    console.log('click button to wait room');
    return ReactDOM.render(<WaitRoom userId="14 34 48" gameId="-KWq-fZKpb-a4lLvug8T"/>,document.getElementById('root'));
  },

  clickEndGame: function(e) {
    console.log('click button to end game');
    return ReactDOM.render(<EndGame userId='14 34 48' gameId="-KWq-fZKpb-a4lLvug8T" />,document.getElementById('root'));
  },
  
  clickToLogin: function(e) {
    console.log('click button to log in page');
    return ReactDOM.render(<AppLogin />,document.getElementById('root'));
  },

  clickLobby: function(e) {
    console.log('click button to wait room');
    return ReactDOM.render(<Lobby userId="16 37 4"/>,document.getElementById('root'));
  },

  clickGamePlay: function(e) {
    console.log('click button to Game Play');
    return ReactDOM.render(<GamePlay userId="14 34 48" gameId="-KWq-fZKpb-a4lLvug8T" playerId="player1"/>,document.getElementById('root'));
  },

  clickAction: function(e) {
    console.log('click button to Action');
    return ReactDOM.render(<Action userId="14 34 48" gameId="-KWq-fZKpb-a4lLvug8T"/>,document.getElementById('root'));
  },

  render: function() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.<br/>
          User count: {this.state.count}<br/>
          JSON: {this.state.json}
        </p>
        <input type="button" onClick={this.clickButtonRemoveLast} value="Remove last" />
        <input type="button" onClick={this.clickWaitRoom} value="To WaitRoom" />
        <input type="button" onClick={this.clickEndGame} value="To EndGame" />
        <input type="button" onClick={this.clickToLogin} value="To Login" />
        <input type="button" onClick={this.clickLobby} value="To Lobby" />
        <input type="button" onClick={this.clickGamePlay} value="To GamePlay" />
        <input type="button" onClick={this.clickAction} value="To Action" />
      </div>
    );
  }
});

export default App;
