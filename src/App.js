import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config);

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
    writeData('' + currentTime.getHours() + ' ' + currentTime.getMinutes() + ' ' + currentTime.getSeconds(), 'aaaa', 'bbbbb');

    var usersRef = firebase.database().ref('users/');
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
    this.firebaseRef.off();
  },

  clickButtonRemoveLast: function(e) {
    var length = Object.keys(this.state.items).length;
    var usersRef = firebase.database().ref('users/' + Object.keys(this.state.items)[length - 1]);
    usersRef.remove();
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
        <input type="button" onClick={this.clickButtonRemoveLast.bind(this)} value="Remove last" />
      </div>
    );
  }
});

export default App;
