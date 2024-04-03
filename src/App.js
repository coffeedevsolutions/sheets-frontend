import React, { useState } from 'react';
import Game from './Game/Game';
import Lobby from './Game/Lobby';
import './App.css';

function App() {
  const [route, setRoute] = useState('/');

  const navigate = (path) => {
    setRoute(path);
  };

  return (
    <div>
      {route === '/' && <Game navigate={navigate} />}
      {route === '/lobby' && <Lobby navigate={navigate} />}
    </div>
  );
}

export default App;