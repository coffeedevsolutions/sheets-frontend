import React from 'react';

function Lobby({ accessCode, displayName }) {
    return (
        <div>
            <h1>Lobby</h1>
            <p>Access Code: {accessCode}</p>
            <p>Display Name: {displayName}</p>
            <p>Waiting for players to join...</p>
        </div>
    );
}

export default Lobby;