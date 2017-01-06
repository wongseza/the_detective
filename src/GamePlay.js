import React, { Component } from 'react';
import tileA from './TileA.png';
import tileB from './TileB.png';
import tileC from './TileC.png';
import tileD from './TileD.png';
import suspectA from './SuspectA.png';
import detectiveA from './DetectiveA.png';
import detectiveB from './DetectiveB.png';
import detectiveC from './DetectiveC.png';
import detectiveD from './DetectiveD.png';
import './GamePlay.css';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config, "gamePlayFirebase");

// Get a reference to the database service

var detectiveMoveMapping = {
  "1N" : "2N,3N,1W,2W",
  "2N" : "3N,4N,1N,1W",
  "3N" : "4N,1E,2N,1N",
  "4N" : "1E,2E,3N,2N",
  "1E" : "2E,3E,4N,3N",
  "2E" : "3E,4E,1E,4N",
  "3E" : "4E,4S,2E,1E",
  "4E" : "4S,3S,3E,2E",
  "1S" : "4W,3W,2S,3S",
  "2S" : "1S,4W,3S,4S",
  "3S" : "2S,1S,4S,4E",
  "4S" : "3S,2S,4E,3E",
  "1W" : "1N,2N,2W,3W",
  "2W" : "1W,1N,3W,4W",
  "3W" : "2W,1W,4W,1S",
  "4W" : "3W,2W,1S,2S"
};

var suspectImgMap = new Object();
var tileSuspectMap = new Object();

var stateMachine = {
  "selectAction" : "swapTile,rotateTile,moveP1D1,moveP1D2,moveP2D1,moveP2D2",
  "rotateTile" : "rotatedTileSelected",
  "swapTile" : "swapTileSrcSelected",
  "swapTileSrcSelected" : "swapTileDestSelected",
  "movedDetective1" : "detectiveSelected",
  "movedDetective2" : "detectiveSelected",
};

var tileValueMapping = {
  "tileA" : tileA,
  "tileB" : tileB,
  "tileC" : tileC,
  "tileD" : tileD
};

var criminal = "";

var tileGuid = {"tileA":{"E":{"next":true,"see":true},"N":{"next":false,"see":true},"S":{"next":false,"see":false},"W":{"next":true,"see":true}},"tileB":{"E":{"next":false,"see":true},"N":{"next":true,"see":true},"S":{"next":true,"see":true},"W":{"next":false,"see":false}},"tileC":{"E":{"next":true,"see":true},"N":{"next":false,"see":false},"S":{"next":false,"see":true},"W":{"next":true,"see":true}},"tileD":{"E":{"next":false,"see":false},"N":{"next":true,"see":true},"S":{"next":true,"see":true},"W":{"next":false,"see":true}}};

