function Gameboard() {
  const board = [];

  // make 3x3 2D array of cells
  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const getBoardValues = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  }

  // print board with cell values to console
  const printBoard = () => {
    const boardFormatted = getBoardValues().map((x) => x.join("")).join("\n");
    console.log(boardFormatted);
  }

  // get cell at position [row, column] coordinates
  const getCell = (pos) => {
    return board[pos[0]][pos[1]];
  }

  const placeMark = (player, pos) => {
    getCell(pos).addMark(player);
  }

  return {
    getBoard,
    getBoardValues,
    printBoard,
    getCell,
    placeMark
  }
}

function Cell() {
  let value = "-"; // default for empty cell

  const getValue = () => value;

  const addMark = (player) => {
    value = player.mark;
  };

  return {
    getValue,
    addMark
  }
}

const GameController = (function() {
  const board = Gameboard();

  const players = [
    {
      "name": "Player One",
      "mark": "X"
    },
    {
      "name": "Player Two",
      "mark": "O"
    }
  ]
  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const printRound = (msg = `${activePlayer.name}'s turn`) => {
    board.printBoard();
    console.log(msg);
  }

  const playRound = (cellPos) => {
    // prevent playing on a spot that's already marked
    if (board.getCell(cellPos).getValue() !== "-") {
      console.log("Spot already taken");
    }
    else {
      board.placeMark(activePlayer, cellPos);

      if (checkForGameOver(cellPos)) {
        printRound(`${activePlayer.name} wins!`);
      } else {
        switchPlayer();
        printRound();
      }
    }
  }
  
  const checkForGameOver = (lastMove) => {
    const boardValues = board.getBoardValues();
    const mark = activePlayer.mark;

    // check if last move completed 3 in a line
    // row of last move
    if (boardValues[lastMove[0]][0] === mark &&
        boardValues[lastMove[0]][1] === mark && 
        boardValues[lastMove[0]][2] === mark
      ) {
        return true;
      }
    // column of last move
    if (boardValues[0][lastMove[1]] === mark &&
        boardValues[1][lastMove[1]] === mark && 
        boardValues[2][lastMove[1]] === mark
      ) {
        return true;
    }
    // if last move was top left or bottom right corner
    if (lastMove[0] === lastMove[1]) {
      // top left to bottom right diagonal
      if (boardValues[0][0] === mark &&
          boardValues[1][1] === mark &&
          boardValues[2][2] === mark
      ) {
        return true;
      }
    }
    // if last move was top right or bottom left corner
    else if (
      lastMove[0] === 0 && lastMove[1] === 2 ||
      lastMove[0] === 2 && lastMove[1] === 2
    ) {
      // top right to bottom left diagonal
      if (boardValues[0][0] === mark &&
          boardValues[1][1] === mark &&
          boardValues[2][2] === mark
      ) {
        return true;
      }
    }
    return false;
  }

  printRound();

  return {
    playRound
  }
})();