const boardEl = document.getElementById("board");
const message = document.getElementById("message");
const xScore = document.getElementById("xScore");
const oScore = document.getElementById("oScore");
const resetBtn = document.getElementById("resetBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let xWins = 0;
let oWins = 0;
let currentRound = 1;
let gameCount = 0;
let isPlayerVsAI = window.location.href.includes("ai");

function createBoard() {
  boardEl.innerHTML = "";
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  message.textContent = "Your turn (X)";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleCellClick);
    boardEl.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.getAttribute("data-index");

  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWin(currentPlayer)) {
    gameActive = false;
    if (currentPlayer === "X") {
      xWins++;
      xScore.textContent = xWins;
      message.textContent = "X wins this game!";
    } else {
      oWins++;
      oScore.textContent = oWins;
      message.textContent = "O wins this game!";
    }
    gameCount++;
    if (gameCount < 3) {
      setTimeout(() => {
        resetBoard();
      }, 1500);
    } else {
      setTimeout(() => {
        declareRoundWinner();
      }, 1500);
    }
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    message.textContent = "It's a draw!";
    gameCount++;
    if (gameCount < 3) {
      setTimeout(() => {
        resetBoard();
      }, 1500);
    } else {
      setTimeout(() => {
        declareRoundWinner();
      }, 1500);
    }
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  if (!isPlayerVsAI) {
    message.textContent = `Your turn (${currentPlayer})`;
  } else if (currentPlayer === "O") {
    message.textContent = "AI's turn...";
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  if (!gameActive) return;

  const emptyCells = board.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  const cell = boardEl.querySelector(`[data-index='${randomIndex}']`);
  cell.textContent = "O";

  if (checkWin("O")) {
    gameActive = false;
    oWins++;
    oScore.textContent = oWins;
    message.textContent = "AI wins this game!";
    gameCount++;
    if (gameCount < 3) {
      setTimeout(() => {
        resetBoard();
      }, 1500);
    } else {
      setTimeout(() => {
        declareRoundWinner();
      }, 1500);
    }
    return;
  }

  if (board.every(cell => cell !== "")) {
    gameActive = false;
    message.textContent = "It's a draw!";
    gameCount++;
    if (gameCount < 3) {
      setTimeout(() => {
        resetBoard();
      }, 1500);
    } else {
      setTimeout(() => {
        declareRoundWinner();
      }, 1500);
    }
    return;
  }

  currentPlayer = "X";
  message.textContent = "Your turn (X)";
}

function checkWin(player) {
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  return wins.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function resetBoard() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.textContent = "";
  });
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  message.textContent = "Your turn (X)";
}

function declareRoundWinner() {
  if (xWins > oWins) {
    message.textContent = "X wins the round!";
  } else if (oWins > xWins) {
    message.textContent = "O wins the round!";
  } else {
    message.textContent = "It's a draw for the round!";
  }

  setTimeout(() => {
    resetBtn.style.display = "inline-block";
  }, 1000);
}

resetBtn.addEventListener("click", () => {
  xWins = 0;
  oWins = 0;
  xScore.textContent = "0";
  oScore.textContent = "0";
  currentRound++;
  document.getElementById("round").textContent = currentRound;
  gameCount = 0;
  resetBoard();
});

createBoard();
