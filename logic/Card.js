class Card {
    static SUITS = ['S', 'H', 'D', 'C'];
    static RANKS = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
    
    constructor(id) {
        this.id = id;
        this.suit = Card.SUITS[Math.floor(id / 10)];
        this.rank = Card.RANKS[id % 10];
    }

    // Create a deck of 40 cards
    static createDeck() {
        return [...Array(40).keys()];
    }

    // Shuffle an array (Fisher–Yates shuffle)
    static shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Deal cards from a deck
    static dealCards(deck, handSize) {
        return deck.splice(0, handSize);
    }

    // Convert card ID to card object (for backward compatibility)
    static idToCard(id) {
        const suit = Card.SUITS[Math.floor(id / 10)];
        const rank = Card.RANKS[id % 10];
        return { rank, suit };
    }

    // Convert suit letter to full name
    static suitToName(suitLetter) {
        const suitMap = {
            'S': 'spades',
            'H': 'hearts', 
            'D': 'diamonds',
            'C': 'clubs'
        };
        return suitMap[suitLetter] || 'spades';
    }

    getSuitName() {
        return Card.suitToName(this.suit);
    }

    isRed() {
        return this.suit === 'H' || this.suit === 'D';
    }

    getSuitSymbol() {
        const suitSymbols = {
            'H': '♥',
            'D': '♦',
            'C': '♣',
            'S': '♠'
        };
        return suitSymbols[this.suit];
    }

    // Generate card HTML
    toHTML() {
        const symbol = this.getSuitSymbol();
        const colorClass = this.isRed() ? 'red' : 'black';
        
        return `
            <div class="card ${colorClass}">
                <div class="card-corner top-left">
                    <div class="card-number">${this.rank}</div>
                    <div class="card-suit">${symbol}</div>
                </div>
                <div class="card-center">
                    <div class="card-suit-large">${symbol}</div>
                </div>
                <div class="card-corner bottom-right">
                    <div class="card-number">${this.rank}</div>
                    <div class="card-suit">${symbol}</div>
                </div>
            </div>
        `;
    }

    // Create card element from ID (for backward compatibility)
    static createCardElement(cardId, isPlayable = false) {
        const card = new Card(cardId);
        
        const cardElement = document.createElement('div');
        cardElement.innerHTML = card.toHTML();
        const cardDiv = cardElement.firstElementChild;
        
        cardDiv.dataset.cardId = cardId;
        if (isPlayable) {
            cardDiv.classList.add('playable');
        }
        
        return cardDiv;
    }

    // For backward compatibility with drawCard function
    static drawCard(number, suit) {
        const suitSymbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        
        const symbol = suitSymbols[suit.toLowerCase()];
        const isRed = suit.toLowerCase() === 'hearts' || suit.toLowerCase() === 'diamonds';
        const colorClass = isRed ? 'red' : 'black';
        
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
}

export { Card };
