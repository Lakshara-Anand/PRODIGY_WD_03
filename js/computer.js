const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const messageElement = document.getElementById('message');
const restartButton = document.getElementById('restartButton');
const backButton = document.getElementById('backButton');
const X_CLASS = 'x';
const O_CLASS = 'o';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
let oTurn = false;
let isGameOver = false;

startGame();

restartButton.addEventListener('click', startGame);
backButton.addEventListener('click', () => window.location.href = '../index.html');

function startGame() {
  oTurn = false;
  isGameOver = false;
  cells.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.classList.remove('winning-strike');
    cell.textContent = '';
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  messageElement.textContent = '';
}

function handleClick(e) {
  if (isGameOver) return;
  const cell = e.target;
  if (cell.textContent !== '') return;
  placeMark(cell, X_CLASS);
  if (checkWin(X_CLASS)) {
    endGame(false, X_CLASS);
  } else if (isDraw()) {
    endGame(true);
  } else {
    setTimeout(botMove, 500);
  }
}

function endGame(draw, currentClass) {
  isGameOver = true;
  if (draw) {
    messageElement.textContent = 'Draw!';
  } else {
    messageElement.textContent = `${currentClass.toUpperCase()} Wins!`;
    showWinningStrike(currentClass);
  }
}

function isDraw() {
  return [...cells].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass.toUpperCase();
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
  if (oTurn) {
    board.classList.add(O_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function botMove() {
  if (isGameOver) return;
  const availableCells = [...cells].filter(cell => !cell.classList.contains(X_CLASS) && !cell.classList.contains(O_CLASS));
  if (availableCells.length === 0) return;
  const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
  placeMark(randomCell, O_CLASS);
  if (checkWin(O_CLASS)) {
    endGame(false, O_CLASS);
  } else if (isDraw()) {
    endGame(true);
  }
}

function showWinningStrike(currentClass) {
  WINNING_COMBINATIONS.forEach(combination => {
    if (combination.every(index => cells[index].classList.contains(currentClass))) {
      combination.forEach(index => cells[index].classList.add('winning-strike'));
    }
  });
}
