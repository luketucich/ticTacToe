const soundEffects = (() => {
    const clickSound = new Audio('sounds/clickSound.mp3');
    const winGameSound = new Audio('sounds/winSound.mp3');
    const drawGameSound = new Audio('sounds/drawSound.mp3');
    
    return { clickSound, winGameSound, drawGameSound };
})();

// Game board module
const gameBoard = (() => {
    // Initializes game board size and information
    const board = [];
    const rows = 3;
    const columns = 3;
    const winningCombinations = [
        // Horizontal combinations
        [[0,0],[0,1],[0,2]],
        [[1,0],[1,1],[1,2]],
        [[2,0],[2,1],[2,2]],
        // Vertical combinations
        [[0,0],[1,0],[2,0]],
        [[0,1],[1,1],[2,1]],
        [[0,2],[1,2],[2,2]],
        // Diagonal combinations
        [[0,0],[1,1],[2,2]],
        [[0,2],[1,1],[2,0]]
    ];

    // Creates a 2D Array of the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push("");
        }
    }

    // Gets position of particular marker (symbol) on the game board
    function getPositions(symbol) {
        let positions = [];
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === symbol) {
                    positions.push([i, j]);
                }
            }
        }
        return positions;
    }

    // Checks for 3-in-a-row on the board
    function checkForWinner(symbol) {
        const positions = getPositions(symbol);

        // Compares every winning combination to markers on board
        for (let i = 0; i < winningCombinations.length; i++) {
            const combination = winningCombinations[i];
            const isWinningCombination = combination.every(([row, col]) =>
                positions.some(([r, c]) => r === row && c === col)
            );
            if (isWinningCombination) return true;
        }
        return false;
    }

    return { board, getPositions, checkForWinner, rows, columns };
})();

// Players module
const players = (() => {
    // Creates base player name's
    const playerOneName = "Player One";
    const playerTwoName = "Player Two";

    // Creates base player objects
    const players = [
        { name: playerOneName, symbol: "X", score: 0 },
        { name: playerTwoName, symbol: "O", score: 0 }
    ];

    // When called, it will return the next player's turn
    function switchPlayerTurn(currentPlayerTurn) {
        return currentPlayerTurn === players[0] ? players[1] : players[0];
    }

    return { switchPlayerTurn, players };
})();

// Player Actions module
const playerActions = (() => {
    const { board } = gameBoard;

    // Places a marker on the board and plays sound effect
    function placeSymbol(row, column, currentPlayerTurn) {
        soundEffects.clickSound.play();
        board[row][column] = currentPlayerTurn.symbol;
    }

    return { placeSymbol };
})();

// Game End Modal Styling module
const gameEndModalStyling = (() => {
    const gameEndModal = document.querySelector('#endModal');
    const gameAnnouncement = document.querySelector('#gameAnnouncement');
    const playAgainButton = document.querySelector('#playAgain');

    // If player wins, make appropriate modal visible
    function showWinModal(currentPlayer) {
        gameEndModal.style.display = "flex";
        soundEffects.winGameSound.play();
        gameAnnouncement.textContent = currentPlayer.name + " won!";

        if (currentPlayer.symbol === 'O') {
            gameAnnouncement.style.cssText = "-webkit-text-stroke: 0.3rem var(--secondary);";
            playAgainButton.style.cssText = "color: var(--secondary); border: 0.1rem solid var(--secondary);";
        } else {
            gameAnnouncement.style.cssText = "";
            playAgainButton.style.cssText = "";
        }
    }

    // If players draw, make appropriate modal visible
    function showDrawModal() {
        gameEndModal.style.display = "flex";
        soundEffects.drawGameSound.play();
        gameAnnouncement.textContent = "It was a draw!";
        gameAnnouncement.style.cssText = "";
        playAgainButton.style.cssText = "";
    }

    // Resets the round end modal when called
    function resetModal() {
        gameEndModal.style.display = "none";
        gameAnnouncement.textContent = "";
        gameAnnouncement.style.cssText = "";
        playAgainButton.style.cssText = "";
    }

    // When pressing play again button, resets game entirely
    playAgainButton.addEventListener('click', () => {
        resetModal();
        gameController.resetGame();
    });

    return { showWinModal, showDrawModal, resetModal };
})();

