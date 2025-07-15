import { Card } from '../Objects/Card.js';

class Deck {
    constructor() {
        this.cards = [];
        this.createDeck();
    }

    // Create a standard 40-card deck
    createDeck() {
        this.cards = [];
        for (let id = 0; id < 40; id++) {
            this.cards.push(new Card(id));
        }
    }

    // Shuffle the deck using Fisher–Yates algorithm
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
        return this;
    }

    // Deal a specified number of cards
    deal(count) {
        if (count > this.cards.length) {
            throw new Error(`Cannot deal ${count} cards, only ${this.cards.length} remaining`);
        }
        return this.cards.splice(0, count);
    }

    // Get remaining cards count
    size() {
        return this.cards.length;
    }

    // Check if deck is empty
    isEmpty() {
        return this.cards.length === 0;
    }

    // Reset deck to full 40 cards and shuffle
    reset() {
        this.createDeck();
        this.shuffle();
        return this;
    }
}

export { Deck };
