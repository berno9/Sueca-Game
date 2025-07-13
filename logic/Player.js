import { Hand } from './Hand.js';
import { Card } from './Card.js';

class Player {
    constructor(cards = []) {
        this.hand = new Hand(cards);
    }

    // Play a random card (for AI players)
    playCard() {
        return this.hand.playRandomCard();
    }

    // Play a specific card by ID (for user input)
    playSelectedCard(cardId) {
        return this.hand.playCard(cardId);
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