import logo from './logo.svg';
import './App.css';
import React from 'react';

function App() {
  const [admin, isAdmin] = React.useState(false);

  // identifical to an axios request. I was just too lazy to install axios so I used fetch
  var getReq = async () => {
    var response = await fetch('http://localhost:8000/isauth', {credentials: 'include'});
    var data = await response.json();
    console.log(data);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Test</p>
        <p>{admin ? "IS ADMIN" : "IS NOT ADMIN"}</p>
        <a href="http://localhost:8000/google" style={ {color: "#5555ff" }}>Authenticate with Google</a>
        <button onClick={getReq} style={ {color: "#5555ff" }}>Make Auth Check</button>
      </header>
    </div>
  );

}

export default App;
