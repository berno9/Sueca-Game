class Hand {
    constructor(cards = []) {
        this.cards = cards; // Array of Card objects
    }

    // Add a card to the hand
    addCard(card) {
        this.cards.push(card);
    }

    // Add multiple cards to the hand
    addCards(cards) {
        this.cards.push(...cards);
    }

    // Remove and return a specific card by ID
    playCard(cardId) {
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (cardIndex === -1) {
            return null; 
        }
        return this.cards.splice(cardIndex, 1)[0];
    }

    // Remove and return a random card (for AI players)
    playRandomCard() {
        if (this.cards.length === 0) return null;
        
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        return this.cards.splice(randomIndex, 1)[0];
    }

    // Check if hand contains a specific card
    hasCard(cardId) {
        return this.cards.some(card => card.id === cardId);
    }

    // Get the number of cards in hand
    size() {
        return this.cards.length;
    }

    isEmpty() {
        return this.cards.length === 0;
    }

    // Get all card IDs (for backward compatibility with UI)
    getCardIds() {
        return this.cards.map(card => card.id);
    }

    // Get all cards
    getCards() {
        return [...this.cards]; // Return copy to prevent external modification
    }

    // Find a card by ID
    getCard(cardId) {
        return this.cards.find(card => card.id === cardId);
    }

    // Sort cards (useful for display)
    sort() {
        this.cards.sort((a, b) => a.id - b.id);
    }

    // Clear all cards
    clear() {
        this.cards = [];
    }
}

export { Hand };
