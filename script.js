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

    const checkWinCons = (mark) => {
        // Check win-con for rows
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(Gameboard.getBoard()[i][j].getValue() !== mark){break;}
                if(j === 2){return true};
            }
        }

        // Check win-con for columns
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(Gameboard.getBoard()[j][i].getValue() !== mark){break;}
                if(j === 2){return true};
            }
        }

        // Check win-con for diagonals
        if(Gameboard.getBoard()[0][0].getValue() === mark && Gameboard.getBoard()[1][1].getValue() === mark && Gameboard.getBoard()[2][2].getValue() === mark) {
            return true;
        } else if(Gameboard.getBoard()[0][2].getValue() === mark && Gameboard.getBoard()[1][1].getValue() === mark && Gameboard.getBoard()[2][0].getValue() === mark) {
            return true;
        }
    }

    const victory = (mark) => {
        console.log(`Player ${mark} wins!`);
        ScreenController.declareVictor(mark);
    }

    let gameOver = false;
    const getGameOver = () => gameOver;
    const resetGameOver = () => gameOver = false;

    const playRound = ([row, column]) => {
        if(gameOver) return;
        console.log(`${getActivePlayer().pName} placing mark on ${row},${column}`);
        Gameboard.dropPlayerMark([row,column], getActivePlayer().playerMark);

        // Add win condition logic
        if(checkWinCons(1)){
            gameOver = true;
            return victory(1);
        } else if(checkWinCons(2)){
            gameOver = true;
            return victory(2);
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getGameOver,
        resetGameOver
    };

})();

const ScreenController = (function() {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const victor = document.querySelector('.victor');

    const updateScreen = () => {
        boardDiv.textContent = "";

        playerTurnDiv.textContent = `${GameController.getActivePlayer().pName}'s turn...`;

        // Render board cells
        Gameboard.getBoard().forEach((row, rowIndex) => {
            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                // Add data attribute to identify each cell through its column
                cellButton.dataset.column = index;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
            })
        })
    }

    // Victory & Reset Alert
    const declareVictor = (mark) => {
        victor.textContent = `Player ${mark} WINS!!!`;
    }

    // Event listener for board
    function clickHandlerBoard(e) {
        const row = parseInt(e.target.dataset.row);
        const column = parseInt(e.target.dataset.column);
        const selectedCell = [row, column];
        // Check cell was clicked
        if(!e.target.dataset.row || !e.target.dataset.column) return;

        if(Gameboard.getBoard()[row][column].getValue() !== 0){
            alert("This box was already clicked!");
            return;
        }

        GameController.playRound(selectedCell);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);


    // Initial screen render
    updateScreen();

    return{
        declareVictor
    }
})();
