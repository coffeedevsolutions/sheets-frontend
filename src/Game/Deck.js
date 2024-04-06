import React, { useState, useEffect } from 'react';
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
    const [limbo, setLimbo] = useState(0);
    const [betAmount, setBetAmount] = useState(0);


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

  //   const increaseBalance = (name, amount) => {
  //     const newPlayers = players.map(player => {
  //         if (player.name === name) {
  //             return { ...player, balance: player.balance + amount };
  //         } else {
  //             return player;
  //         }
  //     });
  //     setPlayers(newPlayers);
  // };

  // const decreaseBalance = (name, amount) => {
  //     const newPlayers = players.map(player => {
  //         if (player.name === name) {
  //             return { ...player, balance: player.balance - amount };
  //         } else {
  //             return player;
  //         }
  //     });
  //     setPlayers(newPlayers);
  // };

  // const handleDeckError = (error, originalRequest) => {
  //   if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
  //     return axios.post('http://localhost:8080/reshuffle')
  //       .then(() => originalRequest());
  //   } else {
  //     console.error(error);
  //   }
  // };
  
  const drawCards = () => {
    console.log('drawCards function called'); // Log when drawCards is called

    const currentPlayer = players[currentPlayerIndex];
    console.log(`It is ${currentPlayer.name}'s turn`); // Display the current player's name

    axios.post('http://localhost:8080/draw', { numCards: 2, currentPlayer, players })
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
      // .catch(error => {
      //   if (error.response && error.response.data === 'No more cards left in the deck or the discard pile') {
      //     axios.post('http://localhost:8080/reshuffle')
      //       .then(() => {
      //         drawCards(); // Try to draw cards again after reshuffling
      //       })
      //       .catch(reshuffleError => {
      //         console.error(reshuffleError);
      //       });
      //   } else {
      //     console.error(error);
      //   }
      // });
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
        })
        .catch(error => {
            console.error('Error fetching next player:', error);
        });
};

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
      })
      .catch(error => {
          console.error('Error updating player balance:', error);
      });
};

  // const nextPlayer = () => {
  //   axios.get('http://localhost:8080/player/next')
  //     .then(response => {
  //       const nextPlayer = response.data;
  //       console.log(`It is now ${nextPlayer.name}'s turn. Their balance is ${nextPlayer.balance}.`); // Log the next player's name and balance
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

//   const handleBetClick = (betAmount) => {
//     setPlayers(prevPlayers => {
//         const newPlayers = [...prevPlayers];
//         const numericBetAmount = Number(betAmount); // Convert betAmount to a number

//         // Log the values before the if statement
//         console.log('Player exists:', !!newPlayers[currentPlayerIndex]);
//         console.log('Player balance:', newPlayers[currentPlayerIndex].balance);
//         console.log('Bet amount:', numericBetAmount);
//         console.log('Bet placed:', betPlaced);

//         // Check if the player exists before trying to read its balance
//         if (newPlayers[currentPlayerIndex] && newPlayers[currentPlayerIndex].balance >= numericBetAmount && numericBetAmount && !betPlaced && numericBetAmount >= 1) {
//             newPlayers[currentPlayerIndex].balance -= numericBetAmount;
//             setBet(prevBet => numericBetAmount);
//             setLimbo(prevLimbo => numericBetAmount); // Add the bet amount to limbo
//             setBetPlaced(prevBetPlaced => true);
//         } else {
//             // Check if the player exists before trying to read its name
//             if (newPlayers[currentPlayerIndex]) {
//                 console.log(`${newPlayers[currentPlayerIndex].name} does not have enough balance to place this bet.`);
//             } else {
//                 console.log('No current players');
//             }
//         }
//         console.log(newPlayers.map(player => player.balance)); // Log all player balances
//         return newPlayers;
//     });
// };
  
  // const passAndDrawCards = () => {
  //   axios.post('http://localhost:8080/pass')
  //     .then(() => {
  //       setCardsDrawn(false); // Set cardsDrawn to false to show the "Draw Cards" button
  //       remainingCards(); // Update the remaining cards count
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // };

  const remainingCards = () => {
    axios.get('http://localhost:8080/remaining-cards')
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
          Player Balance: {players[currentPlayerIndex] ? players[currentPlayerIndex].balance : 'No current players'}
      </div>
      <div className="pot">
        Pot: Pot
      </div>
      <button onClick={drawCards}>Draw Cards</button>
      <input type="number" value={betAmount} onChange={handleBetAmountChange} />
      <button onClick={handleBet}>Bet</button>

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
          setCurrentPlayerIndex={currentPlayerIndex}
          fetchAllPlayers={fetchAllPlayers}
          // increaseBalance={increaseBalance}
          // decreaseBalance={decreaseBalance}
        />
      </div>

    </div>
  );
}

export default Game;