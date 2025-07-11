
function drawCard(suit, number) {
    // Map suits to their symbols
    const suitSymbols = {
        'hearts': '♥',
        'diamonds': '♦',
        'clubs': '♣',
        'spades': '♠'
    };
    
    // Get the suit symbol and color
    const symbol = suitSymbols[suit.toLowerCase()];
    const isRed = suit.toLowerCase() === 'hearts' || suit.toLowerCase() === 'diamonds';
    const colorClass = isRed ? 'red' : 'black';
    
    // Create the card HTML
    return `
        <div class="card ${colorClass}">
            <div class="card-corner top-left">
                <div class="card-number">${number}</div>
                <div class="card-suit">${symbol}</div>
            </div>
            <div class="card-center">
                <div class="card-suit-large">${symbol}</div>
            </div>
            <div class="card-corner bottom-right">
                <div class="card-number">${number}</div>
                <div class="card-suit">${symbol}</div>
            </div>
        </div>
    `;
}