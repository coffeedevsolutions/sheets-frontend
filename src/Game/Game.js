// import React, { useState } from 'react';
// import axios from 'axios';
// import Lobby from './Lobby';

// function Game() {
//   const [gameCreated, setGameCreated] = useState(false);
//   const [accessCode, setAccessCode] = useState(null);
//   const [displayName, setDisplayName] = useState('');

//     // Function to create a new game
//     const createGame = () => {
//         axios.post('http://localhost:4444/create')
//             .then(response => {
//                 // Update access code state
//                 setAccessCode(response.data);
//             })
//             .catch(error => {
//                 console.error(error);
//             });
//         setGameCreated(true);
//     };

//   // Function to join a game
//   const joinGame = (event) => {
//     event.preventDefault(); // Prevent form from causing a page refresh
  
//     const accessCode = event.target.elements.accessCode.value;
  
//     axios.post('http://localhost:4444/join', { accessCode })
//       .then(response => {
//         setAccessCode(response.data);
//         setGameCreated(true);
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   };

//   // Function to handle display name form submission
//   const handleDisplayNameSubmit = (event) => {
//     event.preventDefault();
//     setDisplayName(event.target.elements.displayName.value);
//   };

//   if (gameCreated) {
//     if (displayName) {
//       return <Lobby accessCode={accessCode} displayName={displayName} />;
//     } else {
//       return (
//         <form onSubmit={handleDisplayNameSubmit}>
//           <label>
//             Display Name:
//             <input type="text" name="displayName" required />
//           </label>
//           <button type="submit">Submit</button>
//         </form>
//       );
//     }
//   }

//       return (
//         <div>
//           <button onClick={createGame}>Create Game</button>
//           <form onSubmit={joinGame}>
//             <label>
//               Access Code:
//               <input type="text" name="accessCode" />
//             </label>
//             <button type="submit">Join Game</button>
//           </form>
//         </div>
//       );
//     }

// export default Game;

import React from 'react';

const Game = () => {
    return (
        <div>
            <h1>Game</h1>
        </div>
    );
}

export default Game;