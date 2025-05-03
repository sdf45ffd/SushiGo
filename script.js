// Game state object in global scope
const gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    maxRounds: 3,
    scores: {},
    selectedCards: {
        nigiri: { egg: 0, salmon: 0, squid: 0 },
        wasabi: 0,
        sashimi: 0,
        tempura: 0,
        dumpling: 0,
        maki: { maki1: 0, maki2: 0, maki3: 0 },
        pudding: 0,
        chopsticks: 0
    }
};

// Card data for Sushi Go!
const cardTypes = {
    nigiri: {
        egg: { name: "Egg Nigiri", points: 1, image: "images/egg_nigiri.png" },
        salmon: { name: "Salmon Nigiri", points: 2, image: "images/salmon_nigiri.png" },
        squid: { name: "Squid Nigiri", points: 3, image: "images/squid_nigiri.png" }
    },
    wasabi: { name: "Wasabi", points: 0, image: "images/wasabi.png", description: "Triples next nigiri" },
    sashimi: { name: "Sashimi", points: 0, image: "images/sashimi.png", description: "3 cards = 10 points" },
    tempura: { name: "Tempura", points: 0, image: "images/tempura.png", description: "2 cards = 5 points" },
    dumpling: { name: "Dumpling", points: 0, image: "images/dumpling.png", description: "1:1, 2:3, 3:6, 4:10, 5+:15" },
    maki: {
        maki1: { name: "Maki Roll (1)", icons: 1, points: 0, image: "images/maki1.png", description: "Most: 6, Second: 3" },
        maki2: { name: "Maki Roll (2)", icons: 2, points: 0, image: "images/maki2.png", description: "Most: 6, Second: 3" },
        maki3: { name: "Maki Roll (3)", icons: 3, points: 0, image: "images/maki3.png", description: "Most: 6, Second: 3" }
    },
    pudding: { name: "Pudding", points: 0, image: "images/pudding.png", description: "Most: +6, Least: -6" },
    chopsticks: { name: "Chopsticks", points: 0, image: "images/chopsticks.png", description: "Play 2 cards next turn" }
};

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', toggleTheme);
    
    // Setup player count input
    const playerCountInput = document.getElementById('playerCount');
    playerCountInput.addEventListener('input', updatePlayerNameInputs);
    
    // Start game button
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    
    // Initialize player name inputs
    updatePlayerNameInputs();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
});

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.textContent = theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode';
}

