const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const linesDisplay = document.getElementById('lines');
const levelDisplay = document.getElementById('level');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Tetromino shapes
const TETROMINOS = [
    { shape: [[1, 1, 1, 1]], color: '#00F0F1' }, // I
    { shape: [[1, 1], [1, 1]], color: '#F0E130' }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#AF00F7' }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00F130' }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#F7260D' }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#004DFF' }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#FF6600' }  // L
];

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let lines = 0;
let level = 1;
let gameRunning = false;
let gamePaused = false;
let gameLoopId = null;
let audioContext = null;
let keysPressed = {};
let dropCounter = 0;
let dropInterval = 1000;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playSound(frequency, duration) {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio not available');
    }
}

function playMoveSound() {
    playSound(400, 0.05);
}

function playRotateSound() {
    playSound(500, 0.08);
}

function playLineSound() {
    playSound(600, 0.1);
    setTimeout(() => playSound(700, 0.1), 120);
    setTimeout(() => playSound(800, 0.1), 240);
}

function playGameOverSound() {
    playSound(300, 0.2);
    setTimeout(() => playSound(200, 0.3), 200);
}

function playStartSound() {
    playSound(659.25, 0.08);
    setTimeout(() => playSound(783.99, 0.08), 100);
}

function initBoard() {
    board = [];
    for (let y = 0; y < ROWS; y++) {
        board[y] = [];
        for (let x = 0; x < COLS; x++) {
            board[y][x] = 0;
        }
    }
}

function getRandomPiece() {
    const piece = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2),
        y: 0
    };
}

function rotate(piece) {
    const newPiece = JSON.parse(JSON.stringify(piece));
    const shape = newPiece.shape;
    
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            newPiece.shape[i][j] = shape[shape.length - 1 - j][i];
        }
    }
    
    const newShape = [];
    for (let i = 0; i < shape[0].length; i++) {
        newShape[i] = [];
        for (let j = 0; j < shape.length; j++) {
            newShape[i][j] = newPiece.shape[j][i];
        }
    }
    
    newPiece.shape = newShape;
    return newPiece;
}

function rotateReverse(piece) {
    // Rotate counter-clockwise (opposite direction)
    const newPiece = JSON.parse(JSON.stringify(piece));
    const shape = newPiece.shape;
    
    // Rotate 3 times clockwise to get counter-clockwise effect
    let rotated = rotate(newPiece);
    rotated = rotate(rotated);
    rotated = rotate(rotated);
    
    return rotated;
}

function isValidMove(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardX = piece.x + x;
                const boardY = piece.y + y;

                if (boardX < 0 || boardX >= COLS || boardY >= ROWS) {
                    return false;
                }

                if (boardY >= 0 && board[boardY][boardX]) {
                    return false;
                }
            }
        }
    }
    return true;
}

function placePiece(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
                const boardY = piece.y + y;
                const boardX = piece.x + x;

                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = piece.color;
                }
            }
        }
    }
}

