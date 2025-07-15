import { Player } from "./Player.js";
import { Card } from "../Objects/Card.js";
import { Deck } from "../Objects/Deck.js";

class Game {
    constructor() {
        const deck = new Deck().shuffle();

        this.players = [
            new Player(deck.deal(10)), // this player is the user
            new Player(deck.deal(10)),
            new Player(deck.deal(10)),
            new Player(deck.deal(10))
        ];
        
        this.currentRound = 1;
        this.maxRounds = 10;
        this.currentPlayerIndex = Math.floor(Math.random() * 4); // random player starts
        this.playedCards = []; // Array to store played cards in current trick
        this.waitingForUserInput = false;
        this.gameEnded = false;
        this.roundStarted = false;
        this.showTrumpCard = true; // Show actual trump card only in first round
        
        // Select trump card and suit
        this.selectTrumpCard();
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
            // Show continue button instead of auto-clearing
            if (this.onShowContinueButton) {
                this.onShowContinueButton();
            }
            return;
        }

        // Notify UI about turn change
        if (this.onTurnChange) {
            this.onTurnChange(this.currentPlayerIndex);
        }

        //const currentPlayer = this.getCurrentPlayer();
        
        if (this.currentPlayerIndex === 0) { // User's turn
            this.waitingForUserInput = true;
            this.onUserTurn();
        } else { // AI player's turn
            this.waitingForUserInput = false;
            const waitTime = Math.floor(Math.random() * (2300 - 800 + 1)) + 700; // random number between two limits
            setTimeout(() => {
                this.playAICard();
            }, waitTime); // "Random" delay for better UX
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
        const playedCard = currentPlayer.playCard(this.playedCards);
        
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
        const playedCard = userPlayer.playSelectedCard(cardId, this.playedCards);
        
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
    addPlayedCard(card, playerIndex) {
        // Handle both Card objects and IDs for backward compatibility
        if (typeof card === 'number') {
            // Legacy: card is an ID
            this.playedCards.push({
                cardId: card,
                playerIndex: playerIndex,
                card: Card.idToCard(card)
            });
            
            if (this.onCardPlayed) {
                this.onCardPlayed(card, playerIndex);
            }
        } else if (card && card.id !== undefined) {
            // card is a Card object (for good measure)
            this.playedCards.push({
                cardId: card.id,
                playerIndex: playerIndex,
                card: card.toObject()
            });
            
            if (this.onCardPlayed) {
                this.onCardPlayed(card.id, playerIndex);
            }
        } else {
            console.error('Invalid card provided to addPlayedCard:', card);
        }
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
    }

    // Determine winner of just-finished round
    evaluateRound() {
        if (this.playedCards.length !== 4) return;

        let winningCard = this.playedCards[0];
        
        for (let i = 1; i < this.playedCards.length; i++) {
            const currentCard = this.playedCards[i];
            if (Card.isHigherCard(currentCard, winningCard, this.trumpSuit)) 
                winningCard = currentCard;
        }

        let pointsEarned = this.playedCards.reduce((acc, c) => acc + c.card.toPoints(), 0);
        
        // Notify UI about round winner
        if (this.onRoundWin) {
            this.onRoundWin(winningCard.playerIndex, pointsEarned);
        }
        // Winner starts next round
        this.currentPlayerIndex = winningCard.playerIndex;
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
        
        // Hide trump card after first round
        if (this.currentRound > 1) {
            this.showTrumpCard = false;
        }
        
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

    // Continue to next round (called by UI button)
    continueToNextRound() {
        this.clearPlayedCards();
        this.nextRound();
    }

    // Restart the entire game
    restartGame() {
        // Reset game state
        const deck = new Deck().shuffle();
        
        this.players = [
            new Player(deck.deal(10)),
            new Player(deck.deal(10)),
            new Player(deck.deal(10)),
            new Player(deck.deal(10))
        ];
        
        this.currentRound = 1;
        this.currentPlayerIndex = Math.floor(Math.random() * 4);
        this.playedCards = [];
        this.waitingForUserInput = false;
        this.gameEnded = false;
        this.roundStarted = false;
        this.showTrumpCard = true; // Reset to show trump card in first round
        
        // Select new trump card
        this.selectTrumpCard();
        
        // Notify UI to restart
        if (this.onGameRestart) {
            this.onGameRestart();
        }
        
        // Start the new game
        this.startRound();
    }

    // Select trump card and suit
    selectTrumpCard() {
        // Choose a random player
        const randomPlayerIndex = Math.floor(Math.random() * 4);
        const randomPlayer = this.players[randomPlayerIndex];
        
        // Choose a random card from that player's hand
        const playerCards = randomPlayer.getCards();
        const randomCardIndex = Math.floor(Math.random() * playerCards.length);
        const trumpCard = playerCards[randomCardIndex];
        
        // Set trump card and suit
        this.trumpCard = trumpCard;
        this.trumpSuit = trumpCard.suit;
        this.trumpPlayerIndex = randomPlayerIndex;
        
        console.log(`Trump card: ${trumpCard.rank} of ${trumpCard.suitToName()} (Player ${randomPlayerIndex + 1})`);
    }

    // Get trump information
    getTrumpCard() {
        return this.trumpCard;
    }

    getTrumpSuit() {
        return this.trumpSuit;
    }

    getTrumpPlayerIndex() {
        return this.trumpPlayerIndex;
    }

    // Check if trump card should be shown (only first round)
    shouldShowTrumpCard() {
        return this.showTrumpCard && this.currentRound === 1;
    }
}

export { Game };