function Gameboard() {
  const board = [];

  const initializeBoard = () => {
    // make 3x3 2D array of cells
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i].push(Cell());
      }
    }
  }

  const getBoard = () => board;

  const getBoardValues = () => {
    return board.map((row) => row.map((cell) => cell.getValue()));
  }

  // get cell at position [row, column] coordinates
  const getCell = (pos) => {
    return board[pos[0]][pos[1]];
  }

  const placeMark = (player, pos) => {
    getCell(pos).addMark(player);
  }

  return {
    initializeBoard,
    getBoard,
    getBoardValues,
    getCell,
    placeMark
  }
}

function Cell() {
  let value = " "; // default for empty cell

  const getValue = () => value;

  const addMark = (player) => {
    value = player.mark;
  };

  return {
    getValue,
    addMark
  }
}

function GameController() {
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
  let activePlayer;

  const intializeGame = () => {
    board.initializeBoard();
    activePlayer = players[0];
  }

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }
  const getActivePlayer = () => activePlayer;

  const renamePlayer = (playerIndex, name) => {
    players[playerIndex].name = name;
  }

  const playRound = (cellPos) => {
    // prevent playing on a spot that's already marked
    if (board.getCell(cellPos).getValue() !== " ") {
      throw "Spot already taken";
    }
    else {
      board.placeMark(activePlayer, cellPos);

      const gameOverState = checkForGameOver(cellPos);
      if (gameOverState === false) {
        switchPlayer();
      }
      return gameOverState;
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
        return "win";
      }
    // column of last move
    if (boardValues[0][lastMove[1]] === mark &&
        boardValues[1][lastMove[1]] === mark && 
        boardValues[2][lastMove[1]] === mark
      ) {
        return "win";
    }
    // if last move was top left or bottom right corner
    if (lastMove[0] === lastMove[1]) {
      // top left to bottom right diagonal
      if (boardValues[0][0] === mark &&
          boardValues[1][1] === mark &&
          boardValues[2][2] === mark
      ) {
        return "win";
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
        return "win";
      }
    }
    // if there are no empty spots but no one won, it's a draw
    if (!boardValues.flat().includes(" ")) {
      return "draw";
    }
    return false;
  }

  intializeGame();

  return {
    intializeGame,
    playRound,
    getActivePlayer,
    renamePlayer,
    getBoard: board.getBoard,
  }
}

const displayController = (function() {
  const game = GameController();
  const gameStateHeader = document.querySelector('#game-state');
  const spotTakenMsg = document.querySelector('#spot-taken');
  const boardDiv = document.querySelector('#board');
  const renameBtns = document.querySelectorAll('.rename-btn');
  const restartBtn = document.querySelector('#restart');

  const updateDisplay = (gameOverState) => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    
    // update header message
    if (gameOverState) {
      if (gameOverState === "win") {
        gameStateMsg = `${activePlayer.name} wins!`
      } else {
        gameStateMsg = "It's a draw!"
      }
    } else {
      gameStateMsg = `${activePlayer.name}'s turn (${activePlayer.mark})`;
    }

    gameStateHeader.textContent = gameStateMsg;
    boardDiv.textContent = "";
    
    // generate cell buttons
    board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellBtn = document.createElement("button");
        cellBtn.setAttribute("type", "button");
        cellBtn.dataset.index = `${rowIndex},${cellIndex}`;
        cellBtn.classList.add("cell");
        cellBtn.textContent = cell.getValue();
        // if game has ended, disable buttons
        if (gameOverState) {
          cellBtn.disabled = true;
        } else {
          cellBtn.addEventListener("click", gameboardClickHandler);
        }
        boardDiv.appendChild(cellBtn);
      })
    })
  }

  function toggleSpotTakenMsg(shown) {
    if (shown) {
      spotTakenMsg.style.display = "block";
    } else {
      spotTakenMsg.style.display = "none";
    }
  }

  function gameboardClickHandler(e) {
    const index = e.target.dataset.index.split(",");
    
    // if playRound failed, the play was invalid due to being on an already taken spot
    try {
      updateDisplay(game.playRound(index));
      toggleSpotTakenMsg(false);
    } catch {
      toggleSpotTakenMsg(true);
    }
  }

  renameBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const newName = prompt("New name:");
      game.renamePlayer(btn.dataset.playerIndex, newName);
      // update button text
      btn.lastChild.textContent = newName;
      updateDisplay();
    })
  })
  restartBtn.addEventListener("click", () => {
    game.intializeGame();
    updateDisplay();
  })

  updateDisplay();
})();