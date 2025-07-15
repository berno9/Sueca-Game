import { Game } from './Game.js';
import { Card } from '../Objects/Card.js';

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
        this.game.onRoundWin = (winnerIndex, pointsEarned) => this.showRoundWinner(winnerIndex, pointsEarned);
        this.game.onShowContinueButton = () => this.showContinueButton();
        this.game.onGameRestart = () => this.handleGameRestart();
        
        this.initializeUI();
        this.game.startRound();
    }

    initializeUI() {
        this.renderPlayerHand();
        this.updateOtherPlayersCards();
        this.displayTrumpSymbol();
        this.showTrumpCardReveal(); // Show trump card in first round
        // Show initial turn indicator
        this.updateTurnIndicator(this.game.currentPlayerIndex);
    }

    renderPlayerHand() {
        const handElement = document.getElementById('player-hand');
        handElement.innerHTML = '';
        
        const userHand = this.game.getUserHand();
        userHand.forEach(cardId => {
            const cardElement = Card.createCardElement(cardId, true);
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
                // Reset turn indicator back to normal if it's still user's turn and no card is selected
                if (this.game.isUserTurn() && this.selectedCard === cardId) {
                    this.selectedCard = null;
                    // Clear selection visual state
                    document.querySelectorAll('#player-hand .card').forEach(card => {
                        card.classList.remove('selected');
                    });
                    this.updateTurnIndicator(0);
                }
            }
        }, 5000);
    }

    selectCard(cardElement, cardId) {
        // Remove selection from other cards
        document.querySelectorAll('#player-hand .card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Reset click counts for previously selected cards
        if (this.selectedCard && this.selectedCard !== cardId) {
            this.clickCount.set(this.selectedCard, 0);
        }
        
        // Select this card
        cardElement.classList.add('selected');
        this.selectedCard = cardId;
        
        // Update turn indicator to show "press again" message if it's user's turn
        if (this.game.isUserTurn()) {
            this.updateTurnIndicatorForSelectedCard();
        }
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
            // Restore normal turn indicator for user if still their turn
            if (this.game.isUserTurn()) {
                this.updateTurnIndicator(0);
            }
        } else {
            // Show error message for illegal move
            this.showIllegalMoveMessage();
            // Keep the card selected so user can try again
            console.log("Failed to play card - illegal move");
        }
    }

    displayPlayedCard(cardId, playerIndex) {
        const playedCardsElement = document.getElementById('played-cards');
        const cardElement = Card.createCardElement(cardId);
        
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
            
            // Add missing cards (for game restart)
            while (playerCards.children.length < cardCount) {
                // Create a proper face-down card
                const cardElement = document.createElement('div');
                cardElement.className = 'card card-back opponent-card';
                cardElement.innerHTML = `
                    <div class="card-back-content">
                        <div class="card-back-pattern"></div>
                    </div>
                `;
                playerCards.appendChild(cardElement);
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
            turnIndicator.textContent = ' (A Jogar)';
            playerNameElement.appendChild(turnIndicator);
        }
    }

    updateTurnIndicatorForSelectedCard() {
        // Clear all existing turn indicators
        this.clearTurnIndicators();
        
        // Add special turn indicator for selected card state
        const playerNameElement = this.getPlayerNameElement(0); // User is always player 0
        if (playerNameElement) {
            const turnIndicator = document.createElement('span');
            turnIndicator.className = 'turn-indicator';
            turnIndicator.textContent = ' (Prime novamente para jogar)';
            playerNameElement.appendChild(turnIndicator);
        }
    }

    clearTurnIndicators() {
        document.querySelectorAll('.turn-indicator').forEach(indicator => {
            indicator.remove();
        });
        // Also clear error indicators when turn changes
        this.clearErrorIndicators();
    }

    showRoundWinner(winnerIndex, pointsEarned) {
        // Clear existing winner indicators
        this.clearWinnerIndicators();
        
        // Show winner for the winning player
        const winnerNameElement = this.getPlayerNameElement(winnerIndex);
        if (winnerNameElement) {
            const winnerIndicator = document.createElement('span');
            winnerIndicator.className = 'winner-indicator';
            winnerIndicator.textContent = ' (Vencedor)';
            winnerNameElement.appendChild(winnerIndicator);
        }

        // Update Score Board
        let element;
        if (winnerIndex === 0 || winnerIndex === 2)
            element = document.getElementById("user-score");
        else
            element = document.getElementById("opponents-score");
        
        let newScore = parseInt(element.textContent) + pointsEarned;
        element.textContent = newScore;
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

    showContinueButton() {
        // Create continue button
        const continueButton = document.createElement('button');
        continueButton.textContent = 'Continuar';
        continueButton.id = 'continue-button';
        continueButton.addEventListener('click', () => this.handleContinueClick());
        
        // Add button to the play area
        const playArea = document.querySelector('.play-area');
        playArea.appendChild(continueButton);
    }

    handleContinueClick() {
        // Remove the continue button
        const continueButton = document.getElementById('continue-button');
        if (continueButton) {
            continueButton.remove();
        }
        
        // Clear winner indicators
        this.clearWinnerIndicators();
        
        // Continue to next round
        this.game.continueToNextRound();
        
        // Update trump display (symbol stays, but no more card reveals after first round)
        this.displayTrumpSymbol();
    }

    showGameEnd() {
        // Clear any existing turn indicators
        this.clearTurnIndicators();
        this.clearWinnerIndicators();
        
        // Create play again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Jogar Novamente';
        playAgainButton.id = 'play-again-button';
        playAgainButton.addEventListener('click', () => this.handlePlayAgainClick());
        
        // Add button to the play area
        const playArea = document.querySelector('.play-area');
        playArea.appendChild(playAgainButton);
        
        console.log("Game ended! Click 'Play Again' to start a new game.");
    }

    handlePlayAgainClick() {
        // Remove the play again button
        const playAgainButton = document.getElementById('play-again-button');
        if (playAgainButton) {
            playAgainButton.remove();
        }
        
        // Restart the game
        this.game.restartGame();
    }

    handleGameRestart() {
        // Clear the board and reset UI
        this.clearPlayedCards();
        this.clearTurnIndicators();
        this.clearWinnerIndicators();
        
        // Reset UI state
        this.selectedCard = null;
        this.clickCount.clear();
        
        // Reset scores to 0
        document.getElementById("user-score").textContent = "0";
        document.getElementById("opponents-score").textContent = "0";
        
        // Re-initialize the UI
        this.renderPlayerHand();
        this.updateOtherPlayersCards();
        this.displayTrumpSymbol();
        this.showTrumpCardReveal(); // Show trump card reveal for new game
        this.updateTurnIndicator(this.game.currentPlayerIndex);
    }

    showIllegalMoveMessage() {
        // Clear ALL existing indicators first (turn, winner, error)
        this.clearTurnIndicators(); // This also clears error indicators
        this.clearWinnerIndicators();
        
        // Show error message for the user
        const playerNameElement = this.getPlayerNameElement(0); // User is always player 0
        if (playerNameElement) {
            const errorIndicator = document.createElement('span');
            errorIndicator.className = 'error-indicator';
            errorIndicator.textContent = ' (Jogada inválida - escolhe outra carta)';
            playerNameElement.appendChild(errorIndicator);
            
            // Remove error message after 3 seconds
            setTimeout(() => {
                this.clearErrorIndicators();
                // Restore normal turn indicator if still user's turn
                if (this.game.isUserTurn()) {
                    this.updateTurnIndicator(0);
                }
            }, 3000);
        }
    }

    clearErrorIndicators() {
        document.querySelectorAll('.error-indicator').forEach(indicator => {
            indicator.remove();
        });
    }

    displayTrumpSymbol() {
        // Always show the trump symbol
        const trumpDisplay = document.querySelector('.trump-display');
        const trumpCard = this.game.getTrumpCard();
        const trumpCardElement = document.getElementById('trump-card');
        
        if (trumpCard && trumpCardElement) {
            // Just show the suit symbol
            trumpCardElement.textContent = trumpCard.getSuitSymbol();
            trumpCardElement.style.color = trumpCard.isRed() ? '#d32f2f' : '#000';
        }
        
        // Always show the trump display
        if (trumpDisplay) {
            trumpDisplay.style.display = 'flex';
        }
    }

    showTrumpCardReveal() {
        // Show the actual trump card only in first round
        if (this.game.shouldShowTrumpCard()) {
            const trumpPlayerIndex = this.game.getTrumpPlayerIndex();
            const trumpCard = this.game.getTrumpCard();
            
            // Temporarily show the trump card in the trump player's hand
            this.revealTrumpCardInHand(trumpPlayerIndex, trumpCard);
            
            // Hide it after 5 seconds
            // setTimeout(() => {
            //     this.hideTrumpCardInHand(trumpPlayerIndex);
            // }, 5000);
        }
    }

    revealTrumpCardInHand(playerIndex, trumpCard) {
        if (playerIndex === 0) {
            // User's hand - trump card is already visible as a normal card
            return;
        }
        
        // For other players, temporarily replace one card back with the trump card
        const playerCards = document.getElementById(`player-${playerIndex}-cards`);
        if (playerCards && playerCards.children.length > 0) {
            const cardBack = playerCards.children[0];
            const trumpCardElement = Card.createCardElement(trumpCard.id, true);
            trumpCardElement.classList.add('card-back', 'trump-reveal');
            trumpCardElement.style.position = 'absolute';
            trumpCardElement.style.left = cardBack.style.left;
            trumpCardElement.style.width = '80px';
            trumpCardElement.style.height = '112px';
            trumpCardElement.style.zIndex = '100';
            
            // Add the trump card
            playerCards.appendChild(trumpCardElement);
        }
    }

    hideTrumpCardInHand(playerIndex) {
        if (playerIndex === 0) return; // User's hand doesn't need hiding
        
        // Remove the revealed trump card
        const playerCards = document.getElementById(`player-${playerIndex}-cards`);
        if (playerCards) {
            const trumpReveal = playerCards.querySelector('.trump-reveal');
            if (trumpReveal) {
                trumpReveal.remove();
            }
        }
    }
}