function updatePlayerNameInputs() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    const playerNamesContainer = document.getElementById('playerNames');
    playerNamesContainer.innerHTML = '';
    
    for (let i = 1; i <= playerCount; i++) {
        const div = document.createElement('div');
        div.className = 'player-name-input';
        
        const label = document.createElement('label');
        label.textContent = `Player ${i} Name:`;
        label.setAttribute('for', `player${i}Name`);
        
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player${i}Name`;
        input.placeholder = `Player ${i}`;
        input.value = `Player ${i}`;
        
        div.appendChild(label);
        div.appendChild(input);
        playerNamesContainer.appendChild(div);
    }
}

function startGame() {
    const playerCount = parseInt(document.getElementById('playerCount').value);
    if (playerCount < 3 || playerCount > 5) {
        alert("Please choose between 3-5 players");
        return;
    }
    
    gameState.players = [];
    gameState.scores = {};
    resetCardSelection();
    
    // Get player names
    for (let i = 1; i <= playerCount; i++) {
        const playerName = document.getElementById(`player${i}Name`).value || `Player ${i}`;
        gameState.players.push(playerName);
        
        // Initialize scores
        gameState.scores[playerName] = {
            round1: 0,
            round2: 0,
            round3: 0,
            total: 0
        };
    }
    
    // Hide setup screen, show game screen
    document.getElementById('setupScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    
    // Initialize game
    gameState.currentPlayerIndex = 0;
    gameState.currentRound = 1;
    
    // Initialize UI
    updateRoundDisplay();
    updatePlayerTabs();
    initCards();
    setupGameEventListeners();
    updateScoreboard();
}

function updateRoundDisplay() {
    document.getElementById('currentRound').textContent = gameState.currentRound;
}

function updatePlayerTabs() {
    const playerTabsContainer = document.getElementById('playerTabs');
    playerTabsContainer.innerHTML = '';
    
    gameState.players.forEach((player, index) => {
        const tab = document.createElement('div');
        tab.className = `player-tab ${index === gameState.currentPlayerIndex ? 'active' : ''}`;
        tab.textContent = player;
        tab.dataset.playerIndex = index;
        
        tab.addEventListener('click', function() {
            if (index !== gameState.currentPlayerIndex) {
                gameState.currentPlayerIndex = index;
                updatePlayerTabs();
                updateCurrentPlayerDisplay();
                resetCardSelection();
            }
        });
        
        playerTabsContainer.appendChild(tab);
    });
    
    updateCurrentPlayerDisplay();
}

function updateCurrentPlayerDisplay() {
    document.getElementById('currentPlayerName').textContent = gameState.players[gameState.currentPlayerIndex];
}

function setupGameEventListeners() {
    document.getElementById('nextPlayerBtn').addEventListener('click', nextPlayer);
    document.getElementById('nextRoundBtn').addEventListener('click', nextRound);
    document.getElementById('resetBtn').addEventListener('click', resetCardSelection);
}

function nextPlayer() {
    // Save current player's score
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const roundKey = `round${gameState.currentRound}`;
    gameState.scores[currentPlayer][roundKey] = calculateTotalScore();
    gameState.scores[currentPlayer].total = calculatePlayerTotal(currentPlayer);
    
    // Move to next player
    gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
    
    // If we've looped back to the first player, check if we should move to next round
    if (gameState.currentPlayerIndex === 0) {
        // Check if all players have completed this round
        const allPlayersCompleted = gameState.players.every(player => {
            return gameState.scores[player][roundKey] > 0;
        });
        
        if (allPlayersCompleted) {
            // Auto-advance to next round
            nextRound();
            return;
        }
    }
    
    updatePlayerTabs();
    resetCardSelection();
    updateScoreboard();
}

function nextRound() {
    // Save current player's score if not already saved
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const roundKey = `round${gameState.currentRound}`;
    
    if (gameState.scores[currentPlayer][roundKey] === 0) {
        gameState.scores[currentPlayer][roundKey] = calculateTotalScore();
        gameState.scores[currentPlayer].total = calculatePlayerTotal(currentPlayer);
    }
    
    // Move to next round
    gameState.currentRound++;
    
    if (gameState.currentRound > gameState.maxRounds) {
        // Game over - show final scores
        const winner = determineWinner();
        alert(`Game over! Final scores:\n\n${formatFinalScores()}\n\nWinner: ${winner}`);
        
        // Reset game
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('setupScreen').style.display = 'block';
        return;
    }
    
    // Reset player index for new round
    gameState.currentPlayerIndex = 0;
    
    // Reset all scores for the new round
    gameState.players.forEach(player => {
        gameState.scores[player][`round${gameState.currentRound}`] = 0;
    });
    
    // Update UI
    updateRoundDisplay();
    updatePlayerTabs();
    resetCardSelection();
    updateScoreboard();
}

function determineWinner() {
    let highestScore = -Infinity;
    let winners = [];
    
    gameState.players.forEach(player => {
        if (gameState.scores[player].total > highestScore) {
            highestScore = gameState.scores[player].total;
            winners = [player];
        } else if (gameState.scores[player].total === highestScore) {
            winners.push(player);
        }
    });
    
    return winners.length === 1 ? winners[0] : winners.join(" and ") + " (tie)";
}

function formatFinalScores() {
    return gameState.players
        .map(player => `${player}: ${gameState.scores[player].total} points`)
        .join('\n');
}

function calculatePlayerTotal(playerName) {
    return gameState.scores[playerName].round1 + 
           gameState.scores[playerName].round2 + 
           gameState.scores[playerName].round3;
}

function updateScoreboard() {
    const scoreboardTable = document.getElementById('scoreboardTable').querySelector('tbody');
    scoreboardTable.innerHTML = '';
    
    gameState.players.forEach(player => {
        const row = document.createElement('tr');
        
        // Player name
        const nameCell = document.createElement('td');
        nameCell.textContent = player;
        row.appendChild(nameCell);
        
        // Round scores
        const round1Cell = document.createElement('td');
        round1Cell.textContent = gameState.scores[player].round1 || '-';
        row.appendChild(round1Cell);
        
        const round2Cell = document.createElement('td');
        round2Cell.textContent = gameState.currentRound > 1 ? (gameState.scores[player].round2 || '-') : '-';
        row.appendChild(round2Cell);
        
        const round3Cell = document.createElement('td');
        round3Cell.textContent = gameState.currentRound > 2 ? (gameState.scores[player].round3 || '-') : '-';
        row.appendChild(round3Cell);
        
        // Total score
        const totalCell = document.createElement('td');
        totalCell.textContent = gameState.scores[player].total;
        totalCell.style.fontWeight = 'bold';
        row.appendChild(totalCell);
        
        scoreboardTable.appendChild(row);
    });
}

function initCards() {
    const cardGrid = document.getElementById('cardGrid');
    cardGrid.innerHTML = '';
    
    // Add all card types to the grid
    for (const category in cardTypes) {
        if (category === 'nigiri' || category === 'maki') {
            // Handle subcategories
            for (const subType in cardTypes[category]) {
                const card = cardTypes[category][subType];
                addCardToGrid(card, category, subType);
            }
        } else {
            const card = cardTypes[category];
            addCardToGrid(card, category);
        }
    }
}

function addCardToGrid(card, category, subType = null) {
    const cardGrid = document.getElementById('cardGrid');
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.dataset.category = category;
    if (subType) cardElement.dataset.subType = subType;
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'card-name';
    nameDiv.textContent = card.name;
    
    const pointsDiv = document.createElement('div');
    pointsDiv.className = 'card-points';
    pointsDiv.textContent = card.description || `${card.points} point${card.points !== 1 ? 's' : ''}`;
    
    const countSpan = document.createElement('span');
    countSpan.className = 'count';
    countSpan.textContent = '0';
    
    cardElement.appendChild(nameDiv);
    cardElement.appendChild(pointsDiv);
    cardElement.appendChild(countSpan);
    cardGrid.appendChild(cardElement);
    
    // Add click event
    cardElement.addEventListener('click', function() {
        selectCard(category, subType);
    });
}

function selectCard(category, subType = null) {
    if (subType) {
        gameState.selectedCards[category][subType]++;
    } else {
        gameState.selectedCards[category]++;
    }
    
    updateCardDisplay();
    calculateScore();
}

function updateCardDisplay() {
    document.querySelectorAll('.card').forEach(card => {
        const category = card.dataset.category;
        const subType = card.dataset.subType;
        
        let count = 0;
        if (subType) {
            count = gameState.selectedCards[category][subType];
        } else {
            count = gameState.selectedCards[category];
        }
        
        const countSpan = card.querySelector('.count');
        countSpan.textContent = count;
        
        if (count > 0) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

function resetCardSelection() {
    // Reset all counts
    for (const category in gameState.selectedCards) {
        if (category === 'nigiri' || category === 'maki') {
            for (const subType in gameState.selectedCards[category]) {
                gameState.selectedCards[category][subType] = 0;
            }
        } else {
            gameState.selectedCards[category] = 0;
        }
    }
    
    updateCardDisplay();
    calculateScore();
}

function calculateScore() {
    let roundScore = 0;
    let totalScore = 0;
    let scoreDetails = [];
    
    // Calculate Nigiri scores (including Wasabi bonuses)
    const nigiriScore = calculateNigiriScore();
    roundScore += nigiriScore.total;
    scoreDetails.push({ name: "Nigiri", value: nigiriScore.total, details: nigiriScore.details });
    
    // Calculate Sashimi score
    const sashimiScore = calculateSashimiScore();
    roundScore += sashimiScore;
    if (sashimiScore > 0) {
        scoreDetails.push({ name: "Sashimi", value: sashimiScore });
    }
    
    // Calculate Tempura score
    const tempuraScore = calculateTempuraScore();
    roundScore += tempuraScore;
    if (tempuraScore > 0) {
        scoreDetails.push({ name: "Tempura", value: tempuraScore });
    }
    
    // Calculate Dumpling score
    const dumplingScore = calculateDumplingScore();
    roundScore += dumplingScore;
    if (dumplingScore > 0) {
        scoreDetails.push({ name: "Dumpling", value: dumplingScore });
    }
    
    // Calculate Maki score (just count icons here, comparison would need all players' data)
    const makiIcons = calculateMakiIcons();
    scoreDetails.push({ name: "Maki Rolls (icons)", value: makiIcons });
    
    // Calculate total score (sum of all rounds)
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer) {
        const roundKey = `round${gameState.currentRound}`;
        totalScore = gameState.scores[currentPlayer].total - (gameState.scores[currentPlayer][roundKey] || 0) + roundScore;
    }
    
    // Update the display
    document.getElementById('roundScore').textContent = roundScore;
    document.getElementById('totalScore').textContent = totalScore;
    
    const scoreDetailsElement = document.getElementById('scoreDetails');
    scoreDetailsElement.innerHTML = '';
    
    scoreDetails.forEach(item => {
        const detailElement = document.createElement('div');
        detailElement.className = 'score-detail';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = item.value;
        
        detailElement.appendChild(nameSpan);
        detailElement.appendChild(valueSpan);
        scoreDetailsElement.appendChild(detailElement);
        
        // Add sub-details if they exist
        if (item.details) {
            item.details.forEach(subItem => {
                const subDetailElement = document.createElement('div');
                subDetailElement.className = 'score-detail sub-detail';
                subDetailElement.style.paddingLeft = '20px';
                
                const subNameSpan = document.createElement('span');
                subNameSpan.textContent = subItem.name;
                
                const subValueSpan = document.createElement('span');
                subValueSpan.textContent = subItem.value;
                
                subDetailElement.appendChild(subNameSpan);
                subDetailElement.appendChild(subValueSpan);
                scoreDetailsElement.appendChild(subDetailElement);
            });
        }
    });
}

function calculateTotalScore() {
    let total = 0;
    
    // Calculate Nigiri scores (including Wasabi bonuses)
    total += calculateNigiriScore().total;
    
    // Calculate Sashimi score
    total += calculateSashimiScore();
    
    // Calculate Tempura score
    total += calculateTempuraScore();
    
    // Calculate Dumpling score
    total += calculateDumplingScore();
    
    return total;
}

function calculateNigiriScore() {
    let total = 0;
    let details = [];
    let wasabiCount = gameState.selectedCards.wasabi;
    
    // Process each nigiri type
    for (const type in gameState.selectedCards.nigiri) {
        let count = gameState.selectedCards.nigiri[type];
        let points = cardTypes.nigiri[type].points;
        
        // Apply wasabi to as many nigiri as possible
        const wasabiUsed = Math.min(wasabiCount, count);
        if (wasabiUsed > 0) {
            total += wasabiUsed * points * 3;
            details.push({ 
                name: `${wasabiUsed} ${cardTypes.nigiri[type].name} with Wasabi`, 
                value: wasabiUsed * points * 3 
            });
            wasabiCount -= wasabiUsed;
            count -= wasabiUsed;
        }
        
        // Add remaining nigiri without wasabi
        if (count > 0) {
            total += count * points;
            details.push({ 
                name: `${count} ${cardTypes.nigiri[type].name}`, 
                value: count * points 
            });
        }
    }
    
    return { total, details };
}

function calculateSashimiScore() {
    const count = gameState.selectedCards.sashimi;
    const sets = Math.floor(count / 3);
    return sets * 10;
}

function calculateTempuraScore() {
    const count = gameState.selectedCards.tempura;
    const sets = Math.floor(count / 2);
    return sets * 5;
}

function calculateDumplingScore() {
    const count = gameState.selectedCards.dumpling;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 3;
    if (count === 3) return 6;
    if (count === 4) return 10;
    return 15; // 5 or more
}

function calculateMakiIcons() {
    let total = 0;
    total += gameState.selectedCards.maki.maki1 * 1;
    total += gameState.selectedCards.maki.maki2 * 2;
    total += gameState.selectedCards.maki.maki3 * 3;
    return total;
}