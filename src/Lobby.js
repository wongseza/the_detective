import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WaitRoom from './WaitRoom';
import AppLogin from './AppLogin';

var gamesRef;
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
      userEmail: null,
      modalIsOpen: false,
      currentPage: 1,
      numberOfPages: 1
    };
  },

  componentWillUnmount: function() {
    if (gamesRef != null)
      gamesRef.off();
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

    gamesRef = firebase.database().ref('games/');
    gamesRef.on('value', function(snapshot) {
      var value = snapshot.val();
      var keyList = Object.keys(value);
      var count = 0;
      var rows = [];
      for (var i = 0 ; i < keyList.length ; i++)
      {
        var game = value[keyList[i]];
        if (game.status === "waiting")
        {
          count++;
          rows.push(
            <tr className="lobby-table">
              <td className="lobby-narrow-column">{count}.</td>
              <td className="lobby-wide-column">{game.name}</td>
              <td className="lobby-narrow-column">1/2</td>
              <td className="lobby-narrow-column"><input type="button" value="Join" className="lobby-button" onClick={this.joinGame.bind(this, keyList[i])} /></td>
            </tr>
          );
        }
      }
      
      this.setState({
        rows: rows,
        numberOfPages: Math.ceil(count / 5)
      }, function(){
        if (this.state.numberOfPages < this.state.currentPage)
        {
          this.setState({
            currentPage: this.state.numberOfPages
          });
        }
      });

      this.updateGameTable();

    }.bind(this));
  },

  updateGameTable: function() {
    var rows = [];
    if (this.state.currentPage === 0)
    {
      this.setState({
        gameTable:
          <table className="lobby-no-room-text">
            <tr>
              <td className="lobby-no-room-text">
                There are no vacant rooms.
                <br/>
                Please create a new room.
              </td>
            </tr>
          </table>,
        currentPage: 1,
        numberOfPages: 1
      });
    }
    else
    {
      var first = (this.state.currentPage - 1) * 5;
      var lastPlusOne = (first + 5 > this.state.rows.length) ? this.state.rows.length : first + 5;
      var rows = this.state.rows.slice(first, lastPlusOne);

      for (var i = lastPlusOne; i < first + 5; i++)
      {
        rows.push(
          <tr className="lobby-table">
            <td className="lobby-narrow-column-borderless"></td>
            <td className="lobby-wide-column-borderless"></td>
            <td className="lobby-narrow-column-borderless"></td>
            <td className="lobby-narrow-column-borderless"><input type="button" className="lobby-empty-button" disabled/></td>
          </tr>
        );
      }

      this.setState({
        gameTable:
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
      });
    }
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

        ReactDOM.render(<WaitRoom userId={this.props.userId} gameId={key} />, document.getElementById('root'));
      }
    }.bind(this));
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
      name: this.refs.gameName.value,
      status: "waiting"
    }).then((ref) => {
      this.closeModal();
      ReactDOM.render(<WaitRoom userId={this.props.userId} gameId={ref.key} />, document.getElementById('root'));
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

  goToPrevPage: function() {
    if (this.state.currentPage > 1)
    {
      this.setState({
        currentPage: this.state.currentPage - 1
      }, function(){this.updateGameTable()});
    }
  },

  goToNextPage: function() {
    if (this.state.currentPage < this.state.numberOfPages)
    {
      this.setState({
        currentPage: this.state.currentPage + 1
      }, function(){
        this.updateGameTable()
      });
    }
  },

  logOut: function() {
    firebase.auth().signOut().then(function() {
      ReactDOM.render(<AppLogin />,document.getElementById('root'));
    }.bind(this), function(error) {});
  },

  render: function() {
    return (
      <div className="lobby">
        <table className="lobby-container">
          <tr className="lobby-header">
            <td className="lobby-header">
              <p className="lobby-header-text">Welcome! {this.state.userEmail}</p>
              <p><button className="lobby-big-button" onClick={this.openModal}>Create New Game</button></p>
            </td>
          </tr>
          <tr className="lobby-main">
            <td className="lobby-main">
              {this.state.gameTable}
            </td>
          </tr>
          <tr className="lobby-footer">
            <td className="lobby-footer">
              <table className="lobby-navigate-table">
                <tr>
                  <td className="lobby-navigate-column">
                    <button className="lobby-navigate-button" onClick={this.goToPrevPage} ref="prevPageButton">&lt;&lt; Previous</button>
                  </td>
                  <td className="lobby-navigate-column">
                    <span className="lobby-text">Page {this.state.currentPage}/{this.state.numberOfPages}</span>
                  </td>
                  <td className="lobby-navigate-column">
                    <button className="lobby-navigate-button" onClick={this.goToNextPage} ref="nextPageButton">Next &gt;&gt;</button>
                  </td>
                </tr>
              </table>
              <br/>
              <button className="lobby-logout-button" onClick={this.logOut} ref="logOutButton">Log Out</button>
            </td>
          </tr>
        </table>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <div className="lobby-modal-content">
            <p className="lobby-header-text">
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
                  <input type="text" id="gameName" ref="gameName" className="lobby-modal-textbox"/>
                </center>
              </p>
              <p>
                <center>
                  <input type="button" onClick={this.createGameInFirebase} value="Submit" className="lobby-modal-button"/>
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

