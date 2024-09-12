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

    // Gets position of markers on game board
    function getPositions(marker){
        // Initializes arrays to store marker positions
        let positions = []

        // Iterates through 'board' array to find 'X' or 'O'
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++){
    
                if (board[i][j] == 'X' && marker == 'X'){
                    positions.push([i,j]);

                } else if (board[i][j] == 'O' && marker == 'O'){
                    positions.push([i,j]);
                }
            }
        }

        return positions;
    }

    // Checks for 3-in-a-row on the board
    function checkForWinner(marker) {
        // Grabs the positions of a given marker ('X' or 'O')
        const positions = getPositions(marker);

        for (let i = 0; i < winningCombinations.length; i++){
            // Grabs a  3-coordination winning combination to compare to
            const combination = winningCombinations[i];

            // Check if all positions in the combination are present in the positions array
            const isWinningCombination = combination.every(([row, col]) =>
            positions.some(([r, c]) => r ===  row && c === col)
            );

            if (isWinningCombination === true){
                console.log(marker + ' wins!')
                return true;
            }
        }
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

    // Switches player turn
    let currentPlayerTurn = players[0];

    function switchPlayerTurn(){
        if (currentPlayerTurn == players[0]){
            // Switches turn to Player 2
            currentPlayerTurn = players[1];

        } else if (currentPlayerTurn == players[1]){
            // Switches turn to Player 2
            currentPlayerTurn = players[0];

        }
    }

    function getCurrentPlayerTurn(){
        return currentPlayerTurn;
    }

    // Return
    return {switchPlayerTurn, getCurrentPlayerTurn}

})();

// Player Actions module
const playerActions = (() => {
    const { board } = gameBoard;
    const {switchPlayerTurn, getCurrentPlayerTurn } = players;

    function placeSymbol(row, column) {
        if (board[row][column] == ''){
            board[row][column] = getCurrentPlayerTurn().symbol;
            switchPlayerTurn();
        } else {
            console.log("Oops! That spot is occupied. Place somewhere else.")
        }

    }
    return {placeSymbol}

})();

// Game flow module
const gameFlow = (() => {
    const { board } = gameBoard;
    const { getCurrentPlayerTurn } = players;
 
    console.table(board);
    console.log(getCurrentPlayerTurn().name + "'s turn.")
})();

playerActions.placeSymbol(0,0)
playerActions.placeSymbol(1,0)
playerActions.placeSymbol(1,1)
playerActions.placeSymbol(0,2)
playerActions.placeSymbol(2,2)
console.table(gameBoard.board)

