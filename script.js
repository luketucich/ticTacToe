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
    ]

    // Creates a 2D Array of the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push("");
        }
      }

    // Gets position of symbols on game board
    function getPositions(symbol){
        // Initializes arrays to store symbol positions
        let positions = []

        // Iterates through 'board' array to find 'X' or 'O'
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++){
    
                if (board[i][j] == 'X' && symbol == 'X'){
                    positions.push([i,j]);

                } else if (board[i][j] == 'O' && symbol == 'O'){
                    positions.push([i,j]);
                }
            }
        }

        return positions;
    }

    // Checks for 3-in-a-row on the board
    function checkForWinner(symbol) {
        // Grabs the positions of a given symbol ('X' or 'O')
        const positions = getPositions(symbol);

        for (let i = 0; i < winningCombinations.length; i++){
            // Grabs a  3-coordination winning combination to compare to
            const combination = winningCombinations[i];

            // Check if all positions in the combination are present in the positions array
            const isWinningCombination = combination.every(([row, col]) =>
            positions.some(([r, c]) => r ===  row && c === col)
            );

            // Return true as soon as winning combination is found
            if (isWinningCombination === true){
                return true;
            }
        }

        // If no winning combination is found, return false
        return false;
    }
    

    return {board, getPositions, winningCombinations, checkForWinner};
})();


// Players module
const players = (() => {

    // Assigns player name
    const playerOneName = "Player One";
    const playerTwoName = "Player Two";

    // Creates player objects
    const players = [
        {
            name: playerOneName,
            symbol: "X",
            score: 0
        },
        {
            name: playerTwoName,
            symbol: "O",
            score: 0
        }
    ];

    function switchPlayerTurn(currentPlayerTurn){
        if (currentPlayerTurn == players[0]){
            // Switches turn to Player 2
            return players[1];

        } else if (currentPlayerTurn == players[1]){
            // Switches turn to Player 2
            return players[0];

        }
    }

    // Return
    return {switchPlayerTurn, players};

})();

// Player Actions module
const playerActions = (() => {
    const { board } = gameBoard;

    function placeSymbol(row, column, currentPlayerTurn) {
        board[row][column] = currentPlayerTurn.symbol;
    }

    return {placeSymbol}

})();

// Game flow module
const gameFlow = (() => {
    const { board, checkForWinner } = gameBoard;
    const { switchPlayerTurn, players:allPlayers } = players;
    const { placeSymbol } = playerActions;

    function startGame() {
        let hasWon = false;
        let moveCount = 0;
        let currentPlayerTurn = allPlayers[0];

        while (hasWon == false && moveCount < 9) {
            // Display the current board state
            console.table(board);

            // Get current player's turn
            console.log(`${currentPlayerTurn.name}'s turn (${currentPlayerTurn.symbol})`);
          
            // Prompt the user to place their symbol
            let row = parseInt(prompt("Enter row (0, 1, or 2):"));
            let column = parseInt(prompt("Enter column (0, 1, or 2):"));

            // Asks user to place at a different spot if spot is occupied
            while (board[row][column] !== ''){
                console.log("That spot is already occupied! Try again.")
                row = parseInt(prompt("Enter row (0, 1, or 2):"));
                column = parseInt(prompt("Enter column (0, 1, or 2):"));
            }

            // Places symbol on board
            placeSymbol(row, column, currentPlayerTurn);

            // Check if the current player has won
            hasWon = checkForWinner(currentPlayerTurn.symbol);

            if (hasWon == false) {
                currentPlayerTurn = switchPlayerTurn(currentPlayerTurn);
                moveCount += 1;
            }
        }
        // Outputs final board
        console.table(board);

        // Outputs winner
        if (hasWon == true){
            console.log(currentPlayerTurn.name + " is the winner!");
            
        // Outputs drawn game
        } else {
            console.log("It was a draw!");
        }
    }

    return { startGame };
})();

// Start the game
gameFlow.startGame();