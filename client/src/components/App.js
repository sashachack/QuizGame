// import '../App.css';
import React, { useState, useEffect } from 'react';
import GlobalContext from './GlobalContext';
import Page from './Page'
// import '../../public/index.html';
import io from 'socket.io-client';
// const io = require('socket.io-client');

// const socket = io.connect('http://localhost:5000');
const socket = io.connect('http://172.27.123.188:5000');

// const socket = io();

function App() {
  const [page, setPage] = useState('start');
  const contextInfo = { page, setPage, socket };

  useEffect(() => {
    socket.on('connect', () => {
      console.log("connected to server");
    });
  }, []);

  return (
    <div>
      <GlobalContext.Provider value={contextInfo}>
        <Page />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
