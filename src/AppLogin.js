import React from 'react';
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

var AppLogin = React.createClass({

  getInitialState: function() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "lobby.html";
        } else {
            return this.render();
        }
    });
  },

  clickButtonLogin: function(e) {
    // Get elements
    var txtEmail = document.getElementById('txtEmail');
    var txtPassword = document.getElementById('txtPassword');
    
    // Get email and password
    var email = txtEmail.value;
    var password = txtPassword.value;
    var auth = firebase.auth();
    // Sign in
    var promise = auth.signInWithEmailAndPassword(email, password);
    promise.catch(e => alert(e.message));

    auth.onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "lobby.html";
        }
    });
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
    promise.catch(e => console.log(e.message));
  },

  render: function() {
    return (
        <div className="AppLogin">
            <input id="txtEmail" type="email" placeholder="Email"/>
            
            <input id="txtPassword" type="password" placeholder="Password"/>
            
            <input type="button" onClick={this.clickButtonLogin} value="Log in" />
            <input type="button" onClick={this.clickButtonSignup} value="Sign up" />
            
        </div>
    );
  }
});

export default AppLogin;
