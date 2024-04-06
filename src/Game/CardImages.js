// CardImages.js

const suits = ['S', 'C', 'D', 'H']; // Spades, Clubs, Diamonds, Hearts
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']; // Ace, 2-10, Jack, Queen, King

const cardImages = {};

suits.forEach(suit => {
  values.forEach(value => {
    const cardKey = `${value}${suit}`;
    const imagePath = `${process.env.PUBLIC_URL}/deck1/${cardKey}.png`;
    cardImages[cardKey] = imagePath;
  });
});

export default cardImages;