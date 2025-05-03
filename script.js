// Game state object in global scope
const gameState = {
    players: [],
    currentPlayerIndex: 0,
    currentRound: 1,
    maxRounds: 3,
    scores: {},
    selectedCards: {},
    isPartyMode: false,
    cardTypes: {}
};

// Card data for both versions
const cardDatabase = {
    classic: {
        nigiri: {
            egg: { name: "Egg Nigiri", points: 1, image: "images/egg_nigiri.png", type: "nigiri", color: "blue" },
            salmon: { name: "Salmon Nigiri", points: 2, image: "images/salmon_nigiri.png", type: "nigiri", color: "blue" },
            squid: { name: "Squid Nigiri", points: 3, image: "images/squid_nigiri.png", type: "nigiri", color: "blue" }
        },
        wasabi: { name: "Wasabi", points: 0, image: "images/wasabi.png", type: "special", color: "red", description: "Triples next nigiri" },
        sashimi: { name: "Sashimi", points: 0, image: "images/sashimi.png", type: "appetizer", color: "yellow", description: "3 cards = 10 points" },
        tempura: { name: "Tempura", points: 0, image: "images/tempura.png", type: "appetizer", color: "yellow", description: "2 cards = 5 points" },
        dumpling: { name: "Dumpling", points: 0, image: "images/dumpling.png", type: "appetizer", color: "yellow", description: "1:1, 2:3, 3:6, 4:10, 5+:15" },
        maki: {
            maki1: { name: "Maki Roll (1)", icons: 1, points: 0, image: "images/maki1.png", type: "roll", color: "green", description: "Most: 6, Second: 3" },
            maki2: { name: "Maki Roll (2)", icons: 2, points: 0, image: "images/maki2.png", type: "roll", color: "green", description: "Most: 6, Second: 3" },
            maki3: { name: "Maki Roll (3)", icons: 3, points: 0, image: "images/maki3.png", type: "roll", color: "green", description: "Most: 6, Second: 3" }
        },
        pudding: { name: "Pudding", points: 0, image: "images/pudding.png", type: "dessert", color: "purple", description: "Most: +6, Fewest: -6" },
        chopsticks: { name: "Chopsticks", points: 0, image: "images/chopsticks.png", type: "special", color: "red", description: "Play 2 cards next turn" }
    },
    party: {
        nigiri: {
            egg: { name: "Egg Nigiri", points: 1, image: "images/egg_nigiri.png", type: "nigiri", color: "blue" },
            salmon: { name: "Salmon Nigiri", points: 2, image: "images/salmon_nigiri.png", type: "nigiri", color: "blue" },
            squid: { name: "Squid Nigiri", points: 3, image: "images/squid_nigiri.png", type: "nigiri", color: "blue" }
        },
        wasabi: { name: "Wasabi", points: 0, image: "images/wasabi.png", type: "special", color: "red", description: "Triples next nigiri" },
        sashimi: { name: "Sashimi", points: 0, image: "images/sashimi.png", type: "appetizer", color: "yellow", description: "3 cards = 10 points" },
        tempura: { name: "Tempura", points: 0, image: "images/tempura.png", type: "appetizer", color: "yellow", description: "2 cards = 5 points" },
        dumpling: { name: "Dumpling", points: 0, image: "images/dumpling.png", type: "appetizer", color: "yellow", description: "1:1, 2:3, 3:6, 4:10, 5+:15" },
        maki: {
            maki1: { name: "Maki Roll (1)", icons: 1, points: 0, image: "images/maki1.png", type: "roll", color: "green", description: "Most: 6, Second: 3" },
            maki2: { name: "Maki Roll (2)", icons: 2, points: 0, image: "images/maki2.png", type: "roll", color: "green", description: "Most: 6, Second: 3" },
            maki3: { name: "Maki Roll (3)", icons: 3, points: 0, image: "images/maki3.png", type: "roll", color: "green", description: "Most: 6, Second: 3" }
        },
        temaki: { name: "Temaki", points: 0, image: "images/temaki.png", type: "roll", color: "green", description: "Most: 4, Fewest: -4" },
        uramaki: { name: "Uramaki", points: 0, image: "images/uramaki.png", type: "roll", color: "green", description: "Race to 10 rolls: 1st:8, 2nd:5, 3rd:2" },
        eel: { name: "Eel", points: 0, image: "images/eel.png", type: "appetizer", color: "yellow", description: "1:1, 2:2, 3+:0" },
        tofu: { name: "Tofu", points: 0, image: "images/tofu.png", type: "appetizer", color: "yellow", description: "1:2, 2:6, 3+:0" },
        onigiri: { name: "Onigiri", points: 0, image: "images/onigiri.png", type: "appetizer", color: "yellow", description: "Unique shapes: 1:1, 2:4, 3:9, 4:16" },
        edamame: { name: "Edamame", points: 0, image: "images/edamame.png", type: "appetizer", color: "yellow", description: "1pt per card for each other player who played it" },
        misoSoup: { name: "Miso Soup", points: 0, image: "images/miso_soup.png", type: "appetizer", color: "yellow", description: "Must discard if any other Miso Soup is played same turn" },
        soySauce: { name: "Soy Sauce", points: 0, image: "images/soy_sauce.png", type: "special", color: "red", description: "Choose a color - score 4pts if you have most of that color" },
        tea: { name: "Tea", points: 0, image: "images/tea.png", type: "special", color: "red", description: "1pt per card in your biggest set of a single color" },
        menu: { name: "Menu", points: 0, image: "images/menu.png", type: "special", color: "red", description: "Draw 4 cards, play 1, return the rest (2-6 players only)" },
        specialOrder: { name: "Special Order", points: 0, image: "images/special_order.png", type: "special", color: "red", description: "Play as any appetizer already played this round" },
        takeoutBox: { name: "Takeout Box", points: 0, image: "images/takeout_box.png", type: "special", color: "red", description: "Flip over any previously played cards - now worth 2pts each" },
        spoon: { name: "Spoon", points: 0, image: "images/spoon.png", type: "special", color: "red", description: "Announce a card - first player to left with it gives it to you" },
        pudding: { name: "Pudding", points: 0, image: "images/pudding.png", type: "dessert", color: "purple", description: "Most: +6, Fewest: -6" },
        greenTeaIceCream: { name: "Green Tea Ice Cream", points: 0, image: "images/green_tea_ice_cream.png", type: "dessert", color: "purple", description: "x4 = 12 points" },
        fruit: { name: "Fruit", points: 0, image: "images/fruit.png", type: "dessert", color: "purple", description: "Per type: x0=-2, x1=0, x2=1, x3=3, x4=6, x5+=10" }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', toggleTheme);
    
    // Party mode toggle
    const partyToggle = document.getElementById('partyToggle');
    partyToggle.addEventListener('change', togglePartyMode);
    
    // Setup player count input
    const playerCountInput = document.getElementById('playerCount');
    playerCountInput.addEventListener('input', updatePlayerNameInputs);
    
    // Start game button
    document.getElementById('startGameBtn').addEventListener('click', startGame);
    
    // Initialize with classic mode
    togglePartyMode();
    
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

function togglePartyMode() {
    const partyToggle = document.getElementById('partyToggle');
    gameState.isPartyMode = partyToggle.checked;
    
    // Update UI
    document.getElementById('gameVersion').textContent = gameState.isPartyMode ? 'Party!' : 'Classic';
    document.getElementById('partyPlayerRange').style.display = gameState.isPartyMode ? 'inline' : 'none';
    
    // Update player count limits
    const playerCountInput = document.getElementById('playerCount');
    playerCountInput.max = gameState.isPartyMode ? '8' : '5';
    
    // Reset player names when switching modes
    updatePlayerNameInputs();
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
    
    // Validate player count
    if (gameState.isPartyMode) {
        if (playerCount < 2 || playerCount > 8) {
            alert("Please choose between 2-8 players in Party Mode");
            return;
        }
    } else {
        if (playerCount < 2 || playerCount > 5) {
            alert("Please choose between 2-5 players in Classic Mode");
            return;
        }
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
    
    // Set available cards based on mode
    gameState.cardTypes = gameState.isPartyMode ? cardDatabase.party : cardDatabase.classic;
    
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
    updateRulesDisplay();
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
            return gameState.scores[player][roundKey] > 0 || 
                   (gameState.scores[player][roundKey] === 0 && document.querySelectorAll('.card.selected').length > 0);
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
    
    // Reset selected cards
    gameState.selectedCards = {};
    
    // Always include nigiri
    gameState.selectedCards.nigiri = { egg: 0, salmon: 0, squid: 0 };
    for (const subType in gameState.cardTypes.nigiri) {
        const card = gameState.cardTypes.nigiri[subType];
        addCardToGrid(card, 'nigiri', subType);
    }
    
    // Include other card types based on mode
    if (gameState.isPartyMode) {
        // In Party mode, show all available cards
        for (const category in gameState.cardTypes) {
            if (category === 'nigiri') continue; // Already added
            
            if (category === 'maki') {
                // Initialize and add all maki variants
                gameState.selectedCards.maki = { maki1: 0, maki2: 0, maki3: 0 };
                for (const subType in gameState.cardTypes.maki) {
                    const card = gameState.cardTypes.maki[subType];
                    addCardToGrid(card, 'maki', subType);
                }
            } else if (typeof gameState.cardTypes[category] === 'object' && !Array.isArray(gameState.cardTypes[category])) {
                // Initialize and add other single cards
                const card = gameState.cardTypes[category];
                gameState.selectedCards[category.toLowerCase()] = 0;
                addCardToGrid(card, category.toLowerCase());
            }
        }
    } else {
        // In Classic mode, show only classic cards
        gameState.selectedCards.wasabi = 0;
        gameState.selectedCards.sashimi = 0;
        gameState.selectedCards.tempura = 0;
        gameState.selectedCards.dumpling = 0;
        gameState.selectedCards.maki = { maki1: 0, maki2: 0, maki3: 0 };
        gameState.selectedCards.pudding = 0;
        gameState.selectedCards.chopsticks = 0;
        
        addCardToGrid(gameState.cardTypes.wasabi, 'wasabi');
        addCardToGrid(gameState.cardTypes.sashimi, 'sashimi');
        addCardToGrid(gameState.cardTypes.tempura, 'tempura');
        addCardToGrid(gameState.cardTypes.dumpling, 'dumpling');
        
        // Add all maki variants
        for (const subType in gameState.cardTypes.maki) {
            const card = gameState.cardTypes.maki[subType];
            addCardToGrid(card, 'maki', subType);
        }
        
        addCardToGrid(gameState.cardTypes.pudding, 'pudding');
        addCardToGrid(gameState.cardTypes.chopsticks, 'chopsticks');
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
        if (typeof gameState.selectedCards[category] === 'object') {
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
    
    // Calculate other scores based on game mode
    if (gameState.isPartyMode) {
        // Party mode scoring
        if (gameState.selectedCards.maki) {
            const makiScore = calculateMakiScore();
            roundScore += makiScore.total;
            if (makiScore.total > 0) {
                scoreDetails.push({ name: "Maki Rolls", value: makiScore.total });
            }
        }
        
        if (gameState.selectedCards.temaki !== undefined) {
            const temakiScore = calculateTemakiScore();
            roundScore += temakiScore.total;
            if (temakiScore.total > 0) {
                scoreDetails.push({ name: "Temaki", value: temakiScore.total });
            }
        }
        
        if (gameState.selectedCards.uramaki !== undefined) {
            const uramakiScore = calculateUramakiScore();
            roundScore += uramakiScore.total;
            if (uramakiScore.total > 0) {
                scoreDetails.push({ name: "Uramaki", value: uramakiScore.total });
            }
        }
        
        // Add other Party mode card calculations here...
    } else {
        // Classic mode scoring
        const makiScore = calculateMakiScore();
        roundScore += makiScore.total;
        if (makiScore.total > 0) {
            scoreDetails.push({ name: "Maki Rolls", value: makiScore.total });
        }
        
        const sashimiScore = calculateSashimiScore();
        roundScore += sashimiScore;
        if (sashimiScore > 0) {
            scoreDetails.push({ name: "Sashimi", value: sashimiScore });
        }
        
        const tempuraScore = calculateTempuraScore();
        roundScore += tempuraScore;
        if (tempuraScore > 0) {
            scoreDetails.push({ name: "Tempura", value: tempuraScore });
        }
        
        const dumplingScore = calculateDumplingScore();
        roundScore += dumplingScore;
        if (dumplingScore > 0) {
            scoreDetails.push({ name: "Dumpling", value: dumplingScore });
        }
    }
    
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
    
    // Calculate other scores based on game mode
    if (gameState.isPartyMode) {
        // Party mode calculations
        if (gameState.selectedCards.maki) {
            total += calculateMakiScore().total;
        }
        
        if (gameState.selectedCards.temaki !== undefined) {
            total += calculateTemakiScore().total;
        }
        
        if (gameState.selectedCards.uramaki !== undefined) {
            total += calculateUramakiScore().total;
        }
        
        // Add other Party mode card calculations here...
    } else {
        // Classic mode calculations
        total += calculateMakiScore().total;
        total += calculateSashimiScore();
        total += calculateTempuraScore();
        total += calculateDumplingScore();
    }
    
    return total;
}

function calculateNigiriScore() {
    let total = 0;
    let details = [];
    let wasabiCount = gameState.selectedCards.wasabi || 0;
    
    // Process each nigiri type
    for (const type in gameState.selectedCards.nigiri) {
        let count = gameState.selectedCards.nigiri[type];
        let points = gameState.cardTypes.nigiri[type].points;
        
        // Apply wasabi to as many nigiri as possible
        const wasabiUsed = Math.min(wasabiCount, count);
        if (wasabiUsed > 0) {
            total += wasabiUsed * points * 3;
            details.push({ 
                name: `${wasabiUsed} ${gameState.cardTypes.nigiri[type].name} with Wasabi`, 
                value: wasabiUsed * points * 3 
            });
            wasabiCount -= wasabiUsed;
            count -= wasabiUsed;
        }
        
        // Add remaining nigiri without wasabi
        if (count > 0) {
            total += count * points;
            details.push({ 
                name: `${count} ${gameState.cardTypes.nigiri[type].name}`, 
                value: count * points 
            });
        }
    }
    
    return { total, details };
}

function calculateMakiScore() {
    let total = 0;
    
    if (gameState.selectedCards.maki) {
        // Calculate total maki icons
        const makiIcons = calculateMakiIcons();
        
        // Note: Actual maki scoring requires comparing with other players
        // For now just return the total icons
        total = makiIcons;
    }
    
    return { total };
}

function calculateMakiIcons() {
    let total = 0;
    if (gameState.selectedCards.maki) {
        total += gameState.selectedCards.maki.maki1 * 1;
        total += gameState.selectedCards.maki.maki2 * 2;
        total += gameState.selectedCards.maki.maki3 * 3;
    }
    return total;
}

function calculateTemakiScore() {
    let total = 0;
    
    if (gameState.selectedCards.temaki !== undefined) {
        const temakiCount = gameState.selectedCards.temaki || 0;
        // Note: Actual temaki scoring requires comparing with other players
        total = temakiCount;
    }
    
    return { total };
}

function calculateUramakiScore() {
    let total = 0;
    
    if (gameState.selectedCards.uramaki !== undefined) {
        const uramakiCount = gameState.selectedCards.uramaki || 0;
        // Note: Actual uramaki scoring requires comparing with other players
        total = uramakiCount;
    }
    
    return { total };
}

function calculateSashimiScore() {
    const count = gameState.selectedCards.sashimi || 0;
    const sets = Math.floor(count / 3);
    return sets * 10;
}

function calculateTempuraScore() {
    const count = gameState.selectedCards.tempura || 0;
    const sets = Math.floor(count / 2);
    return sets * 5;
}

function calculateDumplingScore() {
    const count = gameState.selectedCards.dumpling || 0;
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count === 2) return 3;
    if (count === 3) return 6;
    if (count === 4) return 10;
    return 15; // 5 or more
}

function updateRulesDisplay() {
    const rulesContainer = document.getElementById('rulesContainer');
    rulesContainer.innerHTML = '';
    
    // Always show nigiri rules
    addRuleCard("Nigiri", [
        "Egg Nigiri: 1 point",
        "Salmon Nigiri: 2 points",
        "Squid Nigiri: 3 points",
        "Wasabi triples next nigiri"
    ]);
    
    // Show rules based on game mode
    if (gameState.isPartyMode) {
        // Party mode rules
        if (gameState.selectedCards.maki) {
            addRuleCard("Maki Rolls", ["Most icons: 6 points", "Second most: 3 points"]);
        }
        
        if (gameState.selectedCards.temaki !== undefined) {
            addRuleCard("Temaki", ["Most: 4 points", "Fewest: -4 points"]);
        }
        
        if (gameState.selectedCards.uramaki !== undefined) {
            addRuleCard("Uramaki", ["Race to 10 rolls", "1st: 8 points", "2nd: 5 points", "3rd: 2 points"]);
        }
        
        // Add other Party mode rules here...
    } else {
        // Classic mode rules
        addRuleCard("Maki Rolls", ["Most icons: 6 points", "Second most: 3 points"]);
        addRuleCard("Sashimi", ["3 cards = 10 points"]);
        addRuleCard("Tempura", ["2 cards = 5 points"]);
        addRuleCard("Dumpling", ["1:1, 2:3, 3:6, 4:10, 5+:15"]);
        addRuleCard("Pudding", ["Most: +6, Fewest: -6"]);
    }
}

function addRuleCard(title, rules) {
    const rulesContainer = document.getElementById('rulesContainer');
    const ruleCard = document.createElement('div');
    ruleCard.className = 'rule-card';
    
    const titleElement = document.createElement('h4');
    titleElement.textContent = title;
    ruleCard.appendChild(titleElement);
    
    rules.forEach(rule => {
        const ruleElement = document.createElement('p');
        ruleElement.textContent = rule;
        ruleCard.appendChild(ruleElement);
    });
    
    rulesContainer.appendChild(ruleCard);
}

function adjustForMobile() {
        const isMobile = window.innerWidth <= 480;
        document.body.classList.toggle('mobile-view', isMobile);
    }

    window.addEventListener('resize', adjustForMobile);
    window.addEventListener('load', adjustForMobile);
