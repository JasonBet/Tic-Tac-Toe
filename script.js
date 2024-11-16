const Gameboard = (function() {
    const rows = 3;
    const columns = 3;
    const board = [];

    for(let i = 0; i < rows; i++){
        board[i] = [];
        for(let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }
    
    const getBoard = () => board;

    const dropPlayerMark = ([row, column], player) => {
        if(getBoard()[row][column].getValue() === 0){
            getBoard()[row][column].addPlayerMark(player)
        }
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };

    return {getBoard, dropPlayerMark, printBoard};
})();

function Cell() {
    let value = 0;

    const addPlayerMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return{
        addPlayerMark,
        getValue
    };
}

const GameController = (function() {

    const playerOneName = "Player One";
    const playerTwoName = "Player Two";
    const players = [
        {
            pName: playerOneName,
            playerMark: 1
        },
        {
            pName: playerTwoName,
            playerMark: 2
        }
    ];

    // Initialize first player as active player
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        // If activePlayer is player 0, switch to player 1, else switch to player 0
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        console.log(`${getActivePlayer().pName}'s turn.`);
        Gameboard.printBoard();
    };

    const checkWinRow = (mark) => {
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(Gameboard.getBoard()[i][j].getValue() !== mark){break;}
                if(j === 2){return victory(mark)};
            }
        }
        /*
        if(Gameboard.getBoard()[0][0].getValue() === Gameboard.getBoard()[0][1].getValue() && Gameboard.getBoard()[0][0].getValue() === Gameboard.getBoard()[0][2].getValue() && Gameboard.getBoard()[0][0].getValue() === mark){
            return victory(mark);
        } */
    }

    const victory = (mark) => console.log(`Player ${mark} wins!`);

    const playRound = ([row, column]) => {
        console.log(`${getActivePlayer().pName} placing mark on ${row},${column}`);
        Gameboard.dropPlayerMark([row,column], getActivePlayer().playerMark);

        // Add win condition logic
        checkWinRow(1);
        checkWinRow(2);

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };

})();
