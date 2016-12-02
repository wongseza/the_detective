import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WaitRoom from './WaitRoom';

var ReactDOM = require('react-dom');
var Modal = require('react-modal');
var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
var firebaseRef = firebase.initializeApp(config, 'lobby');

var Lobby = React.createClass({
  getInitialState: function() {
    return {
      gameTable: "",
      goToWaitRoom: false,
      userEmail: null,
      gameId: null,
      modalIsOpen: false
    };
  },

  componentWillMount: function() {
    var currentTime = new Date();
    var value = 0;

    var usersRef = firebase.database().ref('users/' + this.props.userId);
    usersRef.once('value', function(snapshot) {
      var value = snapshot.val();
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
          <table className="lobby-table">
            <thead>
              <tr className="lobby-table-header">
                <th className="lobby-table-header">No.</th>
                <th className="lobby-table-header">Room</th>
                <th className="lobby-table-header">Players</th>
                <th className="lobby-table-header">Join</th>
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
        if (game.status === "waiting")
        {
          j++;
          rows.push(
            <tr className="lobby-table">
              <td className="lobby-narrow-column">{j}.</td>
              <td className="lobby-wide-column">{game.name}</td>
              <td className="lobby-narrow-column">1/2</td>
              <td className="lobby-narrow-column"><input type="button" value="Join" className="lobby-button" onClick={this.joinGame.bind(this, keyList[i])} /></td>
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
    var gamesRef = firebase.database().ref('games/' + key);
    gamesRef.once('value', function(snapshot) {
      var value = snapshot.val();
      if (value.status === "waiting")
      {
        var statusRef = firebase.database().ref('games/' + key + '/status');
        statusRef.set("full");

        var player1Ref = firebase.database().ref('games/' + key + '/players/player1')
        player1Ref.set({
          id: this.props.userId,
          ready: false
        });

        this.setState({
          gameId: key,
          goToWaitRoom: true
        });
      }
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
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

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  afterOpenModal: function() {
    // references are now sync'd and can be accessed.
    this.refs.gameName.focus();
  },

  closeModal: function() {
    this.setState({modalIsOpen: false});
  },

  render: function() {
    if (this.state.goToWaitRoom) {
      return (
        <WaitRoom userId={this.props.userId} gameId={this.state.gameId} />
      );
    }
    return (
      <div className="lobby">
        <p className="lobby-header">Welcome! {this.state.userEmail}</p>
        <p><button className="lobby-big-button" onClick={this.openModal}>Create New Game</button></p>
        <br/>
        {this.state.gameTable}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <div className="lobby-modal-content">
            <p className="lobby-header">
              <center>
                Create New Game
              </center>
            </p>
            <p className="lobby-text">
              Please enter a name for your game room.
            </p>
            <form>
              <p>
                <center>
                  <input type="text" id="gameName" ref="gameName" className="lobby-modal-textbox" autocomplete="off"/>
                </center>
              </p>
              <p>
                <center>
                  <input type="button" onClick={this.createGameInFirebase} value="Submit" className="lobby-modal-button" />
                  <span className="lobby-space" />
                  <input type="button" onClick={this.closeModal} value="Cancel" className="lobby-modal-button" />
                </center>
              </p>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
});

const customStyles = {
  overlay : {
    position          : 'fixed',
    top               : 0,
    left              : 0,
    right             : 0,
    bottom            : 0,
    backgroundColor   : 'rgba(180, 180, 180, 0.8)'
  },
  content : {
    top                   : '45%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    border                : '3px solid #333',
    borderRadius          : '10px',
    backgroundColor       : '#fff'
  }
};


export default Lobby;