// Game Controller module
const gameController = (() => {
    const { board, checkForWinner } = gameBoard;
    const { switchPlayerTurn, players: allPlayers } = players;
    const { placeSymbol } = playerActions;
    const { showWinModal, showDrawModal } = gameEndModalStyling;
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    // Initializes game variables
    let currentPlayerTurn = allPlayers[0];
    let moveCount = 0;
    let hasWon = false;

    // Updates display text and board
    const updateScreen = () => {
        boardDiv.textContent = "";

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                const square = document.createElement('div');
                square.className = "square";
                square.textContent = board[i][j];

                if (square.textContent === 'X') {
                    square.classList.add('playerOne');
                } else if (square.textContent === 'O') {
                    square.classList.add('playerTwo');
                }

                square.dataset.row = i;
                square.dataset.column = j;
                square.addEventListener('click', handleSquareClick);
                boardDiv.appendChild(square);
            }
        }
    };

    // When clicking on tic-tac-toe square
    const handleSquareClick = (event) => {
        // Get the current square's row and column
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;

        // If the square is empty and the round isn't over
        if (board[row][column] === '' && !hasWon && moveCount < 9) {
            
            // Place symbol and check for winner
            placeSymbol(row, column, currentPlayerTurn);
            hasWon = checkForWinner(currentPlayerTurn.symbol);

            // If the round isn't over yet
            if (!hasWon && moveCount < 9) {
                // Updates player turn 
                currentPlayerTurn = switchPlayerTurn(currentPlayerTurn);
                playerTurnDiv.textContent = `${currentPlayerTurn.name}'s Turn`;

                // Adjusts player turn's outline based off player
                if (currentPlayerTurn.symbol == 'O'){
                    playerTurnDiv.style.cssText = '-webkit-text-stroke: 0.2rem var(--secondary)';
                } else {
                    playerTurnDiv.style.cssText = '';
                }

                moveCount += 1;
            }
            
            // If round over, display modal
            if (hasWon) {
                showWinModal(currentPlayerTurn);
            } else if (moveCount === 9) {
                showDrawModal();
            }

            updateScreen();

        // If space occupied, don't allow player to place marker
        } else {
            console.log("That space is occupied!");
        }
    };

    // Resets all game variables and updates display
    const resetGame = () => {
        // Reset the board
        for (let i = 0; i < gameBoard.rows; i++) {
            for (let j = 0; j < gameBoard.columns; j++) {
                board[i][j] = "";
            }
        }

        // Reset the variables
        currentPlayerTurn = allPlayers[0];
            // Resets player turn
        playerTurnDiv.textContent = `${currentPlayerTurn.name}'s Turn`;
            // Adjusts player turn's outline based off player
        if (currentPlayerTurn.symbol == 'O'){
            playerTurnDiv.style.cssText = '-webkit-text-stroke: 0.2rem var(--secondary)';
        } else {
            playerTurnDiv.style.cssText = '';
        }
        moveCount = 0;
        hasWon = false;

        updateScreen();       
    }

    updateScreen();

    return { resetGame };
})();

const startGame = (() => {
    const startGameForm = document.querySelector('.startContainer');
    const gameContainer = document.querySelector('.container');
    const playerTurnDiv = document.querySelector('.turn');
    const { players: allPlayers } = players;
    
    // When pressing start game:
    startGameForm.addEventListener('submit', function(event) {
        // Prevent the form from submitting normally
        event.preventDefault();

        // Plays 'click' sound effect
        soundEffects.clickSound.play();

        // Sets Player Names
        allPlayers[0].name = document.getElementById('player1').value;
        allPlayers[1].name = document.getElementById('player2').value;
        playerTurnDiv.textContent = `${allPlayers[0].name}'s Turn`;

        // Hide the start game section
        startGameForm.style.display = 'none';
        gameContainer.style.display = 'flex';

    });
})();