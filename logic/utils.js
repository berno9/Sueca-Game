const SUITS  = ['S', 'H', 'D', 'C'];                
// const RANKS  = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RANKS  = ['A','2','3','4','5','6','7','J','Q','K'];

// hands are represented by ids
export function dealCards(deck, handSize) {
    return deck.splice(0, handSize);
}

// Fisher–Yates shuffle (in‑place, O(n))
export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function idToCard(id) {
  const suit = SUITS[Math.floor(id / 10)];
  const rank = RANKS[id % 10];
  return { rank, suit };
}

// Convert suit letter to full name for display
export function suitToName(suitLetter) {
    const suitMap = {
        'S': 'spades',
        'H': 'hearts', 
        'D': 'diamonds',
        'C': 'clubs'
    };
    return suitMap[suitLetter] || 'spades';
}

// display card on screen
export function drawCard(number, suit) {
    // Map suits to their symbols (yes, this works)
    const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    
    // Get the suit symbol and color
    const symbol = suitSymbols[suit.toLowerCase()];
    const isRed = suit.toLowerCase() === 'hearts' || suit.toLowerCase() === 'diamonds';
    const colorClass = isRed ? 'red' : 'black';
    
    // Create the card HTML 
    return `
        <div class="card ${colorClass}">
            <div class="card-corner top-left">
                <div class="card-number">${number}</div>
                <div class="card-suit">${symbol}</div>
            </div>
            <div class="card-center">
                <div class="card-suit-large">${symbol}</div>
            </div>
            <div class="card-corner bottom-right">
                <div class="card-number">${number}</div>
                <div class="card-suit">${symbol}</div>
            </div>
        </div>
    `;
}

// Create card element from ID
export function createCardElement(cardId, isPlayable = false) {
    const { rank, suit } = idToCard(cardId);
    const suitName = suitToName(suit);
    
    const cardElement = document.createElement('div');
    cardElement.innerHTML = drawCard(rank, suitName);
    const card = cardElement.firstElementChild;
    
    card.dataset.cardId = cardId;
    if (isPlayable) {
        card.classList.add('playable');
    }
    
    return card;
}

// export function drawHand(hand) {
//     hand.array.forEach(id => {
//         let { rank, suit } = idToCard(id);
//         drawCard(rank, suit);
//     });
// }
