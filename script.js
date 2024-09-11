// Game board module
const gameBoard = (() => {

    // Initializes game board size
    const board = []
    const rows = 3;
    const columns = 3;

    // Creates a 2D Array of the game board
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
          board[i].push("");
        }
      }

    return {board};
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
        } else{
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

