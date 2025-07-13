import { Player } from "./Player.js";
import { Card } from "./Card.js";

class Game {
    constructor() {
        const deck = Card.shuffle(Card.createDeck());

        this.players = [
            new Player(Card.dealCards(deck, 10)), // this player is the user
            new Player(Card.dealCards(deck, 10)),
            new Player(Card.dealCards(deck, 10)),
            new Player(Card.dealCards(deck, 10))
        ];
        
        this.currentRound = 1;
        this.maxRounds = 10;
        this.currentPlayerIndex = Math.floor(Math.random() * 4); // random player starts
        this.playedCards = []; // Array to store played cards in current trick
        this.waitingForUserInput = false;
        this.gameEnded = false;
        this.roundStarted = false;
    }

    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    // Start a new round
    startRound() {
        if (this.gameEnded) return;
        
        this.playedCards = [];
        this.roundStarted = true;
        this.playTurn();
    }

    // Handle a single turn
    async playTurn() {
        if (this.playedCards.length >= 4) {
            this.evaluateRound();
            return;
        }

        // Notify UI about turn change
        if (this.onTurnChange) {
            this.onTurnChange(this.currentPlayerIndex);
        }

        const currentPlayer = this.getCurrentPlayer();
        
        if (this.currentPlayerIndex === 0) { // User's turn
            this.waitingForUserInput = true;
            this.onUserTurn();
        } else { // AI player's turn
            this.waitingForUserInput = false;
            setTimeout(() => {
                this.playAICard();
            }, 1000); // Delay for better UX
        }
    }

    // Handle user's turn
    onUserTurn() {
        // This will be called from the UI when user clicks a card
        console.log("Waiting for user to play a card...");
    }

    // Handle AI player's turn
    playAICard() {
        const currentPlayer = this.getCurrentPlayer();
        const playedCard = currentPlayer.playCard();
        
        if (playedCard !== undefined) {
            this.addPlayedCard(playedCard, this.currentPlayerIndex);
        }
        
        this.nextPlayer();
        this.playTurn();
    }

    // User plays a selected card
    playUserCard(cardId) {
        if (!this.waitingForUserInput || this.currentPlayerIndex !== 0) {
            return false;
        }

        const userPlayer = this.players[0];
        const playedCard = userPlayer.playSelectedCard(cardId);
        
        if (playedCard !== undefined) {
            this.addPlayedCard(playedCard, 0);
            this.waitingForUserInput = false;
            this.nextPlayer();
            this.playTurn();
            return true;
        }
        return false;
    }

    // Add a played card to the current trick
    addPlayedCard(cardId, playerIndex) {
        this.playedCards.push({
            cardId: cardId,
            playerIndex: playerIndex,
            card: Card.idToCard(cardId)
        });
        
        // Notify UI to update display
        if (this.onCardPlayed) {
            this.onCardPlayed(cardId, playerIndex);
        }
    }

    // Move to next player
    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
    }

    // Evaluate the round and determine winner
    evaluateRound() {
        if (this.playedCards.length !== 4) return;

        // Simple evaluation for now - highest card wins (by ID)
        let winningCard = this.playedCards[0];
        for (let i = 1; i < this.playedCards.length; i++) {
            if (this.playedCards[i].cardId > winningCard.cardId) {
                winningCard = this.playedCards[i];
            }
        }

        console.log(`Round ${this.currentRound} won by Player ${winningCard.playerIndex + 1}`);
        
        // Notify UI about round winner
        if (this.onRoundWin) {
            this.onRoundWin(winningCard.playerIndex);
        }
        
        // Winner starts next round
        this.currentPlayerIndex = winningCard.playerIndex;
        
        // Clear played cards after a delay
        setTimeout(() => {
            this.clearPlayedCards();
            this.nextRound();
        }, 2000);
    }

    // Clear played cards from the board
    clearPlayedCards() {
        if (this.onClearPlayedCards) {
            this.onClearPlayedCards();
        }
    }

    // Move to next round
    nextRound() {
        this.currentRound++;
        
        if (this.currentRound > this.maxRounds) {
            this.endGame();
        } else {
            this.startRound();
        }
    }

    // End the game
    endGame() {
        this.gameEnded = true;
        console.log("Game ended!");
        
        if (this.onGameEnd) {
            this.onGameEnd();
        }
    }

    // Check if it's the user's turn
    isUserTurn() {
        return this.currentPlayerIndex === 0 && this.waitingForUserInput;
    }

    // Get user's hand
    getUserHand() {
        return this.players[0].current_hand;
    }
}

export { Game };