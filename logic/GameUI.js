import { Game } from './Game.js';
import { createCardElement } from './utils.js';

export class GameUI {
    constructor() {
        this.game = new Game();
        this.selectedCard = null;
        this.clickCount = new Map(); // Track clicks per card
        
        // Bind game events
        this.game.onCardPlayed = (cardId, playerIndex) => this.displayPlayedCard(cardId, playerIndex);
        this.game.onClearPlayedCards = () => this.clearPlayedCards();
        this.game.onGameEnd = () => this.showGameEnd();
        this.game.onTurnChange = (playerIndex) => this.updateTurnIndicator(playerIndex);
        this.game.onRoundWin = (winnerIndex) => this.showRoundWinner(winnerIndex);
        
        this.initializeUI();
        this.game.startRound();
    }

    initializeUI() {
        this.renderPlayerHand();
        this.updateOtherPlayersCards();
        // Show initial turn indicator
        this.updateTurnIndicator(this.game.currentPlayerIndex);
    }

    renderPlayerHand() {
        const handElement = document.getElementById('player-hand');
        handElement.innerHTML = '';
        
        const userHand = this.game.getUserHand();
        userHand.forEach(cardId => {
            const cardElement = createCardElement(cardId, true);
            cardElement.addEventListener('click', (e) => this.handleCardClick(e, cardId));
            handElement.appendChild(cardElement);
        });
    }

    handleCardClick(event, cardId) {
        const cardElement = event.currentTarget;
        
        // Initialize click count for this card if not exists
        if (!this.clickCount.has(cardId)) {
            this.clickCount.set(cardId, 0);
        }
        
        const clicks = this.clickCount.get(cardId) + 1;
        this.clickCount.set(cardId, clicks);
        
        if (clicks === 1) {
            // First click - select the card
            this.selectCard(cardElement, cardId);
        } else if (clicks === 2) {
            // Second click - play the card
            this.playCard(cardId);
            this.clickCount.set(cardId, 0); // Reset count
        }
        
        // Reset click count after a delay to handle slow double-clicks
        setTimeout(() => {
            if (this.clickCount.get(cardId) === 1) {
                this.clickCount.set(cardId, 0);
            }
        }, 500);
    }

    selectCard(cardElement, cardId) {
        // Remove selection from other cards
        document.querySelectorAll('#player-hand .card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select this card
        cardElement.classList.add('selected');
        this.selectedCard = cardId;
    }

    playCard(cardId) {
        if (!this.game.isUserTurn()) {
            console.log("Not your turn!");
            return;
        }

        const success = this.game.playUserCard(cardId);
        if (success) {
            this.renderPlayerHand(); // Re-render to remove played card
            this.selectedCard = null;
            this.clickCount.delete(cardId);
        } else {
            console.log("Failed to play card");
        }
    }

    displayPlayedCard(cardId, playerIndex) {
        const playedCardsElement = document.getElementById('played-cards');
        const cardElement = createCardElement(cardId);
        
        cardElement.classList.add('played-card', `player-${playerIndex}`);
        playedCardsElement.appendChild(cardElement);

        this.updateOtherPlayersCards(); // right when card is played
    }

    clearPlayedCards() {
        const playedCardsElement = document.getElementById('played-cards');
        playedCardsElement.innerHTML = '';
    }

    updateOtherPlayersCards() {
        // Update card count for other players
        for (let i = 1; i < 4; i++) {
            const playerCards = document.getElementById(`player-${i}-cards`);
            const cardCount = this.game.players[i].getHandSize();
            
            // Remove excess cards
            while (playerCards.children.length > cardCount) {
                playerCards.removeChild(playerCards.lastChild);
            }
        }
    }

    updateTurnIndicator(currentPlayerIndex) {
        // Clear all existing turn indicators
        this.clearTurnIndicators();
        
        // Add turn indicator to current player
        const playerNameElement = this.getPlayerNameElement(currentPlayerIndex);
        if (playerNameElement) {
            const turnIndicator = document.createElement('span');
            turnIndicator.className = 'turn-indicator';
            turnIndicator.textContent = ' (Your Turn)';
            playerNameElement.appendChild(turnIndicator);
        }
    }

    clearTurnIndicators() {
        document.querySelectorAll('.turn-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    showRoundWinner(winnerIndex) {
        // Clear existing winner indicators
        this.clearWinnerIndicators();
        
        // Show winner for the winning player
        const winnerNameElement = this.getPlayerNameElement(winnerIndex);
        if (winnerNameElement) {
            const winnerIndicator = document.createElement('span');
            winnerIndicator.className = 'winner-indicator';
            winnerIndicator.textContent = ' (Winner)';
            winnerNameElement.appendChild(winnerIndicator);
        }
        
        // Show winner for teammate (player sitting across)
        const teammateIndex = (winnerIndex + 2) % 4;
        const teammateNameElement = this.getPlayerNameElement(teammateIndex);
        if (teammateNameElement) {
            const teammateIndicator = document.createElement('span');
            teammateIndicator.className = 'winner-indicator';
            teammateIndicator.textContent = ' (Winner)';
            teammateNameElement.appendChild(teammateIndicator);
        }
        
        // Clear winner indicators after 3 seconds
        setTimeout(() => {
            this.clearWinnerIndicators();
        }, 3000);
    }

    clearWinnerIndicators() {
        document.querySelectorAll('.winner-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    getPlayerNameElement(playerIndex) {
        switch (playerIndex) {
            case 0: // User (bottom)
                return document.querySelector('.bottom-player .player-name');
            case 1: // Player 2 (right)
                return document.querySelector('.right-player .player-name');
            case 2: // Player 3 (top)
                return document.querySelector('.top-player .player-name');
            case 3: // Player 4 (left)
                return document.querySelector('.left-player .player-name');
            default:
                return null;
        }
    }

    // ...existing code...
}
