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

  // print board with cell values to console
  const printBoard = () => {
    const boardFormatted = board.map((row) => row.map((cell) => cell.getValue()).join("")).join("\n");
    console.log(boardFormatted);
  }

  // takes position as [row, column] coordinates of cell
  const placeMark = (player, pos) => {
    const selectedCell = board[pos[0]][pos[1]];
    selectedCell.addMark(player);
  }

  return {
    getBoard,
    printBoard,
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

  const printRound = () => {
    board.printBoard();
    console.log(`${activePlayer.name}'s turn`);
  }

  const playRound = (cellPos) => {
    board.placeMark(activePlayer, cellPos);
    switchPlayer();
    printRound();
  }

  printRound();

  return {
    playRound
  }
})();