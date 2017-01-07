import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Lobby from './Lobby';

var firebase = require("firebase");
var config = {
  apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
  authDomain: "the-detective.firebaseapp.com",
  databaseURL: "https://the-detective.firebaseio.com",
  storageBucket: "the-detective.appspot.com",
  messagingSenderId: "551652425284"
};
firebase.initializeApp(config);

var App = React.createClass({

  clickButtonLogin: function(e) {
    var auth = firebase.auth();
    var usersRef;
    
    // Clear Old User State
    var oldUser = auth.currentUser;
    if (oldUser != null) {
        var oldUid = oldUser.uid;
        usersRef = firebase.database().ref('users/' + oldUid);
        usersRef.remove();
    }
    
    // Force signout
    auth.signOut()
    
    // Get elements
    var txtEmail = document.getElementById('txtEmail');
    var txtPassword = document.getElementById('txtPassword');
    
    // Get email and password
    var email = txtEmail.value;
    var password = txtPassword.value;
    
    // Sign in
    var promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => alert(e.message));
    
    var user = auth.currentUser;
    if (user != null) {
        var uid = user.uid;
        var displayName = user.displayName;
        email = user.email;
        usersRef = firebase.database().ref('users/' + uid);
        usersRef.set({
            username: displayName,
            email: email,
        });
        ReactDOM.render(<Lobby userId={uid}/>, document.getElementById('root'))
    }
    
  },
  
  clickButtonSignup: function(e) {
    // Get elements
    var txtEmail = document.getElementById('txtEmail');
    var txtPassword = document.getElementById('txtPassword');
    
    // Get email and password
    var email = txtEmail.value;
    var password = txtPassword.value;
    var auth = firebase.auth();
    // Sign in
    var promise = auth.createUserWithEmailAndPassword(email, password);
    promise.catch(e => alert(e.message));
  },
  
  sleep: function(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
        }
      }
  },

  render: function() {
    return (
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to The Detective</h2>
          </div>
          <div className="App">
              <table className="App-login">
                  <tr>
                      <td className="App-login-header">Email : </td>
                      <td><input id="txtEmail" type="email" placeholder="Email" /></td>
                  </tr>
                  <tr>
                      <td className="App-login-header">Password : </td>
                      <td><input id="txtPassword" type="password" placeholder="Password" /></td>
                  </tr>
                  <tr>
                      <td></td>
                      <td>
                          <input className="App-login-button" type="button" onClick={this.clickButtonLogin} value="Log in" />
                          <input className="App-login-button" type="button" onClick={this.clickButtonSignup} value="Sign up" />
                      </td>
                  </tr>
                  <tr>
                      <td className="App-login-note">
                      - Enter email and password before click Log in or Sign up<br/>
                      - Password should be at least 6 characters<br/>
                      - If you have problem, please contact someone that know
                      </td>
                  </tr>
              </table>
          </div>
        </div>
        );
  }
});

export default App;
