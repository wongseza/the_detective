import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import App from './App';

// ReactDOM.render(
//   <WaitRoom />,
//   document.getElementById('root')
// );

// class WaitRoom extends React.Component {
//   render() {
//     return <div>This is wait room</div>;
//   }
// }

var WaitRoom = React.createClass({
  render: function() {
    console.log('in waiting room');
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>This is wait room</h2>
        </div>
      </div>
    );
  }
});
export default WaitRoom;
