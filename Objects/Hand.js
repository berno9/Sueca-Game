import { Card } from './Card.js';

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
    // approach to enforce rules: message on screen
    playCard(cardId, playedCards) {
        const cardIndex = this.cards.findIndex(card => card.id === cardId);
        if (cardIndex === -1) {
            return undefined; 
        }
        
        if (playedCards.length > 0) { // if no played cards, user can choose whatever
            const firstSuit = Card.idToCard(playedCards[0].cardId).suit;
            const currentSuit = Card.idToCard(cardId).suit;
            
            // Check if player has any cards of the first suit
            const hasFirstSuit = this.cards.some(card => card.suit === firstSuit);
            
            // If player has cards of the first suit, they must play one of them
            if (hasFirstSuit && currentSuit !== firstSuit) {
                return undefined; // Illegal move: must follow suit when possible
            }
        }

        return this.cards.splice(cardIndex, 1)[0];
    }

    // Remove and return a random card (for AI players)
    // approach to enforce rules: filter cards
    playRandomCard(playedCards) {
        if (this.cards.length === 0) return undefined;

        let playableCards = this.cards;

        if (playedCards.length > 0) {
            const firstSuit = Card.idToCard(playedCards[0].cardId).suit;

            if (this.cards.some(c => c.suit === firstSuit)) {
                playableCards = playableCards.filter(card => 
                    card.suit === firstSuit);
            }
        }

        const randomIndex = Math.floor(Math.random() * playableCards.length); // choose any of possible cards
        const correctIndex = this.cards.indexOf(playableCards[randomIndex]);
        return this.cards.splice(correctIndex, 1)[0];
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
        const suits = Card.SUITS;
        const shuffledSuits = [...suits].sort(() => Math.random() - 0.5); // AI
        const rankOrder = Card.RANKS;
        
        this.cards.sort((a, b) => {
            
            // First sort by suit 
            const suitIndexA = shuffledSuits.indexOf(a.suit);
            const suitIndexB = shuffledSuits.indexOf(b.suit);
            
            if (suitIndexA !== suitIndexB) {
                return suitIndexA - suitIndexB;
            }
            
            // If same suit, sort by rank using the correct rank order
            const rankIndexA = rankOrder.indexOf(a.rank);
            const rankIndexB = rankOrder.indexOf(b.rank);
            return rankIndexA - rankIndexB; 
        });
    }

    // Clear all cards
    clear() {
        this.cards = [];
    }
}

export { Hand };
