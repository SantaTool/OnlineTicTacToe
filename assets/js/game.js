document.addEventListener('DOMContentLoaded', () => {
    const board = document.querySelector('.game-board');
    const status = document.querySelector('.status');
    const resetBtn = document.querySelector('.reset-btn');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const clickSound = document.getElementById('click-sound');
    const drawSound = document.getElementById('draw-sound');
    const winSound = document.getElementById('win-sound');
    const sfxToggleBtn = document.querySelector('.sfx-toggle-btn');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let sfxMuted = false;
    sfxToggleBtn.addEventListener('click', () => {
        sfxMuted = !sfxMuted;
        sfxToggleBtn.textContent = sfxMuted ? '🔇' : '🔊';
    });

    // Initialize game board
    function initializeBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-index', i);
            cell.addEventListener('click', handleCellClick);
            board.appendChild(cell);
        }
        updateStatus();
    }

    // Handle cell click
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) return;
        if (!sfxMuted) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer === 'X' ? 'text-primary' : 'text-secondary');
        
        checkResult();
    }

    // Check game result
    function checkResult() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        let roundWon = false;
        let winningPattern = [];
        
        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                roundWon = true;
                winningPattern = pattern;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            if (!sfxMuted) {
                winSound.currentTime = 0;
                winSound.play();
            }
            
            // Highlight winning cells
            const cells = document.querySelectorAll('.cell');
            winningPattern.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            if (!sfxMuted) {
                drawSound.currentTime = 0;
                drawSound.play();
            }
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
    }

    // Update status
    function updateStatus() {
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    // Reset game
    function resetGame() {
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        initializeBoard();
    }

    // Theme switcher
    function changeTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // Initialize
    initializeBoard();
    resetBtn.addEventListener('click', resetGame);
    
    // Theme buttons
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            changeTheme(button.getAttribute('data-theme'));
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'default';
    changeTheme(savedTheme);
});