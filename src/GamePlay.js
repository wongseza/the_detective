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
      player2Detective2: "4N"
    };
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
    var tile = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId + '/tile');
    console.log(tileId);
    var value = 0;
    var newValue = 0;

    tile.once('value', function(snapshot) {
      value = snapshot.val();

      switch (value) {
        case "tileA":
          newValue = "tileB";
          break;
        case "tileB":
          newValue = "tileC";
          break;
        case "tileC":
          newValue = "tileD";
          break;
        case "tileD":
          newValue = "tileA";
          break;
        default:
          newValue = "tileA";
      }
    });

    var tileValue = firebase.database().ref('games/'+ this.props.gameId + '/board/' + tileId);
    tileValue.update({
      tile: newValue
    })

    return ;
  },

  clickDetectiveTile: function(id) {
    var cells = document.getElementsByClassName("DetectiveCell");

    for (var i=0,len=cells.length; i<len; i++){
      cells[i].style.backgroundColor = "";
    }

    var activeCell = document.getElementById(id);
    activeCell.style.backgroundColor = "lightslategray";
      

    // var cells = document.getElementById('GameBoard').getElementsByTagName('td');

    // for (var i=0,len=cells.length; i<len; i++){
    //   cells[i].onclick = function(){
    //     console.log("Test");
    //     this.style.backgroundColor = "none";
    //   }
    // }
  },

  addplayer1Detective: function(id) {
    console.log("add detective " + id);

    if (this.state.player1Detective1 === id)
      return (<img src={detectiveA} alt="logo" />);
    else if (this.state.player1Detective2 === id)
      return (<img src={detectiveB} alt="logo" />);
    else
      return ("");
  },

  addplayer2Detective: function(id) {
    console.log("add detective " + id);

    if (this.state.player2Detective1 === id)
      return (<img src={detectiveC} alt="logo" />);
    else if (this.state.player2Detective2 === id)
      return (<img src={detectiveD} alt="logo" />);
    else
      return ("");
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
                  <td id="1N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1N")} >
                    {this.addplayer1Detective.bind(this, "1N")()}
                    {this.addplayer2Detective.bind(this, "1N")()}
                  </td>
                  <td id="2N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2N")} >
                    {this.addplayer1Detective.bind(this, "2N")()}
                    {this.addplayer2Detective.bind(this, "2N")()}
                  </td>
                  <td id="3N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3N")} >
                    {this.addplayer1Detective.bind(this, "3N")()}
                    {this.addplayer2Detective.bind(this, "3N")()}
                  </td>
                  <td id="4N" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4N")} >
                    {this.addplayer1Detective.bind(this, "4N")()}
                    {this.addplayer2Detective.bind(this, "4N")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
                <tr>
                  <td id="1W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1W")} >
                    {this.addplayer1Detective.bind(this, "1W")()}
                    {this.addplayer2Detective.bind(this, "1W")()}
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
                  <td id="1E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1E")} >
                    {this.addplayer1Detective.bind(this, "1E")()}
                    {this.addplayer2Detective.bind(this, "1E")()}
                  </td>
                </tr>
                <tr>
                  <td id="2W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2W")} >
                    {this.addplayer1Detective.bind(this, "2W")()}
                    {this.addplayer2Detective.bind(this, "2W")()}
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
                  <td id="2E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2E")} >
                    {this.addplayer1Detective.bind(this, "2E")()}
                    {this.addplayer2Detective.bind(this, "2E")()}
                  </td>
                </tr>
                <tr>
                  <td id="3W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3W")} >
                    {this.addplayer1Detective.bind(this, "3W")()}
                    {this.addplayer2Detective.bind(this, "3W")()}
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
                  <td className="TileCell">
                    <img src={this.state.tile3x4} alt="logo" onClick={this.clickTile.bind(this, "3x4")} />
                    <img src={suspectA} className="Suspect-pos" alt="logo" />
                  </td>
                  <td id="3E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3E")} >
                    {this.addplayer1Detective.bind(this, "3E")()}
                    {this.addplayer2Detective.bind(this, "3E")()}
                  </td>
                </tr>
                <tr>
                  <td id="4W" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4W")} >
                    {this.addplayer1Detective.bind(this, "4W")()}
                    {this.addplayer2Detective.bind(this, "4W")()}
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
                  <td id="4E" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4E")} >
                    {this.addplayer1Detective.bind(this, "4E")()}
                    {this.addplayer2Detective.bind(this, "4E")()}
                  </td>
                </tr>
                <tr>
                  <td className="UnusedCell">
                  </td>
                  <td id="1S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "1S")} >
                    {this.addplayer1Detective.bind(this, "1S")()}
                    {this.addplayer2Detective.bind(this, "1S")()}
                  </td>
                  <td id="2S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "2S")} >
                    {this.addplayer1Detective.bind(this, "2S")()}
                    {this.addplayer2Detective.bind(this, "2S")()}
                  </td>
                  <td id="3S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "3S")} >
                    {this.addplayer1Detective.bind(this, "3S")()}
                    {this.addplayer2Detective.bind(this, "3S")()}
                  </td>
                  <td id="4S" className="DetectiveCell" onClick={this.clickDetectiveTile.bind(this, "4S")} >
                    {this.addplayer1Detective.bind(this, "4S")()}
                    {this.addplayer2Detective.bind(this, "4S")()}
                  </td>
                  <td className="UnusedCell">
                  </td>
                </tr>
              </table>
            </td>
            <td className="PlayerInfo">
              dfjkdf
            </td>
          </tr>
        </table>
      </div>
    );
  }
});

export default GamePlay;
