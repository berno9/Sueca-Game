class Player {

    constructor(initial_hand = []) {
        this.current_hand = initial_hand;
    }

    playCard() { // random selection for now
        if (this.current_hand.length === 0) return undefined;          

        const idx = Math.floor(Math.random() * this.current_hand.length); 
        return this.current_hand.splice(idx, 1)[0];                       
    }

    playSelectedCard(cardId) {
        const cardIndex = this.current_hand.indexOf(cardId);
        if (cardIndex === -1) {
            return undefined; // Card not found in hand
        }
        
        // Remove and return the selected card
        return this.current_hand.splice(cardIndex, 1)[0];
    }

    hasCard(cardId) {
        return this.current_hand.includes(cardId);
    }

    getHandSize() {
        return this.current_hand.length;
    }
}

export { Player };