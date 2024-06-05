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

  return {
    getBoard
  }
})();

function Cell() {
}