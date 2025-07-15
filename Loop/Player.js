import { Hand } from '../Objects/Hand.js';
import { Card } from '../Objects/Card.js';

class Player {
    constructor(cards = []) {
        this.hand = new Hand(cards);
        this.hand.sort();
    }

    // Play a random card (for AI players)
    playCard(playedCards) {
        return this.hand.playRandomCard(playedCards);
    }

    // Play a specific card by ID (for user input)
    playSelectedCard(cardId, playedCards) {
        return this.hand.playCard(cardId, playedCards);
    }

    hasCard(cardId) {
        return this.hand.hasCard(cardId);
    }

    // Get number of cards in hand
    getHandSize() {
        return this.hand.size();
    }

    // Get all card IDs (for backward compatibility with UI)
    getCardIds() {
        return this.hand.getCardIds();
    }

    // Get the hand object
    getHand() {
        return this.hand;
    }

    // Get all cards (Card objects)
    getCards() {
        return this.hand.getCards();
    }

    // === BACKWARD COMPATIBILITY ===
    // Keep current_hand property for existing UI code
    get current_hand() {
        return this.hand.getCardIds();
    }

    set current_hand(cardIds) {
        // For backward compatibility, convert IDs to Card objects
        const cards = cardIds.map(id => new Card(id));
        this.hand = new Hand(cards);
    }
}

export { Player };