import React, { Component } from 'react';
import './App.css';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config, "ActionFirebase");

// Get a reference to the database service

var Action = React.createClass({

  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: "",
 

    };
  },
  componentWillMount: function() {
    var currentTime = new Date();
    
  },  

  componentWillUnmount: function() {
    //this.firebase.off();
  },

  clickButtonFinish: function(e) {
    return window.location.href = '/index.html';
  },

  clickButtonSelectActionMoveA: function(e) {
    var player = "";
    var ret = "";
    console.log("Action is Move Player1")
    // 0 -> 1
    ret = Math.floor(Math.random() * 2);
    if (ret === 0){
            console.log("select to move1A")
        }
    else{
        console.log("select to move1B")
        }
    },

  clickButtonSelectActionMoveB: function(e) {
    var player = "";
    var ret = "";
    console.log("Action is Move Player1")
    // 0 -> 1
    ret = Math.floor(Math.random() * 2);
    if (ret === 0){
            console.log("select to move2A")
        }
    else{
        console.log("select to move2B")
        }
    },

  clickButtonSelectActionSwap: function(e) {
    var player = "";
        //enable.selectSourceTileOfSwitching(position);
        //disable.selectActionSwitching();
    },
  
  clickButtonSelectActionRotate: function(e) {
    var player = "";
        //enable.selectTileForRotate(tile);
        //disable.selectActionRotate();
    },

  render: function() {
    return (
        <div className="Action">
          <input type="button" onClick={this.clickButtonSelectActionMoveA} value="MoveA" />
          <input type="button" onClick={this.clickButtonSelectActionMoveB} value="MoveB" />
          <input type="button" onClick={this.clickButtonSelectActionSwap} value="Swap" />
          <input type="button" onClick={this.clickButtonSelectActionRotate} value="Rotate" />
          <input type="button" onClick={this.clickButtonFinish} value="Finish" />
        </div>
        
    );
    },
});
export default Action;