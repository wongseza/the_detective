import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WaitRoom from './WaitRoom';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
var firebaseRef = firebase.initializeApp(config);

var Lobby = React.createClass({
  getInitialState: function() {
    return {
      modal: "",
      gameTable: "",
      goToWaitRoom: false,
      userId: this.props.userId,
      userEmail: null,
      gameId: null
    };
  },

  componentWillMount: function() {
    var currentTime = new Date();
    var value = 0;

    var usersRef = firebase.database().ref('users/' + this.props.userId);
    usersRef.once('value', function(snapshot) {
      var value = snapshot.val();
      alert(value.email);
      this.setState({
        userEmail: value.email
      });
    }.bind(this));

    var gamesRef = firebase.database().ref('games/');
    gamesRef.on('value', function(snapshot) {
      var value = snapshot.val();

      var rows = [];
      var table = 
        <div>
          <table className="game-table">
            <thead>
              <tr className="game-table">
                <th className="game-table">No.</th>
                <th className="game-table">Name</th>
                <th className="game-table">Player</th>
                <th className="game-table">Join</th>
                <th className="game-table">Key</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      ;

      var keyList = Object.keys(value);
      var j = 0;
      for(var i = 0 ; i < keyList.length ; i++)
      {
        var game = value[keyList[i]];
        if (game.status == "waiting")
        {
          j++;
          rows.push(
            <tr className="game-table">
              <td className="game-table">{j}.</td>
              <td className="game-table">{game.name}</td>
              <td className="game-table">1/2</td>
              <td className="game-table"><input type="button" value="Join" onClick={this.joinGame.bind(this, keyList[i])} /></td>
              <td className="game-table">{keyList[i]}</td>
            </tr>
          );
        }
      }

      this.setState({
        gameTable: table
      });

    }.bind(this));
  },

  joinGame: function(key) {
    this.setState({
      gameId: key,
      goToWaitRoom: true
    });
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },

  closeModal: function() {
    var modal = document.getElementById('myModal');
    if (modal != null)
      modal.style.display = "none";
  },

  createGameInFirebase: function(){
    var gamesRef = firebase.database().ref('games/');
    var gameRef = gamesRef.push({
      players: 
      {
        player0: 
        {
          id: this.props.userId, 
          ready: false
        }
      },
      name: document.getElementById('gameName').value,
      status: "waiting"
    });
    this.closeModal();
    this.setState({
      gameId: gameRef.key,
      goToWaitRoom: true
    });
  },

  createNewGame: function(e) {
    this.setState({
      createNewRoom: true,
      modal: 
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={this.closeModal}>
              x
            </span>
            <p>
              <strong>Create new game</strong><br/><br/>
              Please enter a desired name of your game room.<br/><br/>
              <input type="text" id="gameName" /> <br/><br/>
              <input type="button" onClick={this.createGameInFirebase} value="Submit" />
            </p>
          </div>
        </div>
    });

    // Get the modal
    var modal = document.getElementById('myModal');
    if (modal != null)
      modal.style.display = "block";

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
  },

  render: function() {
    if (this.state.goToWaitRoom)
    {
      return (
        <WaitRoom userId={this.state.userId} gameId={this.state.gameId} />
      );
    }
    return (
      <div className="App">
        Welcome! {this.state.userEmail}<br/>
        {this.state.modal}<br/>
        <input type="button" id="myBtn" onClick={this.createNewGame} value="Create new game" />
        <br/><br/>
        {this.state.gameTable}
      </div>
    );
  }
});

export default Lobby;

