import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyDcPiRj8GoAflVFP8aOCMY4UUYWHRoRmkE",
    authDomain: "the-detective.firebaseapp.com",
    databaseURL: "https://the-detective.firebaseio.com",
    storageBucket: "the-detective.appspot.com",
    messagingSenderId: "551652425284"
  };
  firebase.initializeApp(config, "AppLogin");

var AppLogin = React.createClass({

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
        usersRef = firebase.database().ref('users/' + uid);
        usersRef.set({
            username: displayName,
            email: email,
        });
        ReactDOM.render(<p>Lobby</p>, document.getElementById('root'))
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
