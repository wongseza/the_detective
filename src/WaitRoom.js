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



var WaitRoom = React.createClass({
  getInitialState: function() {
    return {
      gameList: ""
    };
  },

  componentWillMount: function() {
    console.log("reading data from firebase");
    var gameRef = firebase.database().ref('games/');
    gameRef.on('value',function(snapshot) {
      if (this.isMounted()) {
        this.setState({
          gameList: JSON.stringify(snapshot.val())
        });
      }
    }.bind(this));

    // console.log(this.content);
  },

  componentWillUnmount: function() {
    console.log('unmounting..');
    // this.firebase.off();
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
          <h2>This is wait room</h2>
        </div>
        <p className="App-intro">
          Avaliable Room  <br/>
          {this.state.gameList}
        </p>
        <br/>
        <input type="button" onClick={this.clickLobby} value="Lobby" />

      </div>
    );
  }
});
export default WaitRoom;
