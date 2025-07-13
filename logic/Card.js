class Card {
    static SUITS = ['S', 'H', 'D', 'C'];
    static RANKS = ['A', '2', '3', '4', '5', '6', '7', 'J', 'Q', 'K'];
    
    constructor(id) {
        this.id = id;
        this.suit = Card.SUITS[Math.floor(id / 10)];
        this.rank = Card.RANKS[id % 10];
    }

    // Convert to simple object (for game logic that needs rank/suit)
    toObject() {
        return { 
            id: this.id,
            rank: this.rank, 
            suit: this.suit 
        };
    }

    // Convert suit letter to full name
    suitToName() {
        const suitMap = {
            'S': 'spades',
            'H': 'hearts', 
            'D': 'diamonds',
            'C': 'clubs'
        };
        return suitMap[this.suit] || 'spades';
    }

    getSuitName() {
        return this.suitToName();
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
            <div class="card ${colorClass}" data-card-id="${this.id}">
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

    // Create card element (returns the actual DOM element)
    toElement(isPlayable = false) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = this.toHTML();
        const cardElement = tempDiv.firstElementChild;
        
        if (isPlayable) {
            cardElement.classList.add('playable');
        }
        
        return cardElement;
    }

    // === STATIC METHODS FOR BACKWARD COMPATIBILITY ===
    
    // Create card element from ID (for backward compatibility)
    static createCardElement(cardId, isPlayable = false) {
        const card = new Card(cardId);
        return card.toElement(isPlayable);
    }

    // Convert card ID to simple object (for backward compatibility)
    static idToCard(id) {
        const card = new Card(id);
        return card.toObject();
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
