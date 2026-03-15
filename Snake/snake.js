const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameRunning = false;
let gamePaused = false;
let direction = { x: 1, y: 0 };
let nextDirection = { x: 1, y: 0 };
let gameLoopId = null;

// Audio context for sound effects
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playSound(frequency, duration, type = 'sine') {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio not available');
    }
}

function playEatSound() {
    playSound(400, 0.1);
    setTimeout(() => playSound(600, 0.1), 100);
}

function playGameOverSound() {
    playSound(300, 0.2);
    setTimeout(() => playSound(200, 0.4), 200);
}

function playStartSound() {
    playSound(500, 0.1);
    setTimeout(() => playSound(700, 0.1), 100);
}

// Initialize high score display
highScoreDisplay.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

document.addEventListener('keydown', handleKeyPress);

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        snake = [{ x: 10, y: 10 }];
        score = 0;
        direction = { x: 1, y: 0 };
        nextDirection = { x: 1, y: 0 };
        scoreDisplay.textContent = score;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        pauseBtn.disabled = false;
        playStartSound();
        spawnFood();
        gameLoopId = setInterval(gameLoop, 100);
    }
}

function gameLoop() {
    if (gamePaused) return;

    // Update direction
    direction = nextDirection;

    // Calculate new head position
    const head = snake[0];
    let newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
    };

    // Wrap around walls
    newHead.x = (newHead.x + tileCount) % tileCount;
    newHead.y = (newHead.y + tileCount) % tileCount;

    // Check self collision
    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        endGame();
        return;
    }

    // Add new head
    snake.unshift(newHead);

    // Check food collision
    if (newHead.x === food.x && newHead.y === food.y) {
        score += 10;
        scoreDisplay.textContent = score;
        playEatSound();
        spawnFood();
    } else {
        // Remove tail if no food eaten
        snake.pop();
    }

    draw();
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake body
    ctx.fillStyle = '#00aa00';
    for (let i = 1; i < snake.length; i++) {
        const segment = snake[i];
        const centerX = segment.x * gridSize + gridSize / 2;
        const centerY = segment.y * gridSize + gridSize / 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, gridSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw snake head with direction indicator
    const head = snake[0];
    const headX = head.x * gridSize + gridSize / 2;
    const headY = head.y * gridSize + gridSize / 2;
    
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(headX, headY, gridSize / 2 - 1, 0, Math.PI * 2);
    ctx.fill();

    // Draw eyes on the head pointing in direction
    ctx.fillStyle = '#000';
    const eyeOffset = gridSize / 4;
    const eyeRadius = 2;
    
    if (direction.x === 1) { // Right
        ctx.beginPath();
        ctx.arc(headX + eyeOffset, headY - eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + eyeOffset, headY + eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction.x === -1) { // Left
        ctx.beginPath();
        ctx.arc(headX - eyeOffset, headY - eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX - eyeOffset, headY + eyeOffset / 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction.y === -1) { // Up
        ctx.beginPath();
        ctx.arc(headX - eyeOffset / 2, headY - eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + eyeOffset / 2, headY - eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    } else if (direction.y === 1) { // Down
        ctx.beginPath();
        ctx.arc(headX - eyeOffset / 2, headY + eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(headX + eyeOffset / 2, headY + eyeOffset, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw food as a star
    drawStar(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, 5, gridSize / 2, gridSize / 4);
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let step = Math.PI / spikes;

    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

function spawnFood() {
    let newFood;
    let foodOnSnake;

    do {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        foodOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    } while (foodOnSnake);

    food = newFood;
}

function handleKeyPress(event) {
    if (!gameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) nextDirection = { x: 0, y: -1 };
            event.preventDefault();
            break;
        case 'ArrowDown':
            if (direction.y === 0) nextDirection = { x: 0, y: 1 };
            event.preventDefault();
            break;
        case 'ArrowLeft':
            if (direction.x === 0) nextDirection = { x: -1, y: 0 };
            event.preventDefault();
            break;
        case 'ArrowRight':
            if (direction.x === 0) nextDirection = { x: 1, y: 0 };
            event.preventDefault();
            break;
    }
}

function togglePause() {
    if (!gameRunning) return;

    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? 'Resume' : 'Pause';
    gameStatusDisplay.textContent = gamePaused ? 'PAUSED' : '';
}

function endGame() {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoopId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';
    playGameOverSound();

    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('snakeHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        gameStatusDisplay.textContent = `Game Over! New High Score: ${score}`;
    } else {
        gameStatusDisplay.textContent = `Game Over! Score: ${score}`;
    }
}

// Initial draw
draw();
