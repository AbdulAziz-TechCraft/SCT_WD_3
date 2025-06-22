const cells = document.querySelectorAll('.cell');
const announcer = document.getElementById('announcer');
const restartBtn = document.getElementById('restart');
const playerForm = document.getElementById('playerForm');
const gameDiv = document.getElementById('game');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreDraw = document.getElementById('scoreDraw');
const playerXInput = document.getElementById('playerX');
const playerOInput = document.getElementById('playerO');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalRestart = document.getElementById('modal-restart');
const closeModal = document.getElementById('close-modal');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isGameActive = false;
let playerNames = { X: "Player X", O: "Player O" };
let scores = { X: 0, O: 0, Draw: 0 };

const WINNING_COMBINATIONS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

function announceStatus(msg) {
    announcer.textContent = msg;
}

function highlightWin(combination) {
    combination.forEach(idx => {
        cells[idx].classList.add('win');
        cells[idx].setAttribute('aria-label', `${cells[idx].textContent} (winning cell)`);
    });
}

function updateScoreboard() {
    scoreX.textContent = `${playerNames.X}: ${scores.X}`;
    scoreO.textContent = `${playerNames.O}: ${scores.O}`;
    scoreDraw.textContent = `Draws: ${scores.Draw}`;
}

function handleCellAction(e) {
    let cell = e.target;
    if (!cell.classList.contains('cell')) return;
    const index = parseInt(cell.getAttribute('data-index'));
    if (board[index] !== "" || !isGameActive) return;

    board[index] = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.setAttribute('aria-label', `${playerNames[currentPlayer]} placed ${currentPlayer}`);

    const winCombo = checkWinner();
    if (winCombo) {
        highlightWin(winCombo);
        scores[currentPlayer]++;
        updateScoreboard();
        showModal(`${playerNames[currentPlayer]} Wins! 🏆`, `Congratulations, ${playerNames[currentPlayer]}!`);
        isGameActive = false;
    } else if (board.every(cell => cell !== "")) {
        scores.Draw++;
        updateScoreboard();
        showModal("It's a Draw!", "Try again for a winner!");
        isGameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        announceStatus(`${playerNames[currentPlayer]}'s turn (${currentPlayer})`);
    }
}

function checkWinner() {
    for (let combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return combo;
        }
    }
    return null;
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    isGameActive = true;
    cells.forEach(cell => {
        cell.classList.remove('x', 'o', 'win');
        cell.textContent = "";
        cell.setAttribute('aria-label', cell.getAttribute('aria-label').replace(/(placed .*)|(winning cell)/g, '').trim());
    });
    announceStatus(`${playerNames[currentPlayer]}'s turn (${currentPlayer})`);
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellAction);
    cell.addEventListener('keydown', function(e) {
        if (e.key === "Enter" || e.key === " ") handleCellAction(e);
    });
});

restartBtn.addEventListener('click', restartGame);

playerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    playerNames.X = playerXInput.value.trim() || "Player X";
    playerNames.O = playerOInput.value.trim() || "Player O";
    updateScoreboard();
    playerForm.style.display = "none";
    gameDiv.style.display = "";
    restartGame();
    announcer.focus();
});

// Modal functions
function showModal(title, message) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('show');
}
function hideModal() {
    modal.classList.remove('show');
    restartGame();
}
modalRestart.addEventListener('click', hideModal);
closeModal.addEventListener('click', hideModal);
window.addEventListener('click', function(e) {
    if (e.target === modal) hideModal();
});

// Initialize
updateScoreboard();
