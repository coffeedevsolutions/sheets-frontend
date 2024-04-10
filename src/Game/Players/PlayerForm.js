import React, { useState, useEffect } from 'react';
import './PlayerForm.css';
import axios from 'axios';

function PlayerForm({ players, setPlayers, currentPlayerIndex, props }) {
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false); // New state variable

    // Inside PlayerForm component
    useEffect(() => {
        if (players[currentPlayerIndex]) {
            console.log('useEffect hit, updating balance');
            setBalance(players[currentPlayerIndex].balance);
        }
    }, [players, currentPlayerIndex]);

    const handleAddPlayerClick = () => {
        setIsFormVisible(true);
    };

    const handleCloseFormClick = () => {
        setIsFormVisible(false);
    };



    const addPlayer = (name, balance) => {
        axios.post('http://Localhost:8080/player/add', {
            name: name,
            balance: balance
        })
        .then(response => {
            console.log('Player added:', response.data);
            props.fetchAllPlayers(); // Fetch the players again after adding a new player
            setName(''); // Clear the name field
            setBalance(''); // Clear the balance field
        })
        .catch(error => {
            console.error('Error adding player:', error);
        });
    };

    return (
        <div className='playerFormContainer' >
        {isFormVisible ? (
            <div className='playerForm'>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    addPlayer(name, balance);
                }}>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                    <input type="number" value={balance} onChange={e => setBalance(e.target.value)} />
                    <button type="submit">Add Player</button>
                </form>
            </div>
        ) : (
            <div>
                <button className='addPlayerButton' onClick={handleAddPlayerClick}>+ Add player</button>
            </div>

        )}
        <div className='playerList'>
        {players.map((player, index) => {
        return (
            <div className={`player ${index === currentPlayerIndex ? 'current-player' : ''}`} key={index}>
            <p className='playerName'>{player.name}</p>
            <p className='playerBalance'>$ {player.balance}</p>
            </div>
        );
        })}
        </div>

        </div>
    );
}

export default PlayerForm;