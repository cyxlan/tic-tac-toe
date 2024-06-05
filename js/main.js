const Gameboard = (function() {
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

  return {
    getBoard,
    printBoard
  }
})();

function Cell() {
  let value = "-"; // default for empty cell

  const getValue = () => value;

  return {
    getValue
  }
}