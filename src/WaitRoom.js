import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import App from './App';

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
var userRef;

var WaitRoom = React.createClass({
  getInitialState: function() {
    return {
      playerTable: "",
      isReady:false,
      buttonName:"Ready now, click to pending"
    };
  },

  toggleButton: function() {
    console.log("toggleButton " + this.state.isReady);

    var player0IdRef = firebase.database().ref('games/' + this.props.gameId + '/players/player0');
    var player1IdRef = firebase.database().ref('games/' + this.props.gameId + '/players/player1');
    var player0Id;
    var player1Id;

    player0IdRef.once('value', function(snapshot) {
      player0Id = snapshot.val();
    }.bind(this))

    player1IdRef.once('value', function(snapshot) {
      player1Id = snapshot.val();
    }.bind(this))

    if (this.props.userId === player0Id.id) {
      player0IdRef.update({
        ready: true,
      });
    } else {
      player1IdRef.update({
        ready: true,
      });
    }

    this.setState({
      isReady: true
    });
  },

  componentWillMount: function() {
    gameRef = firebase.database().ref('games/' + this.props.gameId);
    // userRef = firebase.database().ref('users/' + this.props.userId);
    console.log("reading data from firebase path " + gameRef);
    // console.log("reading data from firebase path " + userRef);
    
    gameRef.on('value',function(snapshot) {
      if (this.isMounted()) {
        var game = snapshot.val();

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

        var playerList = Object.keys(game.players);
        // console.log(playerList);
        var j = 0;
        for(var i = 0 ; i < playerList.length ; i++)
        {
          var player = game.players[playerList[i]];
          console.log(player);

          var email;
          userRef = firebase.database().ref('users/' + player.id);
          console.log("reading data from firebase path " + userRef);
          userRef.on('value',function(snapshot)  {
            email = snapshot.val().email;
          }.bind(this));
          
          
          j++;
          if (player.id === this.props.userId) { // display button
            rows.push(
              <tr className="player-table">
                <td className="player-table">{j}.</td>
                <td className="player-table">{email}</td>
                <td className="player-table"><input type="button" value={this.state.buttonName} onClick={this.toggleButton} /></td>
              </tr>
            );
            
            if (player.isReady) {
              this.setState( {
                playerTable: table,
                isReady:true,
                buttonName:"Ready now, click to pending"
              } );
              
            } else {
              this.setState( {
                playerTable: table,
                isReady:false,
                buttonName:"Pending. Click when ready"
              } );
            }
            
          } else {  // display text
            var text = "Waiting..";
            if (player.isReady) {
              text = "Ready";
            }
            rows.push(
              <tr className="player-table">
                <td className="player-table">{j}.</td>
                <td className="player-table">{email}</td>
                <td className="player-table">{text}</td>
              </tr>
            );
          }
        }
       
        this.setState({
          playerTable: table
        });
      }
    }.bind(this));

    // console.log(this.content);
  },

  componentWillUnmount: function() {
    if (gameRef != null) {
      console.log('unmounting ' + gameRef);
      gameRef.off();
    }
  },

  clickLobby: function(e) {
    console.log('Updating room status + ' + gameRef);

    gameRef.child(this.props.userId).remove().then((ref) => {

    gameRef.update({
      status: "waiting"
    }).then((ref) => {
      ReactDOM.render(<App />,document.getElementById('root'));
    });
    });
    //return ReactDOM.render(<App />,document.getElementById('root'));
  },

  render: function() {
    console.log('in waiting room');
    
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Room : {this.props.gameId}</h2>
          <h3>UserID : {this.props.userId}</h3>
        </div>
        <p className="App-intro">
          {this.state.playerTable}
        </p>
        <br/>
        <input type="button" onClick={this.clickLobby} value="Lobby" />

      </div>
    );
  }
});
export default WaitRoom;
