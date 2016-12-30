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

var stateMachine = {
  "selectAction" : "moveTile,rotateTile,moveP1D1,moveP1D2,moveP2D1,moveP2D2",
  "rotateTile" : "rotatedTileSelected",
  "moveTile" : "srcMoveTileSelected,",
  "srcMoveTileSelected" : "selectAction, randomAction",
  "randomAction" : "selectAction",
  "rotateTile" : "srcRotateTileSelected",
  "srcRotateTileSelected" : "selectAction, randomAction",
  "moveP1D1" : "P1D1Selected",
  "P1D1Selected" : "selectAction, randomAction"
};

var tileValueMapping = {
  "tileA" : tileA,
  "tileB" : tileB,
  "tileC" : tileC,
  "tileD" : tileD
};

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

  componentWillMount: function() {
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

    if (this.props.playerId === "player1")
    {
      this.generateGameInfo();
    }
    this.resetAction();

    round.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        round: value
      });
      if (this.props.playerId === "player1")
      {
        this.randomMovedDetective();
      }
      this.resetAction();
    }.bind(this))

    isAction1Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction1Avaliable: value
      });
      if (!value)
        document.getElementById("action1").style.backgroundColor = "dimgray";
    }.bind(this))

    isAction2Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction2Avaliable: value
      });
      if (!value)
        document.getElementById("action2").style.backgroundColor = "dimgray";
    }.bind(this))

    isAction3Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction3Avaliable: value
      });
      if (!value)
        document.getElementById("action3").style.backgroundColor = "dimgray";
    }.bind(this))

    isAction4Avaliable.on('value', function(snapshot) {
      value = snapshot.val();
      this.setState({
        isAction4Avaliable: value
      });
      if (!value)
        document.getElementById("action4").style.backgroundColor = "dimgray";
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
      this.setState({
        selectedAction: value
      });

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

      for (var i = 0; i < 4; i++)
      {
        document.getElementById("action" + (i + 1).toString()).style.backgroundColor = (i + 1 === value) ? "lightpink" : "white";
      }

      if (!this.state.isAction1Avaliable)
        document.getElementById("action1").style.backgroundColor = "dimgray";
      if (!this.state.isAction2Avaliable)
        document.getElementById("action2").style.backgroundColor = "dimgray";
      if (!this.state.isAction3Avaliable)
        document.getElementById("action3").style.backgroundColor = "dimgray";
      if (!this.state.isAction4Avaliable)
        document.getElementById("action4").style.backgroundColor = "dimgray";

    }.bind(this))

    var value = 0;

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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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
      this.setState(newState);
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

  clickTile: function(tileId) {
    if (this.state.whoTurn === this.props.playerId) {
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

        return;
      }

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

        return;
      }

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
      }
    }
  },

  clickDetective: function(id) {
    if (this.state.whoTurn === this.props.playerId) {
      if ( (this.state.playerState === "movedDetective1" &&
        ((this.state.movedDetective1 === detectiveA && this.state.player1Detective1 === id) ||
        (this.state.movedDetective1 === detectiveB && this.state.player1Detective2 === id))) ||
        (this.state.playerState === "movedDetective2" &&
        ((this.state.movedDetective2 === detectiveC && this.state.player2Detective1 === id) ||
        (this.state.movedDetective2 === detectiveD && this.state.player2Detective2 === id))) ) {

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
          }
        }
      }
    }
    

    // var cells = document.getElementById('GameBoard').getElementsByTagName('td');

    // for (var i=0,len=cells.length; i<len; i++){
    //   cells[i].onclick = function(){
    //     console.log("Test");
    //     this.style.backgroundColor = "none";
    //   }
    // }
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

    var gamesRef = firebase.database().ref('games/'+ this.props.gameId);
    gamesRef.update({
      boardSize: 4,
      criminal: shuffledSuspects[Math.floor(Math.random() * 16)],
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
  
  resolveDetective: function() {
    var listInTheLight = [];
    //var detective1 = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.player + '/detective1').val();
    //var detective2 = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.player + '/detective2').val();
    var detective1 = '3N';
    var detective2 = '4W';

    listInTheLight.concat(this.resolvePerDetective(detective1));
    listInTheLight.concat(this.resolvePerDetective(detective2));
    // check dark or bright space
    //var criminal = firebase.database().ref('games/'+ this.props.gameId + '/criminal').val();;
    var criminal = '007';
    var IsCriminalInBright = (listInTheLight.indexOf(criminal) >= 0);

    //var suspectsRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.player + '/suspects');
    var suspects = ["005", "004", "007", "003", "015", "020", "019", "016", "011", "014", "001", "010", "009", "006", "002", "012"];
    for (var suspect in suspects) {
      if (IsCriminalInBright) {
        if (listInTheLight.indexOf(suspect) < 0) {
          //var suspectRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.player + '/suspects/' + suspect).remove();
        }
      } else {
        if (listInTheLight.indexOf(suspect) >= 0) {
          //var suspectRef = firebase.database().ref('games/'+ this.props.gameId + '/players/' + this.props.player + '/suspects/' + suspect).remove();
        }
      }
    }
  },
  
  resolvePerDetective: function(detective) {
    var listInTheLight = [];
    var position = detective.charAt(0);
    var direction = detective.charAt(1);

    switch (direction) {
    case "N":
      for (var i = 1; i <= 4; i++) {
        //var suspect = firebase.database().ref('games/'+ this.props.gameId + '/board/' + i + 'x' + position + '/suspect').val();
        //var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + i + 'x' + position + '/tile').val();
        var suspect = i + 'x' + position;
        var tile = 'tileA';
        //var see = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/see').val();
        //var next = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/next').val();
        var see = true;
        var next = true;
        if (see) { listInTheLight.push(suspect); }
        if (!next) { break; }
      }
      break;
    case "E":
      for (i = 4; i >= 1; i--) {
        //var suspect = firebase.database().ref('games/'+ this.props.gameId + '/board/' + position + 'x' + i + '/suspect').val();
        //var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + position + 'x' + i + '/tile').val();
        var suspect = position + 'x' + i;
        var tile = 'tileB';
        //var see = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/see').val();
        //var next = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/next').val();
        var see = true;
        var next = true;
        if (see) { listInTheLight.push(suspect); }
        if (!next) { break; }
      }
      break;
    case "S":
      for (i = 4; i >= 1; i--) {
        //var suspect = firebase.database().ref('games/'+ this.props.gameId + '/board/' + i + 'x' + position + '/suspect').val();
        //var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + i + 'x' + position + '/tile').val();
        var suspect = i + 'x' + position;
        var tile = 'tileC';
        //var see = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/see').val();
        //var next = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/next').val();
        var see = true;
        var next = true;
        if (see) { listInTheLight.push(suspect); }
        if (!next) { break; }
      }
      break;
    case "W":
      for (i = 1; i <= 4; i++) {
        //var suspect = firebase.database().ref('games/'+ this.props.gameId + '/board/' + position + 'x' + i + '/suspect').val();
        //var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + position + 'x' + i + '/tile').val();
        var suspect = position + 'x' + i;
        var tile = 'tileD';
        //var see = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/see').val();
        //var next = firebase.database().ref('tiles/'+ tile + '/' + direction + '/' + '/next').val();
        var see = true;
        var next = true;
        if (see) { listInTheLight.push(suspect); }
        if (!next) { break; }
      }
      break;
    }
    return listInTheLight;
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

      if (this.state.playerState != "swap") {
        var cells = document.getElementsByClassName("DetectiveCell");

        for (var i=0,len=cells.length; i<len; i++) {
          cells[i].style.backgroundColor = "";
        }

        this.setState({
          playerState: "swap"
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
        if (this.state.playerState === "rotateTileSelected") {
          console.log("Apply tile " + this.state.selectedTile + " " + this.state.selectedTileValue)

          var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + this.state.selectedTile);
          tile.update({
            tile: this.state.selectedTileValue
          })
        }
        //////////

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
                game.update({
                  round: value.round + 1
                });
              }
            });
          });
        }
      }
    }
  },

  render: function() {
    return (
      <div className="Board">
        <table>
          <tr>
            <td>
              <table id="GameBoard">
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1N" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "1N")()}
                    {this.addPlayer2Detective.bind(this, "1N")()}
                  </td>
                  <td id="2N" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "2N")()}
                    {this.addPlayer2Detective.bind(this, "2N")()}
                  </td>
                  <td id="3N" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "3N")()}
                    {this.addPlayer2Detective.bind(this, "3N")()}
                  </td>
                  <td id="4N" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "4N")()}
                    {this.addPlayer2Detective.bind(this, "4N")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
                <tr>
                  <td id="1W" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "1W")()}
                    {this.addPlayer2Detective.bind(this, "1W")()}
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile1x1} alt="logo" onClick={this.clickTile.bind(this, "1x1")}/>
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile1x2} alt="logo" onClick={this.clickTile.bind(this, "1x2")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile1x3} alt="logo" onClick={this.clickTile.bind(this, "1x3")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile1x4} alt="logo" onClick={this.clickTile.bind(this, "1x4")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="1E" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "1E")()}
                    {this.addPlayer2Detective.bind(this, "1E")()}
                  </td>
                </tr>
                <tr>
                  <td id="2W" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "2W")()}
                    {this.addPlayer2Detective.bind(this, "2W")()}
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile2x1} alt="logo" onClick={this.clickTile.bind(this, "2x1")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile2x2} alt="logo" onClick={this.clickTile.bind(this, "2x2")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile2x3} alt="logo" onClick={this.clickTile.bind(this, "2x3")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile2x4} alt="logo" onClick={this.clickTile.bind(this, "2x4")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="2E" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "2E")()}
                    {this.addPlayer2Detective.bind(this, "2E")()}
                  </td>
                </tr>
                <tr>
                  <td id="3W" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "3W")()}
                    {this.addPlayer2Detective.bind(this, "3W")()}
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile3x1} alt="logo" onClick={this.clickTile.bind(this, "3x1")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile3x2} alt="logo" onClick={this.clickTile.bind(this, "3x2")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile3x3} alt="logo" onClick={this.clickTile.bind(this, "3x3")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="3x4" className="TileCell">
                    <img src={this.state.tile3x4} alt="logo" onClick={this.clickTile.bind(this, "3x4")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="3E" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "3E")()}
                    {this.addPlayer2Detective.bind(this, "3E")()}
                  </td>
                </tr>
                <tr>
                  <td id="4W" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "4W")()}
                    {this.addPlayer2Detective.bind(this, "4W")()}
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile4x1} alt="logo" onClick={this.clickTile.bind(this, "4x1")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile4x2} alt="logo" onClick={this.clickTile.bind(this, "4x2")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile4x3} alt="logo" onClick={this.clickTile.bind(this, "4x3")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td className="TileCell">
                    <img src={this.state.tile4x4} alt="logo" onClick={this.clickTile.bind(this, "4x4")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="4E" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "4E")()}
                    {this.addPlayer2Detective.bind(this, "4E")()}
                  </td>
                </tr>
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1S" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "1S")()}
                    {this.addPlayer2Detective.bind(this, "1S")()}
                  </td>
                  <td id="2S" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "2S")()}
                    {this.addPlayer2Detective.bind(this, "2S")()}
                  </td>
                  <td id="3S" className="DetectiveCell" >
                    {this.addPlayer1Detective.bind(this, "3S")()}
                    {this.addPlayer2Detective.bind(this, "3S")()}
                  </td>
                  <td id="4S" className="DetectiveCell" >
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
      </div>
    );
  }
});

export default GamePlay;
