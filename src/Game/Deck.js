import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Deck.css'; // Import the CSS file

function Game() {
    const [cards, setCards] = useState([]);
    const [bet, setBet] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [betPlaced, setBetPlaced] = useState(false);
    const [cardsDrawn, setCardsDrawn] = useState(false);
    const [pot, setPot] = useState(0);
    const [playerBalance, setPlayerBalance] = useState(0);
  
    useEffect(() => {
      remainingCards();
    }, []);

  const handleDeckError = (error, originalRequest) => {
    if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
      return axios.post('http://localhost:4444/reshuffle')
        .then(() => originalRequest());
    } else {
      console.error(error);
    }
  };
  
  const drawCards = () => {
    axios.get('http://localhost:4444/draw')
      .then(response => {
        const cards = response.data.cards;
        setCards(cards);
        if (response.data.reshuffled) {
          console.log('The deck was reshuffled');
          // Display a reshuffle message
        }
        setCardsDrawn(true); // Set cardsDrawn to true when cards are drawn
        setBetPlaced(false); // Reset betPlaced to false when new cards are drawn
        remainingCards(); // Update the remaining cards count
      })
      .catch(error => {
        if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
          axios.post('http://localhost:4444/reshuffle')
            .then(() => {
              drawCards(); // Try to draw cards again after reshuffling
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
    if (bet > 0) { // Only proceed if the bet is greater than zero
      setBetPlaced(true); // Set betPlaced to true when the bet button is clicked
    //   setPlayerBalance(playerBalance - bet); // Subtract the bet amount from the player balance
      axios.post('http://localhost:4444/bet', { amount: bet })
        .then(response => {
          const middleIndex = Math.floor(cards.length / 2);
          const firstHalf = cards.slice(0, middleIndex);
          const secondHalf = cards.slice(middleIndex);
          const newCards = [...firstHalf, response.data.card, ...secondHalf];
          setCards(newCards);
          console.log('Card received:', response.data.card); // Log the card
          remainingCards(); // Update the remaining cards count
        })
        .catch(error => {
          handleDeckError(error, betAndDrawCard);
        });
    } else {
      console.log('Bet must be greater than zero'); // Log a message if the bet is not greater than zero
    }
  };
  
  const passAndDrawCards = () => {
    axios.post('http://localhost:4444/pass')
      .then(() => {
        setCardsDrawn(false); // Set cardsDrawn to false to show the "Draw Cards" button
        remainingCards(); // Update the remaining cards count
      })
      .catch(error => {
        console.error(error);
      });
  };

  const remainingCards = () => {
    axios.get('http://localhost:4444/remaining-cards')
      .then(response => {
        setRemaining(response.data.count);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div className="game-container">
      <div className="remaining-cards">
        Remaining cards: {remaining}
      </div>
      <div className="player-balance">
        Player Balance: {playerBalance}
      </div>
      <div className="pot">
        Pot: {pot}
      </div>
      {!cardsDrawn && <button onClick={drawCards}>Draw Cards</button>}
      {cardsDrawn && (
        <>
          <input type="number" value={bet} onChange={e => setBet(e.target.value)} />
          <button onClick={betAndDrawCard} disabled={!bet || betPlaced || bet < 1}>Bet</button>          
          <button onClick={passAndDrawCards}>{betPlaced ? 'Draw' : 'Pass'}</button>        </>
      )}
      <div className="cards-container">
        {cards.map((card, index) => (
          <div key={index} className="card">{card}</div>
        ))}
      </div>
    </div>
  );
}

export default Game;