var GamePlay = React.createClass({

  getInitialState: function() {
    return {
      count: "loading...",
      items: 0,
      json: "",
      result: "lose",
      tile1x1: tileA,
      player1Detective1: "1N",
      player1Detective2: "2N",
      player2Detective1: "3N",
      player2Detective2: "4N",
      selectedAction: 0,
      movedDetective1: 0,
      movedDetective2: 0,
      message: "",
      turn: "",
      whoTurn: "",
      isAction1Avaliable: true,
      isAction2Avaliable: true,
      isAction3Avaliable: true,
      isAction4Avaliable: true,
      round: 0,
      playerState: "selectAction",
      selectedTile: "5x5", // Initialized to invalid tile id
      selectedTileValue: "tileA",
      selectedTileCurValue: tileA
    };
  },

  randomMovedDetective: function() {
    var detective1 = Math.floor(Math.random() * 2);
    var detective2 = Math.floor(Math.random() * 2);
    var game = firebase.database().ref('games/'+ this.props.gameId);
    game.update({
      movedDetective1: detective1,
      movedDetective2: detective2
    });
  },

  resetAction: function() {
    var game = firebase.database().ref('games/'+ this.props.gameId);
    game.update({
      selectedAction: 0,
      isAction1Avaliable: true,
      isAction2Avaliable: true,
      isAction3Avaliable: true,
      isAction4Avaliable: true,
    });
  },

  initSuspectImgStaticMap: function() {
    console.log("initSuspectImgStaticMap");
    var suspectList = []
    var ids = []
    firebase.database().ref('suspects').once('value').then(function(snapshot) {
      ids = Object.keys(snapshot.val());
      // console.log(ids);
      suspectList = snapshot.val();
      for(var i = 0; i<ids.length; i++) {
        var id = ids[i];
        suspectImgMap[id] = suspectList[id].picture;
      }
      console.log("suspectImgMap >> " +  suspectImgMap);
    // }).then((ref) => {
    //   this.render();
    });
  },

  initTileSuspectMap: function() {
    console.log("initTileSuspectMap");
    firebase.database().ref('games/'+ this.props.gameId + '/board').once('value').then(function(snapshot) {
      var ids = Object.keys(snapshot.val());
      // console.log(ids);
      var tileList = snapshot.val();
      for(var i = 0; i<ids.length; i++) {
        var id = ids[i];
        tileSuspectMap[id] = tileList[id].suspect;
      } // end for
      console.log("tileSuspectMap >> " +  tileSuspectMap);
    // }).then((ref) => {
    //   this.render();
    });
  },

  componentWillMount: function() {
    this.initTileSuspectMap();
    this.initSuspectImgStaticMap();

    // Tile setting
    var tile1x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x1/tile');
    var tile1x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x2/tile');
    var tile1x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x3/tile');
    var tile1x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x4/tile');
    var tile2x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x1/tile');
    var tile2x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x2/tile');
    var tile2x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x3/tile');
    var tile2x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x4/tile');
    var tile3x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x1/tile');
    var tile3x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x2/tile');
    var tile3x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x3/tile');
    var tile3x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x4/tile');
    var tile4x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x1/tile');
    var tile4x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x2/tile');
    var tile4x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x3/tile');
    var tile4x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x4/tile');
    var suspect1x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x1/suspect');
    var suspect1x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x2/suspect');
    var suspect1x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x3/suspect');
    var suspect1x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/1x4/suspect');
    var suspect2x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x1/suspect');
    var suspect2x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x2/suspect');
    var suspect2x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x3/suspect');
    var suspect2x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/2x4/suspect');
    var suspect3x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x1/suspect');
    var suspect3x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x2/suspect');
    var suspect3x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x3/suspect');
    var suspect3x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/3x4/suspect');
    var suspect4x1 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x1/suspect');
    var suspect4x2 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x2/suspect');
    var suspect4x3 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x3/suspect');
    var suspect4x4 = firebase.database().ref('games/'+ this.props.gameId + '/board/4x4/suspect');
    var game = firebase.database().ref('games/'+ this.props.gameId);
    var whoTurn = firebase.database().ref('games/'+ this.props.gameId + '/whoTurn');
    var movedDetective1 = firebase.database().ref('games/'+ this.props.gameId + '/movedDetective1');
    var movedDetective2 = firebase.database().ref('games/'+ this.props.gameId + '/movedDetective2');
    var selectedAction = firebase.database().ref('games/'+ this.props.gameId + '/selectedAction');
    var isAction1Avaliable = firebase.database().ref('games/'+ this.props.gameId + '/isAction1Avaliable');
    var isAction2Avaliable = firebase.database().ref('games/'+ this.props.gameId + '/isAction2Avaliable');
    var isAction3Avaliable = firebase.database().ref('games/'+ this.props.gameId + '/isAction3Avaliable');
    var isAction4Avaliable = firebase.database().ref('games/'+ this.props.gameId + '/isAction4Avaliable');
    var round = firebase.database().ref('games/'+ this.props.gameId + '/round');
    var suspectList = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.playerId + '/suspects');

    if (this.props.playerId === "player1")
    {
      this.generateGameInfo();
      this.resetAction();
    }

    round.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        round: value
      });
      if (this.props.playerId === "player1")
      {
        this.randomMovedDetective();
        this.resetAction();
      }
    }.bind(this))

    

    isAction1Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction1Avaliable: value
      }, function() {
        if (!value)
          document.getElementById("action1").style.backgroundColor = "dimgray";
        else
          document.getElementById("action1").style.backgroundColor = "";
      });
    }.bind(this))

    isAction2Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction2Avaliable: value
      }, function() {
        if (!value)
          document.getElementById("action2").style.backgroundColor = "dimgray";
        else
          document.getElementById("action2").style.backgroundColor = "";
      });
    }.bind(this))

    isAction3Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction3Avaliable: value
      }, function() {
        if (!value)
          document.getElementById("action3").style.backgroundColor = "dimgray";
        else
          document.getElementById("action3").style.backgroundColor = "";
      });
    }.bind(this))

    isAction4Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction4Avaliable: value
      }, function() {
        if (!value)
          document.getElementById("action4").style.backgroundColor = "dimgray";
        else
          document.getElementById("action4").style.backgroundColor = "";
      });
    }.bind(this))

    whoTurn.on('value', function(snapshot) {
      var value = snapshot.val();
      var turn = (this.props.playerId === value) ? "It's your turn!" : "It's your opponent's turn!";
      var message = (this.props.playerId === value) ? "Please select an action." : "Please wait.";
      
      this.setState({
        whoTurn: value,
        turn: turn,
        message: message
      });

    }.bind(this))

    movedDetective1.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        movedDetective1: (value === 0) ? detectiveA : detectiveB
      });
    }.bind(this))

    movedDetective2.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        movedDetective2: (value === 0) ? detectiveC : detectiveD
      });
    }.bind(this))

    selectedAction.on('value', function(snapshot) {
      value = snapshot.val();
      if (value !== 0) {
        this.setState({
          selectedAction: value
        }, function(){
          switch(value)
          {
            case 1:
              this.setState({
                message: "Move Detective 1 is selected."
              });
              break;
            case 2:
              this.setState({
                message: "Move Detective 2 is selected."
              });
              break;
            case 3:
              this.setState({
                message: "Swap is selected."
              });
              break;
            case 4:
              this.setState({
                message: "Rotate is selected."
              });
              break;
          }

          isAction1Avaliable.once('value', function(snapshot) {
            var isAvailable = snapshot.val();
            if (!isAvailable) {
              document.getElementById("action1").style.backgroundColor = "dimgray";
            }
            else if (value === 1) {
              document.getElementById("action1").style.backgroundColor = "lightpink";
            }
            else {
              document.getElementById("action1").style.backgroundColor = "";
            }
          }.bind(this))

          isAction2Avaliable.once('value', function(snapshot) {
            var isAvailable = snapshot.val();
            if (!isAvailable) {
              document.getElementById("action2").style.backgroundColor = "dimgray";
            }
            else if (value === 2) {
              document.getElementById("action2").style.backgroundColor = "lightpink";
            }
            else {
              document.getElementById("action2").style.backgroundColor = "";
            }
          }.bind(this))

          isAction3Avaliable.once('value', function(snapshot) {
            var isAvailable = snapshot.val();
            if (!isAvailable) {
              document.getElementById("action3").style.backgroundColor = "dimgray";
            }
            else if (value === 3) {
              document.getElementById("action3").style.backgroundColor = "lightpink";
            }
            else {
              document.getElementById("action3").style.backgroundColor = "";
            }
          }.bind(this))

          isAction4Avaliable.once('value', function(snapshot) {
            var isAvailable = snapshot.val();
            if (!isAvailable) {
              document.getElementById("action4").style.backgroundColor = "dimgray";
            }
            else if (value === 4) {
              document.getElementById("action4").style.backgroundColor = "lightpink";
            }
            else {
              document.getElementById("action4").style.backgroundColor = "";
            }
          }.bind(this))
        });
      }
    }.bind(this))

    var value = 0;

    suspect1x1.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect1x1: "Dog" + value + ".png"
      }, function(){
        document.getElementById("1x1").style.backgroundColor = "";
      });
    }.bind(this))

    suspect1x2.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect1x2: "Dog" + value + ".png"
      }, function(){
        document.getElementById("1x2").style.backgroundColor = "";
      });
    }.bind(this))

    suspect1x3.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect1x3: "Dog" + value + ".png"
      }, function(){
        document.getElementById("1x3").style.backgroundColor = "";
      });
    }.bind(this))

    suspect1x4.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect1x4: "Dog" + value + ".png"
      }, function(){
        document.getElementById("1x4").style.backgroundColor = "";
      });
    }.bind(this))

    suspect2x1.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect2x1: "Dog" + value + ".png"
      }, function(){
        document.getElementById("2x1").style.backgroundColor = "";
      });
    }.bind(this))

    suspect2x2.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect2x2: "Dog" + value + ".png"
      }, function(){
        document.getElementById("2x2").style.backgroundColor = "";
      });
    }.bind(this))

    suspect2x3.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect2x3: "Dog" + value + ".png"
      }, function(){
        document.getElementById("2x3").style.backgroundColor = "";
      });
    }.bind(this))

    suspect2x4.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect2x4: "Dog" + value + ".png"
      }, function(){
        document.getElementById("2x4").style.backgroundColor = "";
      });
    }.bind(this))

    suspect3x1.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect3x1: "Dog" + value + ".png"
      }, function(){
        document.getElementById("3x1").style.backgroundColor = "";
      });
    }.bind(this))

    suspect3x2.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect3x2: "Dog" + value + ".png"
      }, function(){
        document.getElementById("3x2").style.backgroundColor = "";
      });
    }.bind(this))

    suspect3x3.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect3x3: "Dog" + value + ".png"
      }, function(){
        document.getElementById("3x3").style.backgroundColor = "";
      });
    }.bind(this))

    suspect3x4.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect3x4: "Dog" + value + ".png"
      }, function(){
        document.getElementById("3x4").style.backgroundColor = "";
      });
    }.bind(this))

    suspect4x1.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect4x1: "Dog" + value + ".png"
      }, function(){
        document.getElementById("4x1").style.backgroundColor = "";
      });
    }.bind(this))

    suspect4x2.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect4x2: "Dog" + value + ".png"
      }, function(){
        document.getElementById("4x2").style.backgroundColor = "";
      });
    }.bind(this))

    suspect4x3.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect4x3: "Dog" + value + ".png"
      }, function(){
        document.getElementById("4x3").style.backgroundColor = "";
      });
    }.bind(this))

    suspect4x4.on('value', function(snapshot){
      value = snapshot.val();
      this.setState({
        suspect4x4: "Dog" + value + ".png"
      }, function(){
        document.getElementById("4x4").style.backgroundColor = "";
      });
    }.bind(this))

    suspectList.on('value', function(snapshot) {
      var key = Object.keys(snapshot.val());

      if (this.state.suspect1x1 != undefined) {
        var temp = '0' + this.state.suspect1x1.charAt(4) + this.state.suspect1x1.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect1x1 : "goodDog.png"
          });
        }
      }
      
      if (this.state.suspect1x2 != undefined) {
        var temp = '0' + this.state.suspect1x2.charAt(4) + this.state.suspect1x2.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect1x2 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect1x3 != undefined) {
        var temp = '0' + this.state.suspect1x3.charAt(4) + this.state.suspect1x3.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect1x3 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect1x4 != undefined) {
        var temp = '0' + this.state.suspect1x4.charAt(4) + this.state.suspect1x4.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect1x4 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect2x1 != undefined) {
        var temp = '0' + this.state.suspect2x1.charAt(4) + this.state.suspect2x1.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect2x1 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect2x2 != undefined) {
        var temp = '0' + this.state.suspect2x2.charAt(4) + this.state.suspect2x2.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect2x2 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect2x3 != undefined) {
        var temp = '0' + this.state.suspect2x3.charAt(4) + this.state.suspect2x3.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect2x3 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect2x4 != undefined) {
        var temp = '0' + this.state.suspect2x4.charAt(4) + this.state.suspect2x4.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect2x4 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect3x1 != undefined) {
        var temp = '0' + this.state.suspect3x1.charAt(4) + this.state.suspect3x1.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect3x1 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect3x2 != undefined) {
        var temp = '0' + this.state.suspect3x2.charAt(4) + this.state.suspect3x2.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect3x2 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect3x3 != undefined) {
        var temp = '0' + this.state.suspect3x3.charAt(4) + this.state.suspect3x3.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect3x3 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect3x4 != undefined) {
        var temp = '0' + this.state.suspect3x4.charAt(4) + this.state.suspect3x4.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect3x4 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect4x1 != undefined) {
        var temp = '0' + this.state.suspect4x1.charAt(4) + this.state.suspect4x1.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect4x1 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect4x2 != undefined) {
        var temp = '0' + this.state.suspect4x2.charAt(4) + this.state.suspect4x2.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect4x2 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect4x3 != undefined) {
        var temp = '0' + this.state.suspect4x3.charAt(4) + this.state.suspect4x3.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect4x3 : "goodDog.png"
          });
        }
      }

      if (this.state.suspect4x4 != undefined) {
        var temp = '0' + this.state.suspect4x4.charAt(4) + this.state.suspect4x4.charAt(5);
        
        if (key.indexOf(temp) < 0) {
          this.setState({
            suspect4x4 : "goodDog.png"
          });
        }
      }
     
      
    }.bind(this))



    tile1x1.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile1x1"] = tileA;
          break;
        case "tileB":
          newState["tile1x1"] = tileB;
          break;
        case "tileC":
          newState["tile1x1"] = tileC;
          break;
        case "tileD":
          newState["tile1x1"] = tileD;
          break;
        default:
          newState["tile1x1"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("1x1").style.backgroundColor = "";
      });
    }.bind(this))

    tile1x2.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile1x2"] = tileA;
          break;
        case "tileB":
          newState["tile1x2"] = tileB;
          break;
        case "tileC":
          newState["tile1x2"] = tileC;
          break;
        case "tileD":
          newState["tile1x2"] = tileD;
          break;
        default:
          newState["tile1x2"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("1x2").style.backgroundColor = "";
      });
    }.bind(this))

    tile1x3.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile1x3"] = tileA;
          break;
        case "tileB":
          newState["tile1x3"] = tileB;
          break;
        case "tileC":
          newState["tile1x3"] = tileC;
          break;
        case "tileD":
          newState["tile1x3"] = tileD;
          break;
        default:
          newState["tile1x3"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("1x3").style.backgroundColor = "";
      });
    }.bind(this))

    tile1x4.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile1x4"] = tileA;
          break;
        case "tileB":
          newState["tile1x4"] = tileB;
          break;
        case "tileC":
          newState["tile1x4"] = tileC;
          break;
        case "tileD":
          newState["tile1x4"] = tileD;
          break;
        default:
          newState["tile1x4"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("1x4").style.backgroundColor = "";
      });
    }.bind(this))

    tile2x1.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile2x1"] = tileA;
          break;
        case "tileB":
          newState["tile2x1"] = tileB;
          break;
        case "tileC":
          newState["tile2x1"] = tileC;
          break;
        case "tileD":
          newState["tile2x1"] = tileD;
          break;
        default:
          newState["tile2x1"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("2x1").style.backgroundColor = "";
      });
    }.bind(this))

    tile2x2.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile2x2"] = tileA;
          break;
        case "tileB":
          newState["tile2x2"] = tileB;
          break;
        case "tileC":
          newState["tile2x2"] = tileC;
          break;
        case "tileD":
          newState["tile2x2"] = tileD;
          break;
        default:
          newState["tile2x2"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("2x2").style.backgroundColor = "";
      });
    }.bind(this))

    tile2x3.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile2x3"] = tileA;
          break;
        case "tileB":
          newState["tile2x3"] = tileB;
          break;
        case "tileC":
          newState["tile2x3"] = tileC;
          break;
        case "tileD":
          newState["tile2x3"] = tileD;
          break;
        default:
          newState["tile2x3"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("2x3").style.backgroundColor = "";
      });
    }.bind(this))

    tile2x4.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile2x4"] = tileA;
          break;
        case "tileB":
          newState["tile2x4"] = tileB;
          break;
        case "tileC":
          newState["tile2x4"] = tileC;
          break;
        case "tileD":
          newState["tile2x4"] = tileD;
          break;
        default:
          newState["tile2x4"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("2x4").style.backgroundColor = "";
      });
    }.bind(this))

    tile3x1.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile3x1"] = tileA;
          break;
        case "tileB":
          newState["tile3x1"] = tileB;
          break;
        case "tileC":
          newState["tile3x1"] = tileC;
          break;
        case "tileD":
          newState["tile3x1"] = tileD;
          break;
        default:
          newState["tile3x1"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("3x1").style.backgroundColor = "";
      });
    }.bind(this))

    tile3x2.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile3x2"] = tileA;
          break;
        case "tileB":
          newState["tile3x2"] = tileB;
          break;
        case "tileC":
          newState["tile3x2"] = tileC;
          break;
        case "tileD":
          newState["tile3x2"] = tileD;
          break;
        default:
          newState["tile3x2"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("3x2").style.backgroundColor = "";
      });
    }.bind(this))

    tile3x3.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile3x3"] = tileA;
          break;
        case "tileB":
          newState["tile3x3"] = tileB;
          break;
        case "tileC":
          newState["tile3x3"] = tileC;
          break;
        case "tileD":
          newState["tile3x3"] = tileD;
          break;
        default:
          newState["tile3x3"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("3x3").style.backgroundColor = "";
      });
    }.bind(this))

    tile3x4.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile3x4"] = tileA;
          break;
        case "tileB":
          newState["tile3x4"] = tileB;
          break;
        case "tileC":
          newState["tile3x4"] = tileC;
          break;
        case "tileD":
          newState["tile3x4"] = tileD;
          break;
        default:
          newState["tile3x4"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("3x4").style.backgroundColor = "";
      });
    }.bind(this))

    tile4x1.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile4x1"] = tileA;
          break;
        case "tileB":
          newState["tile4x1"] = tileB;
          break;
        case "tileC":
          newState["tile4x1"] = tileC;
          break;
        case "tileD":
          newState["tile4x1"] = tileD;
          break;
        default:
          newState["tile4x1"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("4x1").style.backgroundColor = "";
      });
    }.bind(this))

    tile4x2.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile4x2"] = tileA;
          break;
        case "tileB":
          newState["tile4x2"] = tileB;
          break;
        case "tileC":
          newState["tile4x2"] = tileC;
          break;
        case "tileD":
          newState["tile4x2"] = tileD;
          break;
        default:
          newState["tile4x2"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("4x2").style.backgroundColor = "";
      });
    }.bind(this))

    tile4x3.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile4x3"] = tileA;
          break;
        case "tileB":
          newState["tile4x3"] = tileB;
          break;
        case "tileC":
          newState["tile4x3"] = tileC;
          break;
        case "tileD":
          newState["tile4x3"] = tileD;
          break;
        default:
          newState["tile4x3"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("4x3").style.backgroundColor = "";
      });
    }.bind(this))

    tile4x4.on('value', function(snapshot) {
      value = snapshot.val();
      var newState = {};
      switch (value) {
        case "tileA":
          newState["tile4x4"] = tileA;
          break;
        case "tileB":
          newState["tile4x4"] = tileB;
          break;
        case "tileC":
          newState["tile4x4"] = tileC;
          break;
        case "tileD":
          newState["tile4x4"] = tileD;
          break;
        default:
          newState["tile4x4"] = tileA;
      }
      this.setState(newState, function(){
        document.getElementById("4x4").style.backgroundColor = "";
      });
    }.bind(this))

    var player1Detective1 = firebase.database().ref('games/'+ this.props.gameId + '/players/player1/detective1');
    var player1Detective2 = firebase.database().ref('games/'+ this.props.gameId + '/players/player1/detective2');

    player1Detective1.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player1Detective1: value
      });
    }.bind(this))

    player1Detective2.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player1Detective2: value
      });
    }.bind(this))

    var player2Detective1 = firebase.database().ref('games/'+ this.props.gameId + '/players/player2/detective1');
    var player2Detective2 = firebase.database().ref('games/'+ this.props.gameId + '/players/player2/detective2');

    player2Detective1.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player2Detective1: value
      });
    }.bind(this))

    player2Detective2.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        player2Detective2: value
      });
    }.bind(this))
  },

  componentWillUnmount: function() {
  },

  resetCellColor: function(){
    var cells = document.getElementsByClassName("DetectiveCell");
    for (var i = 0, len = cells.length; i < len; i++) {
      cells[i].style.backgroundColor = "";
    }

    cells = document.getElementsByClassName("TileCell");
    for (var i = 0, len = cells.length; i < len; i++) {
      cells[i].style.backgroundColor = "";
    }
  },

  resetSelectedTiles: function(){
    var key = "tile" + this.state.selectedTile;
    this.setState({
      [key] : this.state.selectedTileCurValue
    });
    if (this.state.whoTurn === this.props.playerId)
    {
      if (this.state.playerState === "rotateTileSelected") 
      {
        this.setState({
          playerState: "rotateTile"
        }, this.resetCellColor());
      }
      else if (this.state.playerState === "swapTileSrcSelected" || this.state.playerState === "swapTileDestSelected")
      {
        this.setState({
          playerState: "swapTile"
        }, this.resetCellColor());
      }
    }
  },

  clickTile: function(tileId) {
    if (this.state.whoTurn === this.props.playerId) {
      // Select the tile to be rotated
      if (this.state.playerState === "rotateTile") {
        var tileValue = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId + '/tile');
        var value = 0;

        tileValue.once('value', function(snapshot) {
          value = snapshot.val();
        });

        this.setState({
          playerState: "rotateTileSelected",
          selectedTile: tileId,
          selectedTileValue: value,
          selectedTileCurValue: tileValueMapping[value]
        });

        var activeCell = document.getElementById(tileId);
        activeCell.style.backgroundColor = "slategrey";

        return;
      }

      // Change the tile to be rotated
      if (this.state.playerState == "rotateTileSelected" && this.state.selectedTile != tileId) {
        // Reset the previous tile state
        var key = "tile" + this.state.selectedTile;
        var prevTileValue = this.state.selectedTileCurValue;

        this.setState({
          [key] : prevTileValue
        });

        // Keep the current tile state
        var tileValue = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId + '/tile');
        var value = 0;

        tileValue.once('value', function(snapshot) {
          value = snapshot.val();
        });

        this.setState({
          selectedTile: tileId,
          selectedTileValue: value,
          selectedTileCurValue: tileValueMapping[value]
        });

        var cells = document.getElementsByClassName("TileCell");
        for (var i = 0, len = cells.length; i < len; i++) {
          cells[i].style.backgroundColor = "";
        }

        var activeCell = document.getElementById(tileId);
        activeCell.style.backgroundColor = "slategrey";

        return;
      }

      // Keep rotate the same tile
      if (this.state.whoTurn === this.props.playerId && this.state.playerState === "rotateTileSelected" && this.state.selectedTile === tileId) {
        var newValue = 0;
        var newValue2 = tileA;
        var key = "tile" + tileId;

        switch (this.state.selectedTileValue) {
          case "tileA":
            newValue = "tileB";
            newValue2 = tileB;
            break;
          case "tileB":
            newValue = "tileC";
            newValue2 = tileC;
            break;
          case "tileC":
            newValue = "tileD";
            newValue2 = tileD;
            break;
          case "tileD":
            newValue = "tileA";
            newValue2 = tileA;
            break;
          default:
            newValue = "tileA";
            newValue2 = tileA;
        }

        this.setState({
          selectedTileValue: newValue,
          [key]: newValue2
        });

        return;
      }
      //////////

      // Select the tile to be swapped
      if (this.state.playerState === "swapTile") {
        var tileValue = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId + '/tile');
        var value = 0;

        tileValue.once('value', function(snapshot) {
          value = snapshot.val();
        });

        this.setState({
          playerState: "swapTileSrcSelected",
          selectedTile: tileId
        });

        var activeCell = document.getElementById(tileId);
        activeCell.style.backgroundColor = "dimgrey";

        return;
      }

      if (this.state.playerState === "swapTileSrcSelected" && this.state.selectedTile != tileId) {
        var tileValue = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId + '/tile');
        var value = 0;

        tileValue.once('value', function(snapshot) {
          value = snapshot.val();
        });

        this.setState({
          playerState: "swapTileDestSelected",
          selectedDestTile: tileId
        });

        var activeCell = document.getElementById(tileId);
        activeCell.style.backgroundColor = "dimgrey";

        return;
      }
      //////////
    }
  },

  clickDetective: function(id) {
    if (this.state.whoTurn === this.props.playerId) {
      var p1 = this.state.playerState === "movedDetective1";
      var p2 = this.state.playerState === "movedDetective2";

      if (!p1 && !p2) {
        return;
      }

      var d1 = (p1) ? (this.state.movedDetective1 === detectiveA && this.state.player1Detective1 === id) :
               (this.state.movedDetective2 === detectiveC && this.state.player2Detective1 === id);
      var d2 = (p1) ? (this.state.movedDetective1 === detectiveB && this.state.player1Detective2 === id) :
               (this.state.movedDetective2 === detectiveD && this.state.player2Detective2 === id);
      var possibleLoc = [];

      if ( (p1 && (d1 || d2)) || (p2 && (d1 || d2)) ) {
        var player = (p1) ? "player1" : "player2";
        var detective = (d1) ? "detective1" : "detective2";
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        var activeCell = document.getElementById(id);
        activeCell.style.backgroundColor = "slategrey";

        var locations = detectiveMoveMapping[id];
        var loc = locations.split(",");

        for (var i=0,len=loc.length; i<len; i++) {
          if (loc[i] != this.state.player1Detective1 && loc[i] != this.state.player1Detective2 &&
            loc[i] != this.state.player2Detective1 && loc[i] != this.state.player2Detective2) {

            var activeCell = document.getElementById(loc[i]);
            activeCell.style.backgroundColor = "lightgrey";

            possibleLoc.push(loc[i]);
          }
        }

        this.setState({
          selectedPlayer: player,
          selectedDetective: detective,
          playerState: "detectiveSelected",
          possibleLocList: possibleLoc
        });
      }
    }
  },

  clickDetectiveCell: function(id) {
    if (this.state.whoTurn === this.props.playerId) {
      if (this.state.playerState === "detectiveSelected" || this.state.playerState === "detectiveDestSelected") {
        var possibleLoc = this.state.possibleLocList;

        // Reset background color - required if client select the destination multiple times
        for (var i=0,len=possibleLoc.length; i<len; i++) {
          var activeCell = document.getElementById(possibleLoc[i]);
          activeCell.style.backgroundColor = "lightgrey";
        }

        // Set background color for selected cell
        for (var i=0,len=possibleLoc.length; i<len; i++) {
          if (possibleLoc[i] === id) {
            var activeCell = document.getElementById(possibleLoc[i]);
            activeCell.style.backgroundColor = "slategrey";

            this.setState({
              selectedDestDetectiveLoc: id,
              playerState: "detectiveDestSelected"
            });

            return;
          }
        }
      }
    }
  },

  generateGameInfo: function() {
    var boardRef = firebase.database().ref('games/'+ this.props.gameId + '/board');
    var tiles = ['tileA', 'tileB', 'tileC', 'tileD'];
    var suspects = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', 
                    '011', '012', '013', '014', '015', '016'];
    var shuffledSuspects = suspects.sort(function(){return .5 - Math.random()});

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        var key = (i + 1).toString() + "x" + (j + 1).toString();
        boardRef.update({
          [key]: {
            suspect: shuffledSuspects[4 * i + j],
            tile: tiles[Math.floor(Math.random() * 4)]
          }
        });
      }
    }

    var locations = ['1N', '2N', '3N', '4N', '1S', '2S', '3S', '4S', 
                    '1W', '2W', '3W', '4W', '1E', '2E', '3E', '4E'];
    var shuffledLocations = locations.sort(function(){return .5 - Math.random()});

    var player1Ref = firebase.database().ref('games/'+ this.props.gameId + '/players/player1');
    player1Ref.update({
      color: "red",
      detective1: shuffledLocations[0],
      detective2: shuffledLocations[1],
    });

    var player2Ref = firebase.database().ref('games/'+ this.props.gameId + '/players/player2');
    player2Ref.update({
      color: "blue",
      detective1: shuffledLocations[2],
      detective2: shuffledLocations[3],
    });

    var player1SuspectsRef = firebase.database().ref('games/'+ this.props.gameId + '/players/player1/suspects');
    var player2SuspectsRef = firebase.database().ref('games/'+ this.props.gameId + '/players/player2/suspects');
    player1SuspectsRef.remove();
    player2SuspectsRef.remove();

    for (var i = 0; i < 16; i++) {
      var shuffledSuspect = shuffledSuspects[i];
      player1SuspectsRef.update({[shuffledSuspect]: ""});
      player2SuspectsRef.update({[shuffledSuspect]: ""});
    }

    criminal = shuffledSuspects[Math.floor(Math.random() * 16)];
    var gamesRef = firebase.database().ref('games/'+ this.props.gameId);
    gamesRef.update({
      boardSize: 4,
      criminal: criminal,
      numPlayer: 2,
      whoTurn: "player1",
      round: 1
    });
  },

  addPlayer1Detective: function(id) {

    if (this.state.player1Detective1 === id)
      return (<img src={detectiveA} alt="logo" onClick={this.clickDetective.bind(this, id)} />);
    else if (this.state.player1Detective2 === id)
      return (<img src={detectiveB} alt="logo" onClick={this.clickDetective.bind(this, id)} />);
    else
      return ("");
  },

  addPlayer2Detective: function(id) {

    if (this.state.player2Detective1 === id)
      return (<img src={detectiveC} alt="logo" onClick={this.clickDetective.bind(this, id)} />);
    else if (this.state.player2Detective2 === id)
      return (<img src={detectiveD} alt="logo" onClick={this.clickDetective.bind(this, id)} />);
    else
      return ("");
  },
  
  sleep: function(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
        }
      }
  },
  
  resolveSuspectImg: function(tileLoc) {
    console.log("Resolve Suspect Img, tile " + tileLoc);
    var susID = tileSuspectMap[tileLoc];
    console.log("Resolve Suspect Img " + susID + " " + suspectImgMap[susID]);
    return (<img src={suspectImgMap[susID]} className="Suspect-pos" alt="logo" />);
    // return suspectImgMap[susID];
  },

  resolveDetective: function() {
    console.log("resolve detective called");
    var listInTheLight = [];
    firebase.database().ref('games/'+ this.props.gameId).once('value', function(snapshot) {
      var detectives = [snapshot.child('players').child(this.props.playerId).child('detective1').val(),snapshot.child('players').child(this.props.playerId).child('detective2').val()];
        
      for (var dIndex = 0; dIndex < 2; dIndex++) {
        var position = detectives[dIndex].charAt(0);
        var direction = detectives[dIndex].charAt(1);
        
        switch (direction) {
        case "N":
            for (var i = 1; i <= 4; i++) {
            var tile = snapshot.child('board').child(i + 'x' + position).child('tile').val();
            
            if (tileGuid[tile][direction]["see"]) { listInTheLight.push(snapshot.child('board').child(i + 'x' + position).child('suspect').val()); }
            if (!tileGuid[tile][direction]["next"]) { break; }
            }
            break;
        
        case "E":
            for (var i = 4; i >= 1; i--) {
            var tile = snapshot.child('board').child(position + 'x' + i).child('tile').val();
            
            if (tileGuid[tile][direction]["see"]) { listInTheLight.push(snapshot.child('board').child(position + 'x' + i).child('suspect').val()); }
            if (!tileGuid[tile][direction]["next"]) { break; }
            }
            break;
        
        case "S":
            for (var i = 4; i >= 1; i--) {
            var tile = snapshot.child('board').child(i + 'x' + position).child('tile').val();
            
            if (tileGuid[tile][direction]["see"]) { listInTheLight.push(snapshot.child('board').child(i + 'x' + position).child('suspect').val()); }
            if (!tileGuid[tile][direction]["next"]) { break; }
            }
            break;
        
        case "W":
            for (var i = 1; i <= 4; i++) {
            var tile = snapshot.child('board').child(position + 'x' + i).child('tile').val();
            
            if (tileGuid[tile][direction]["see"]) { listInTheLight.push(snapshot.child('board').child(position + 'x' + i).child('suspect').val()); }
            if (!tileGuid[tile][direction]["next"]) { break; }
            }
            break;
        };
      }
      
      console.log (listInTheLight);
    
      // check dark or bright space
      var IsCriminalInBright = (listInTheLight.indexOf(criminal) >= 0);
            
      console.log (criminal);
      console.log (IsCriminalInBright);   
      
      var suspects = ['001', '002', '003', '004', '005', '006', '007', '008', '009', '010', 
                      '011', '012', '013', '014', '015', '016'];
      
      for (var index in suspects) {
        var suspect = suspects[index];
        if (IsCriminalInBright) {
          if (listInTheLight.indexOf(suspect) < 0) {
            console.log (suspect);
            var suspectRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.playerId + '/suspects/' + suspect);
            suspectRef.remove().then(function() {
              console.log("Remove succeeded.")
            })
            .catch(function(error) {
              console.log("Remove failed: " + error.message)
            });
          }
        } else {
          if (listInTheLight.indexOf(suspect) >= 0) {
            console.log (suspect);
            var suspectRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.playerId + '/suspects/' + suspect);
            suspectRef.remove().then(function() {
              console.log("Remove succeeded.")
            })
            .catch(function(error) {
              console.log("Remove failed: " + error.message)
            });
          }
        }
      }
    }.bind(this));
  },

  clickMoveDetective1: function(){
    if (this.state.whoTurn === this.props.playerId && this.state.isAction1Avaliable)
    {
      if (this.state.playerState != "selectAction") {
        // Reset other state
        if (this.state.playerState === "rotateTileSelected") {
          var key = "tile" + this.state.selectedTile;
          var prevTileValue = this.state.selectedTileCurValue;

          this.setState({
            [key]: prevTileValue,
            selectedTile: "5x5",
            selectedTileValue: tileA,
            selectedTileCurValue: tileA
          });
        }
      }

      var game = firebase.database().ref('games/'+ this.props.gameId);
      game.update({
        selectedAction: 1
      });

      if (this.state.playerState != "movedDetective1") {
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        cells = document.getElementsByClassName("TileCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        this.setState({
          playerState: "movedDetective1"
        });
      }
    }
  },

  clickMoveDetective2: function(){
    if (this.state.whoTurn === this.props.playerId && this.state.isAction2Avaliable)
    {
      if (this.state.playerState != "selectAction") {
        // Reset other state
        if (this.state.playerState === "rotateTileSelected") {
          var key = "tile" + this.state.selectedTile;
          var prevTileValue = this.state.selectedTileCurValue;

          this.setState({
            [key]: prevTileValue,
            selectedTile: "5x5",
            selectedTileValue: tileA,
            selectedTileCurValue: tileA
          });
        }
      }

      var game = firebase.database().ref('games/'+ this.props.gameId);
      game.update({
        selectedAction: 2
      });

      if (this.state.playerState != "movedDetective2") {
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        cells = document.getElementsByClassName("TileCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        this.setState({
          playerState: "movedDetective2"
        });
      }
    }
  },

  clickSwap: function(){
    if (this.state.whoTurn === this.props.playerId && this.state.isAction3Avaliable)
    {
      if (this.state.playerState != "selectAction") {
        // Reset other state
        if (this.state.playerState === "rotateTileSelected") {
          var key = "tile" + this.state.selectedTile;
          var prevTileValue = this.state.selectedTileCurValue;

          this.setState({
            [key]: prevTileValue,
            selectedTile: "5x5",
            selectedTileValue: tileA,
            selectedTileCurValue: tileA
          });
        }
      }
      
      var game = firebase.database().ref('games/'+ this.props.gameId);
      game.update({
        selectedAction: 3
      });

      if (this.state.playerState != "swapTile") {
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        cells = document.getElementsByClassName("TileCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        this.setState({
          playerState: "swapTile"
        });
      }
    }
  },

  clickRotate: function(){
    if (this.state.whoTurn === this.props.playerId && this.state.isAction4Avaliable)
    {
      var game = firebase.database().ref('games/'+ this.props.gameId);
      game.update({
        selectedAction: 4
      });

      if (this.state.playerState != "rotateTile") {
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        cells = document.getElementsByClassName("TileCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        this.setState({
          playerState: "rotateTile"
        });
      }
    }
  },

  applyAction: function(){
    if (this.state.whoTurn === this.props.playerId)
    {
      if (this.state.selectedAction === 0)
        alert("Please select an action.");
      else
      {
        // Apply player action
        // Rotate action
        
        if (this.state.playerState === "rotateTile") {
          alert("Please select a tile to rotate.");
          return;
        }
        else if (this.state.playerState === "rotateTileSelected") {
          switch (this.state.selectedTileCurValue)
          {
            case tileA:
              if (this.state.selectedTileValue === "tileA") {
                alert("Please rotate the tile.");
                return;
              }
              break;
            case tileB:
              if (this.state.selectedTileValue === "tileB") {
                alert("Please rotate the tile.");
                return;
              }
              break;
            case tileC:
              if (this.state.selectedTileValue === "tileC") {
                alert("Please rotate the tile.");
                return;
              }
              break;
            case tileD:
              if (this.state.selectedTileValue === "tileD") {
                alert("Please rotate the tile.");
                return;
              }
              break;
          }
          var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + this.state.selectedTile);
          tile.update({
            tile: this.state.selectedTileValue
          })
        }
        // Swap action
        else if (this.state.playerState === "swapTile") {
          alert("Please select an source and destination tiles to swap.");
          return;
        }
        else if (this.state.playerState === "swapTileSrcSelected") {
          alert("Please select an destination tile to swap.");
          return;
        } 
        else if (this.state.playerState === "swapTileDestSelected") {
          var srcTile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + this.state.selectedTile);
          var destTile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + this.state.selectedDestTile);
          var srcTileValue = 0;
          var destTileValue = 0;

          srcTile.once('value', function(snapshot) {
            srcTileValue = snapshot.val();
          }).then((ref) => {

            destTile.once('value', function(snapshot) {
              destTileValue = snapshot.val();
            }).then((ref) => {

              srcTile.update({
                suspect: destTileValue.suspect,
                tile: destTileValue.tile
              });

              destTile.update({
                suspect: srcTileValue.suspect,
                tile: srcTileValue.tile
              });
            });
          });
        }

        // Move detective action
        else if (this.state.playerState === "movedDetective1")
        {
          alert("Please select the destination tile to move the detective.");
          return;
        }
        else if (this.state.playerState === "movedDetective2")
        {
          alert("Please select the destination tile to move the detective.");
          return;
        }
        else if (this.state.playerState === "detectiveSelected") 
        {
          alert("Please select the destination tile to move the detective.");
          return;
        }
        else if (this.state.playerState === "detectiveDestSelected") 
        {
          var cells = document.getElementsByClassName("DetectiveCell");
          for (var i=0,len=cells.length; i<len; i++) {
            cells[i].style.backgroundColor = "";
          }

          var playerRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.state.selectedPlayer);
          playerRef.update({
            [this.state.selectedDetective]: this.state.selectedDestDetectiveLoc
          });
        }
        //////////

        this.setState({
          playerState: "selectAction"
        });

        var game = firebase.database().ref('games/' + this.props.gameId);
        var variable = "None";
        switch(this.state.selectedAction)
        {
          case 1:
            variable = "isAction1Avaliable";
            break;
          case 2:
            variable = "isAction2Avaliable";
            break;
          case 3:
            variable = "isAction3Avaliable";
            break;
          case 4:
            variable = "isAction4Avaliable";
            break;
        }
        if (variable != "None")
        {
          game.update({
            [variable]: false
          }).then(function(){
            game.once('value', function(snapshot) {
              var value = snapshot.val();
              if (value.whoTurn === "player1")
              {
                game.update({
                  whoTurn: "player2"
                });
              }
              else
              {
                game.update({
                  whoTurn: "player1"
                });
              }

              if(!value.isAction1Avaliable && !value.isAction2Avaliable && !value.isAction3Avaliable && !value.isAction4Avaliable)
              {
                this.resolveDetective();

                game.update({
                  round: value.round + 1
                });
              }
            }.bind(this))
          }.bind(this))
        }
      }
    }
  },

  render: function() {
    console.log("=================== Render ===========================")
    return (
      <div className="Board">
        <table>
          <tr>
            <td>
              <table id="GameBoard">
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1N" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "1N")} >
                    {this.addPlayer1Detective.bind(this, "1N")()}
                    {this.addPlayer2Detective.bind(this, "1N")()}
                  </td>
                  <td id="2N" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "2N")} >
                    {this.addPlayer1Detective.bind(this, "2N")()}
                    {this.addPlayer2Detective.bind(this, "2N")()}
                  </td>
                  <td id="3N" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "3N")} >
                    {this.addPlayer1Detective.bind(this, "3N")()}
                    {this.addPlayer2Detective.bind(this, "3N")()}
                  </td>
                  <td id="4N" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "4N")} >
                    {this.addPlayer1Detective.bind(this, "4N")()}
                    {this.addPlayer2Detective.bind(this, "4N")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
                <tr>
                  <td id="1W" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "1W")} >
                    {this.addPlayer1Detective.bind(this, "1W")()}
                    {this.addPlayer2Detective.bind(this, "1W")()}
                  </td>
                  <td id="1x1" className="TileCell">
                    <img src={this.state.tile1x1} alt="logo" onClick={this.clickTile.bind(this, "1x1")} />
                    <img src={this.state.suspect1x1} className="Suspect-pos" onClick={this.clickTile.bind(this, "1x1")} />
                  </td>
                  <td id="1x2" className="TileCell">
                    <img src={this.state.tile1x2} alt="logo" onClick={this.clickTile.bind(this, "1x2")} />
                    <img src={this.state.suspect1x2} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "1x2")} />
                  </td>
                  <td id="1x3" className="TileCell">
                    <img src={this.state.tile1x3} alt="logo" onClick={this.clickTile.bind(this, "1x3")} />
                    <img src={this.state.suspect1x3} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "1x3")} />
                  </td>
                  <td id="1x4" className="TileCell">
                    <img src={this.state.tile1x4} alt="logo" onClick={this.clickTile.bind(this, "1x4")} />
                    <img src={this.state.suspect1x4} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "1x4")} />
                  </td>
                  <td id="1E" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "1E")} >
                    {this.addPlayer1Detective.bind(this, "1E")()}
                    {this.addPlayer2Detective.bind(this, "1E")()}
                  </td>
                </tr>
                <tr>
                  <td id="2W" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "2W")} >
                    {this.addPlayer1Detective.bind(this, "2W")()}
                    {this.addPlayer2Detective.bind(this, "2W")()}
                  </td>
                  <td id="2x1" className="TileCell">
                    <img src={this.state.tile2x1} alt="logo" onClick={this.clickTile.bind(this, "2x1")} />
                    <img src={this.state.suspect2x1} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "2x1")} />
                  </td>
                  <td id="2x2" className="TileCell">
                    <img src={this.state.tile2x2} alt="logo" onClick={this.clickTile.bind(this, "2x2")} />
                    <img src={this.state.suspect2x2} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "2x2")} />
                  </td>
                  <td id="2x3" className="TileCell">
                    <img src={this.state.tile2x3} alt="logo" onClick={this.clickTile.bind(this, "2x3")} />
                    <img src={this.state.suspect2x3} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "2x3")} />
                  </td>
                  <td id="2x4" className="TileCell">
                    <img src={this.state.tile2x4} alt="logo" onClick={this.clickTile.bind(this, "2x4")} />
                    <img src={this.state.suspect2x4} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "2x4")} />
                  </td>
                  <td id="2E" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "2E")} >
                    {this.addPlayer1Detective.bind(this, "2E")()}
                    {this.addPlayer2Detective.bind(this, "2E")()}
                  </td>
                </tr>
                <tr>
                  <td id="3W" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "3W")} >
                    {this.addPlayer1Detective.bind(this, "3W")()}
                    {this.addPlayer2Detective.bind(this, "3W")()}
                  </td>
                  <td id="3x1" className="TileCell">
                    <img src={this.state.tile3x1} alt="logo" onClick={this.clickTile.bind(this, "3x1")} />
                    <img src={this.state.suspect3x1} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "3x1")} />
                  </td>
                  <td id="3x2" className="TileCell">
                    <img src={this.state.tile3x2} alt="logo" onClick={this.clickTile.bind(this, "3x2")} />
                    <img src={this.state.suspect3x2} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "3x2")} />
                  </td>
                  <td id="3x3" className="TileCell">
                    <img src={this.state.tile3x3} alt="logo" onClick={this.clickTile.bind(this, "3x3")} />
                    <img src={this.state.suspect3x3} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "3x3")} />
                  </td>
                  <td id="3x4" className="TileCell">
                    <img src={this.state.tile3x4} alt="logo" onClick={this.clickTile.bind(this, "3x4")} />
                    <img src={this.state.suspect3x4} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "3x4")} />
                  </td>
                  <td id="3E" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "3E")} >
                    {this.addPlayer1Detective.bind(this, "3E")()}
                    {this.addPlayer2Detective.bind(this, "3E")()}
                  </td>
                </tr>
                <tr>
                  <td id="4W" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "4W")} >
                    {this.addPlayer1Detective.bind(this, "4W")()}
                    {this.addPlayer2Detective.bind(this, "4W")()}
                  </td>
                  <td id="4x1" className="TileCell">
                    <img src={this.state.tile4x1} alt="logo" onClick={this.clickTile.bind(this, "4x1")} />
                    <img src={this.state.suspect4x1} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "4x1")} />
                  </td>
                  <td id="4x2" className="TileCell">
                    <img src={this.state.tile4x2} alt="logo" onClick={this.clickTile.bind(this, "4x2")} />
                    <img src={this.state.suspect4x2} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "4x2")} />
                  </td>
                  <td id="4x3" className="TileCell">
                    <img src={this.state.tile4x3} alt="logo" onClick={this.clickTile.bind(this, "4x3")} />
                    <img src={this.state.suspect4x3} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "4x3")} />
                  </td>
                  <td id="4x4" className="TileCell">
                    <img src={this.state.tile4x4} alt="logo" onClick={this.clickTile.bind(this, "4x4")} />
                    <img src={this.state.suspect4x4} className="Suspect-pos" alt="logo" onClick={this.clickTile.bind(this, "4x4")} />
                  </td>
                  <td id="4E" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "4E")} >
                    {this.addPlayer1Detective.bind(this, "4E")()}
                    {this.addPlayer2Detective.bind(this, "4E")()}
                  </td>
                </tr>
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1S" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "1S")} >
                    {this.addPlayer1Detective.bind(this, "1S")()}
                    {this.addPlayer2Detective.bind(this, "1S")()}
                  </td>
                  <td id="2S" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "2S")} >
                    {this.addPlayer1Detective.bind(this, "2S")()}
                    {this.addPlayer2Detective.bind(this, "2S")()}
                  </td>
                  <td id="3S" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "3S")} >
                    {this.addPlayer1Detective.bind(this, "3S")()}
                    {this.addPlayer2Detective.bind(this, "3S")()}
                  </td>
                  <td id="4S" className="DetectiveCell" onClick={this.clickDetectiveCell.bind(this, "4S")} >
                    {this.addPlayer1Detective.bind(this, "4S")()}
                    {this.addPlayer2Detective.bind(this, "4S")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
              </table>
            </td>
            <td className="PlayerInfo">
              <table className="RoundTable">
                <tr><td className="PlayerCell">
                  {this.props.playerId} {this.props.userName}
                </td></tr>
                <tr>
                  <td className="RoundCell">
                    Round {this.state.round}
                  </td>
                </tr>
              </table>
              <table className="ActionTable">
                <tr>
                  <td id="action1" className="ActionCell" onClick={this.clickMoveDetective1}>
                    Move<br/><br/>
                    <img src={this.state.movedDetective1} alt="logo" />
                  </td>
                  <td id="action2" className="ActionCell" onClick={this.clickMoveDetective2}>
                    Move<br/><br/>
                    <img src={this.state.movedDetective2} alt="logo" />
                  </td>
                </tr>
                <tr>
                  <td id="action3" className="ActionCell" onClick={this.clickSwap}>
                    Swap
                  </td>
                  <td id="action4" className="ActionCell" onClick={this.clickRotate}>
                    Rotate
                  </td>
                </tr>
              </table>
              <input type="button" value="Apply Action" className="action-button" onClick={this.applyAction} />
              <input type="button" value="Reset" className="reset-button" onClick={this.resetSelectedTiles} />
              <table className="TurnTable">
                <tr>
                  <td className="TurnCell">
                    {this.state.turn}
                  </td>
                </tr>
              </table>
              <table className="MessageTable">
                <tr>
                  <td className="MessageCell">
                    {this.state.message}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        
        <input type="button" onClick={this.resolveDetective} value="Test Resolve Detective" />
      </div>
    );
  }
});

export default GamePlay;
