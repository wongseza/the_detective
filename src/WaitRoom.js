import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import App from './App';
import GamePlay from './GamePlay';

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
    authDomain: "the-detective.firebaseapp.com",
    databaseURL: "https://the-detective.firebaseio.com",
    storageBucket: "the-detective.appspot.com",
    messagingSenderId: "551652425284"
};
firebase.initializeApp(config, "fb_waitroom");

var gameRef;
var currentUser;
var gameName;
var currentPlayerNum;
var allReady = false;

var WaitRoom = React.createClass({
    getInitialState: function() {
        return {
            buttonName: "Ready",
            playerIDList: null,
            playerStatusList: null,
            emailList: null
        };
    },

    toggleButton: function() {
        var player0IdRef = firebase.database().ref('games/' + this.props.gameId + '/players/player1');
        var player1IdRef = firebase.database().ref('games/' + this.props.gameId + '/players/player2');
        var player0Id;
        var player1Id;

        player0IdRef.once('value', function(snapshot) {
            player0Id = snapshot.val();
        });

        player1IdRef.once('value', function(snapshot) {
            player1Id = snapshot.val();
        });

        if (this.props.userId === player0Id.id) {
            player0IdRef.update({
                ready: true,
            });
        } else {
            player1IdRef.update({
                ready: true,
            });
        }
    },

    componentWillMount: function() {
    //   console.log("componentWillMount");
      gameRef = firebase.database().ref('games/' + this.props.gameId);

      gameRef.on('value', function(snapshot) {
          var game = snapshot.val();
          gameName = game.name;
          var players = Object.keys(game.players);
        //   console.log(players);

          var emails = [];
          var playerIDs = [];
          var playerStatus = [];
          for (var i = 0; i < players.length; i++) {
            var player = game.players[players[i]];
            // console.log(player);
            playerIDs.push(player.id);
            playerStatus.push(player.ready);
            var userRef = firebase.database().ref('users/' + player.id + '/email');
            userRef.once('value', function(snapshot) {
                emails.push(snapshot.val());
            }).then((ref) => {
                this.setState({
                    emailList: emails,
                    playerIDList: playerIDs,
                    playerStatusList: playerStatus
                });
            });
          } // end for

          // this.createTable();
        }.bind(this));
    },

    componentWillUnmount: function() {
        if (gameRef != null) {
            console.log('unmounting ' + gameRef);
            gameRef.off();
        }
    },

    createTable: function() {
      console.log("createTable");
        var rows = [];
        var table =
            <div>
                <table className="player-table">
                    <thead>
                        <tr className="player-table">
                            <th className="player-table">No.</th>
                            <th className="player-table">Name</th>
                            <th className="player-table">Ready</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </div>
            ;

          if (this.state.playerIDList != null) {
            allReady = true;

            for (var i = 0; i < this.state.playerIDList.length; i++) {
                var playerID = this.state.playerIDList[i];

                if (playerID === this.props.userId) { // current user, display button
                    currentUser = this.state.emailList[i];
                    currentPlayerNum = i + 1;
                    
                    if (this.state.playerStatusList[i]) {   // ready
                        rows.push(
                            <tr className="player-table">
                                <td className="player-table">{i+1}.</td>
                                <td className="player-table">{this.state.emailList[i]}</td>
                                <td className="player-table"><input type="button" value={this.state.buttonName} onClick={this.toggleButton} disabled/></td>
                            </tr>
                        );
                    } else {    // not ready
                        allReady = false;
                        rows.push(
                            <tr className="player-table">
                                <td className="player-table">{i+1}.</td>
                                <td className="player-table">{this.state.emailList[i]}</td>
                                <td className="player-table"><input type="button" value={this.state.buttonName} onClick={this.toggleButton} /></td>
                            </tr>
                        );
                    }

                } else {  // display text
                    var text;
                    if (this.state.playerStatusList[i]) {
                        text = "Ready";
                    } else {
                        text = "Waiting..";
                        allReady = false;
                    }
                    rows.push(
                        <tr className="player-table">
                            <td className="player-table">{i+1}.</td>
                            <td className="player-table">{this.state.emailList[i]}</td>
                            <td className="player-table">{text}</td>
                        </tr>
                    );
                }

            } // end for
          }
          return table;
    },

    clickLobby: function(e) {
        console.log('to Lobby');

        gameRef.child(this.props.userId).remove().then((ref) => {

            gameRef.update({
                status: "waiting"
            }).then((ref) => {
                ReactDOM.render(<App />, document.getElementById('root'));
            });
        });
        //return ReactDOM.render(<App />,document.getElementById('root'));
    },

    toGamePlay: function(e) {
        if (allReady) {
            var player = "player" + currentPlayerNum;
            console.log('To game play ' + player + ' ' + this.props.gameId);
            return ReactDOM.render(<GamePlay userId={this.props.userId} gameId={this.props.gameId} playerId={player} userName={currentUser}/>,document.getElementById('root'));
        } else {
            window.alert('Please wait for all players to be ready');
        }
    },

    render: function() {
        // console.log('render waiting room');

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h2>Room : {gameName}</h2>
                    <h3>Current User : {currentUser}</h3>
                </div>
                <p className="App-intro">
                    {this.createTable()}
                </p>
                <br />
                <input type="button" onClick={this.clickLobby} value="Lobby" disabled/>
                <input type="button" onClick={this.toGamePlay} value="Play"/>

            </div>
        );
    }
});
export default WaitRoom;
