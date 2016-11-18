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
      buttonName:"Ready"
    };
  },

  toggleButton: function() {
    console.log("toggleButton " + this.state.isReady);
    if (this.state.isReady) {
      this.setState( {
        isReady:false,
        buttonName:"Not Ready"
      } );
    } else {
      this.setState( {
        isReady:true,
        buttonName:"Ready"
      } );
    }
  },

  componentWillMount: function() {
    var firebasePath = 'games/' + this.props.gameId;
    gameRef = firebase.database().ref(firebasePath);
    // userRef = firebase.database().ref(firebasePath + '/players/' + this.props.userId);
    console.log("reading data from firebase path " + gameRef);
    console.log("reading data from firebase path " + userRef);
    
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
          
          j++;
          if (player.id === this.props.userId) { // display button
            rows.push(
              <tr className="player-table">
                <td className="player-table">{j}.</td>
                <td className="player-table">{player.id}</td>
                <td className="player-table"><input type="button" value={this.state.buttonName} onClick={this.toggleButton} /></td>
              </tr>
            );
            
            if (player.isReady) {
              this.setState( {
                playerTable: table,
                isReady:true,
                buttonName:"Ready"
              } );
              
            } else {
              this.setState( {
                playerTable: table,
                isReady:false,
                buttonName:"Ready"
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
                <td className="player-table">{player.id}</td>
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
    console.log('click Lobby button');
    return ReactDOM.render(<App />,document.getElementById('root'));
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