function clearLines() {
    let clearedLines = 0;

    for (let y = ROWS - 1; y >= 0; y--) {
        let isFull = true;
        for (let x = 0; x < COLS; x++) {
            if (!board[y][x]) {
                isFull = false;
                break;
            }
        }

        if (isFull) {
            board.splice(y, 1);
            board.unshift(new Array(COLS).fill(0));
            clearedLines++;
            y++; // Check this row again
        }
    }

    if (clearedLines > 0) {
        const pointsTable = [40, 100, 300, 1200];
        score += pointsTable[clearedLines - 1] * level;
        lines += clearedLines;
        level = Math.floor(lines / 10) + 1;
        dropInterval = Math.max(100, 1000 - (level - 1) * 100);
        
        scoreDisplay.textContent = score;
        linesDisplay.textContent = lines;
        levelDisplay.textContent = level;
        playLineSound();
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    keysPressed[event.key] = true;

    if (!gameRunning) return;

    switch (event.key) {
        case 'ArrowLeft':
            if (currentPiece) {
                currentPiece.x--;
                if (!isValidMove(currentPiece)) {
                    currentPiece.x++;
                } else {
                    playMoveSound();
                }
            }
            event.preventDefault();
            break;
        case 'ArrowRight':
            if (currentPiece) {
                currentPiece.x++;
                if (!isValidMove(currentPiece)) {
                    currentPiece.x--;
                } else {
                    playMoveSound();
                }
            }
            event.preventDefault();
            break;
        case 'ArrowDown':
            if (currentPiece) {
                currentPiece.y++;
                if (!isValidMove(currentPiece)) {
                    currentPiece.y--;
                    placePiece(currentPiece);
                    clearLines();
                    currentPiece = nextPiece;
                    nextPiece = getRandomPiece();

                    if (!isValidMove(currentPiece)) {
                        endGame();
                    }
                }
            }
            event.preventDefault();
            break;
        case ' ':
            if (currentPiece) {
                const rotated = rotate(currentPiece);
                if (isValidMove(rotated)) {
                    currentPiece = rotated;
                    playRotateSound();
                } else {
                    // Try wall kick
                    rotated.x++;
                    if (isValidMove(rotated)) {
                        currentPiece = rotated;
                        playRotateSound();
                    } else {
                        rotated.x -= 2;
                        if (isValidMove(rotated)) {
                            currentPiece = rotated;
                            playRotateSound();
                        }
                    }
                }
            }
            event.preventDefault();
            break;
        case 'z':
        case 'Z':
            if (currentPiece) {
                const rotatedReverse = rotateReverse(currentPiece);
                if (isValidMove(rotatedReverse)) {
                    currentPiece = rotatedReverse;
                    playRotateSound();
                } else {
                    // Try wall kick
                    rotatedReverse.x++;
                    if (isValidMove(rotatedReverse)) {
                        currentPiece = rotatedReverse;
                        playRotateSound();
                    } else {
                        rotatedReverse.x -= 2;
                        if (isValidMove(rotatedReverse)) {
                            currentPiece = rotatedReverse;
                            playRotateSound();
                        }
                    }
                }
            }
            event.preventDefault();
            break;
    }
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lines = 0;
        level = 1;
        dropInterval = 1000;
        scoreDisplay.textContent = score;
        linesDisplay.textContent = lines;
        levelDisplay.textContent = level;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        pauseBtn.disabled = false;
        pauseBtn.textContent = 'Pause';
        initBoard();
        currentPiece = getRandomPiece();
        nextPiece = getRandomPiece();
        dropCounter = 0;
        playStartSound();
        gameLoopId = setInterval(gameLoop, 30);
    }
}

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    gameStatusDisplay.textContent = gamePaused ? 'PAUSED' : '';
}

function gameLoop() {
    if (gamePaused) return;

    dropCounter += 30;

    if (dropCounter > dropInterval) {
        if (currentPiece) {
            currentPiece.y++;
            if (!isValidMove(currentPiece)) {
                currentPiece.y--;
                placePiece(currentPiece);
                clearLines();
                currentPiece = nextPiece;
                nextPiece = getRandomPiece();

                if (!isValidMove(currentPiece)) {
                    endGame();
                    return;
                }
            }
        }
        dropCounter = 0;
    }

    draw();
}

function draw() {
    // Draw main canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * BLOCK_SIZE, 0);
        ctx.lineTo(x * BLOCK_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * BLOCK_SIZE);
        ctx.lineTo(canvas.width, y * BLOCK_SIZE);
        ctx.stroke();
    }

    // Draw board
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }

    // Draw current piece
    if (currentPiece) {
        ctx.fillStyle = currentPiece.color;
        for (let y = 0; y < currentPiece.shape.length; y++) {
            for (let x = 0; x < currentPiece.shape[y].length; x++) {
                if (currentPiece.shape[y][x]) {
                    const boardX = currentPiece.x + x;
                    const boardY = currentPiece.y + y;
                    if (boardY >= 0) {
                        ctx.fillRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(boardX * BLOCK_SIZE, boardY * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                    }
                }
            }
        }
    }

    // Draw next piece
    drawNextPiece();
}

function drawNextPiece() {
    nextCtx.fillStyle = '#1a1a1a';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);

    if (nextPiece) {
        const blockSize = 25;
        const offsetX = (nextCanvas.width - nextPiece.shape[0].length * blockSize) / 2;
        const offsetY = (nextCanvas.height - nextPiece.shape.length * blockSize) / 2;

        nextCtx.fillStyle = nextPiece.color;
        for (let y = 0; y < nextPiece.shape.length; y++) {
            for (let x = 0; x < nextPiece.shape[y].length; x++) {
                if (nextPiece.shape[y][x]) {
                    nextCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                    nextCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    nextCtx.lineWidth = 1;
                    nextCtx.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize - 1,
                        blockSize - 1
                    );
                }
            }
        }
    }
}

function endGame() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoopId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    playGameOverSound();
    gameStatusDisplay.textContent = `Game Over! Final Score: ${score} | Lines: ${lines} | Level: ${level}`;
}

// Initial setup
initBoard();
draw();
