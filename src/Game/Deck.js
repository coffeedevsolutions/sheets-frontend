import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Deck.css'; // Import the CSS file
import cardImages from './CardImages';
import PlayerForm from './Players/PlayerForm';

function Game() {
    const [cards, setCards] = useState([]);
    const [bet, setBet] = useState(0);
    const [remaining, setRemaining] = useState(0);
    const [betPlaced, setBetPlaced] = useState(false);
    const [cardsDrawn, setCardsDrawn] = useState(false);
    const [players, setPlayers] = useState([]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [betAmount, setBetAmount] = useState(0);
    const [pot, setPot] = useState(0); // Add this line
    const [aceValue, setAceValue] = useState(null); // New state variable for the Ace value
    const [isAce, setIsAce] = useState(false); // New state variable to track if an Ace was drawn
    const isFirstCardAce = cards[0] && cards[0].value && cards[0].value[0] === 'A';

      // This useEffect runs whenever the `cards` state changes
      useEffect(() => {
        if (cards.length === 1 && cards[0].value) {
          const isFirstCardAce = cards[0].value[0] === 'A';
          setIsAce(isFirstCardAce);
        }
      }, [cards]);

    const handleBetAmountChange = (event) => {
      setBetAmount(event.target.value);
  };
  
    useEffect(() => {
      remainingCards();
    }, []);

    // Function to fetch all players
    const fetchAllPlayers = () => {
      axios.get('http://localhost:8080/player/all')
      .then(response => {
          setPlayers(response.data);
      })
      .catch(error => {
          console.error('Error fetching players:', error);
      });
    };
        // Call fetchAllPlayers in a useEffect hook to fetch the players when the component mounts
    useEffect(() => {
      fetchAllPlayers();
    }, []);

    const fetchPot = useCallback(async () => { // Wrap fetchPot with useCallback
      try {
        const response = await axios.get('http://localhost:8080/pot');
        setPot(response.data);
      } catch (error) {
        console.error('Error fetching pot:', error);
      }
    }, []);

  useEffect(() => {
    fetchPot();
  }, [currentPlayerIndex, fetchPot]);
    
  
  const drawCards = () => {
    console.log('drawCards function called'); // Log when drawCards is called
  
    const currentPlayer = players[currentPlayerIndex];
    console.log(`It is ${currentPlayer.name}'s turn`); // Display the current player's name
  
    axios.post('http://localhost:8080/draw', { currentPlayer, players, aceValue })
      .then(response => {
        console.log(response); // Log the response
        if (response.data.error) {
          console.error(response.data.error);
          return;
        }
        const card = response.data.cards[0];
        setCards(prevCards => [...prevCards, card]);
        if (response.data.reshuffled) {
          console.log('The deck was reshuffled');
          // Display a reshuffle message
        }
        setCardsDrawn(true); // Set cardsDrawn to true when cards are drawn
        setBetPlaced(false); // Reset betPlaced to false when new cards are drawn
        remainingCards(); // Update the remaining cards count
  
        // Check if the drawn card is an Ace
        if (response.data.isAce) {
          // Set isAce to true and display a dialog asking the user to select high or low
          setIsAce(true);
        }
      })
  };

  const handleNextPlayer = () => {
    console.log('handleNextPlayer called'); // Log when handleNextPlayer is called
  
    const currentPlayer = players[currentPlayerIndex];
    console.log('Current player:', currentPlayer); // Log the current player
  
    axios.post('http://localhost:8080/nextPlayer', { currentPlayer, players })
      .then(response => {
        const nextPlayer = response.data;
        console.log('Next player:', nextPlayer); // Log the next player
  
        // Find the index of the next player based on their _id
        const nextPlayerIndex = players.findIndex(player => player._id === nextPlayer._id);
        console.log('Next player index:', nextPlayerIndex); // Log the next player index
  
        setCurrentPlayerIndex(nextPlayerIndex);
  
        // Discard the current cards
        setCards([]);
      })
      .catch(error => {
        console.error('Error fetching next player:', error);
      });
  };

  useEffect(() => {
    if (cards.length === 3) {
      // Make a POST request to the /checkWin endpoint to check the result of the game
      axios.post('http://localhost:8080/checkWin', { cards, aceValue })
      .then(response => {
        // Log the result of the game
        console.log('Game result:', response.data.winResult);
      })
      .catch(error => {
        console.error('Error checking win:', error);
      });
    }
  }, [cards, aceValue]);

  const handleBet = () => {
    // Get the current player
    const currentPlayer = players[currentPlayerIndex];
  
    // Make a POST request to the editPlayer endpoint
    axios.put(`http://localhost:8080/player/edit/${currentPlayer._id}`, { betAmount })
    .then(response => {
      // The response should contain the updated player
      const updatedPlayer = response.data;
  
      // Update the players state with the updated player
      setPlayers(prevPlayers => {
        const newPlayers = prevPlayers.map(player => 
          player._id === updatedPlayer._id ? {...updatedPlayer} : {...player}
        );
        return newPlayers;
      });
      fetchPot();
      fetchAllPlayers();
  
      axios.post('http://localhost:8080/bet', { amount: betAmount, cards, aceValue, players, currentPlayer })
      .then(response => {
        // The response should contain the result of the bet, the third card, and the updated player balance and pot
        const { thirdCard, result, playerBalance, pot } = response.data;
      
        // Update the cards state with the third card
        setCards(prevCards => {
          const updatedCards = [prevCards[0], thirdCard, prevCards[1]];
          return updatedCards;
        });
      
        // Update the player balance and pot state
        // TODO: Update playerBalance and pot state based on your state management logic
      
        // Check the result of the bet
        if (result === 'win') {
          // TODO: Handle win logic
        } else if (result === 'lose') {
          // TODO: Handle lose logic
        }
      })
      .catch(error => {
        console.error('Error making bet:', error);
      });
    })
    .catch(error => {
      console.error('Error updating player balance:', error);
    });
  };

  const remainingCards = () => {
    axios.get('http://localhost:8080/remaining-cards')
      .then(response => {
        setRemaining(response.data.count);
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Function to handle Ace value selection
  const handleAceValueSelection = (value) => {
    // Make a POST request to the /setAceValue endpoint to set the Ace value
    axios.post('http://localhost:8080/setAceValue', { aceValue: value })
    .then(response => {
      console.log(response.data.message); // Log the response message
    })
    .catch(error => {
      console.error('Error setting Ace value:', error);
    });

    // Hide the Ace value buttons
    setIsAce(false);
  };


  return (
    <div className="game-container">
      <div className="remaining-cards">
        Remaining cards: {remaining}
      </div>
      <div className="player-balance">
          Player Balance: {players[currentPlayerIndex] ? players[currentPlayerIndex].balance : 'No current players'}
      </div>
      <div className="pot">
        Pot: ${pot}
      </div>
      <button onClick={drawCards}>Draw Cards</button>
      <input type="number" value={betAmount} onChange={handleBetAmountChange} />
      <button onClick={handleBet}>Bet</button>
      {isAce && (
        <div>
          <button onClick={() => handleAceValueSelection('high')}>Ace High</button>
          <button onClick={() => handleAceValueSelection('low')}>Ace Low</button>
        </div>
      )}
      <button onClick={handleNextPlayer}>Pass</button>
      <div className="cards-container">
      {cards.map((card) => {
        return <img className="card-image" src={cardImages[card]} alt={card} key={card} />
      })}
      </div>

      <div>
        <PlayerForm
          players={players}
          setPlayers={setPlayers}
          currentPlayerIndex={currentPlayerIndex}
          fetchAllPlayers={fetchAllPlayers}
        />
      </div>

    </div>
  );
}

export default Game;