import React, { useState } from 'react';
import axios from 'axios';
import './Deck.css'; // Import the CSS file

function Game() {
  const [cards, setCards] = useState([]);
  const [bet, setBet] = useState(0);

  const handleDeckError = (error, originalRequest) => {
    if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
      return axios.post('http://localhost:4444/reshuffle')
        .then(() => originalRequest());
    } else {
      console.error(error);
    }
  };
  
  const placeBetAndDrawCards = () => {
    axios.post('http://localhost:4444/place-bet', { amount: bet })
      .then(() => {
        return axios.get('http://localhost:4444/draw');
      })
      .then(response => {
        const cards = response.data.cards;
        setCards(cards);
        if (response.data.reshuffled) {
            console.log('The deck was reshuffled');
            // Display a reshuffle message
        }
    })
      .catch(error => {
        if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
          axios.post('http://localhost:4444/reshuffle')
            .then(() => {
              placeBetAndDrawCards(); // Try to draw cards again after reshuffling
            })
            .catch(reshuffleError => {
              console.error(reshuffleError);
            });
        } else {
          console.error(error);
        }
      });
  };
  
  const betAndDrawCard = () => {
    axios.post('http://localhost:4444/bet', { amount: bet })
      .then(response => {
        const middleIndex = Math.floor(cards.length / 2);
        const firstHalf = cards.slice(0, middleIndex);
        const secondHalf = cards.slice(middleIndex);
        const newCards = [...firstHalf, response.data.card, ...secondHalf];
        setCards(newCards);
        console.log('Card received:', response.data.card); // Log the card
      })
      .catch(error => {
        handleDeckError(error, betAndDrawCard);
      });
  };
  
  const passAndDrawCards = () => {
    axios.post('http://localhost:4444/pass')
      .then(response => {
        setCards(response.data.cards);
      })
      .catch(error => {
        handleDeckError(error, passAndDrawCards);
      });
  };

  return (
    <div className="game-container">
      <input type="number" value={bet} onChange={e => setBet(e.target.value)} />
      <button onClick={placeBetAndDrawCards}>Place Bet and Draw Cards</button>
      <button onClick={betAndDrawCard}>Bet</button>
      <button onClick={passAndDrawCards}>Pass</button>
      <div className="cards-container">
      {cards.map((card, index) => (
        <div key={index} className="card">{card}</div>
      ))}
    </div>
    </div>
  );
}

export default Game;