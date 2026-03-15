const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

const tileSize = 20;
const cols = canvas.width / tileSize;
const rows = canvas.height / tileSize;

// Game states
let gameRunning = false;
let gamePaused = false;
let score = 0;
let lives = 3;
let pellets = [];
let powerPellets = [];

// Pacman
let pacman = {
    x: 1,
    y: 1,
    direction: { x: 0, y: 0 },
    nextDirection: { x: 0, y: 0 }
};

// Ghosts
let ghosts = [
    { x: 13, y: 7, color: '#ff0000', speed: 1 }, // Red
    { x: 14, y: 8, color: '#ffb6c1', speed: 1 }, // Pink
    { x: 13, y: 8, color: '#00ffff', speed: 1 }, // Cyan
    { x: 14, y: 7, color: '#ffba55', speed: 1 }  // Orange
];

let gameLoopId = null;
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

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio not available');
    }
}

function playPelletSound() {
    // Classic "waka" sound - alternating frequencies like Pacman eating
    playSound(369.99, 0.05);
    setTimeout(() => playSound(293.66, 0.05), 60);
}

function playPowerPelletSound() {
    // Different sound for power pellets
    playSound(659.25, 0.1);
    setTimeout(() => playSound(783.99, 0.1), 120);
    setTimeout(() => playSound(987.77, 0.1), 240);
}

function playGameOverSound() {
    // Descending wail when caught
    playSound(400, 0.15);
    setTimeout(() => playSound(350, 0.15), 150);
    setTimeout(() => playSound(300, 0.15), 300);
    setTimeout(() => playSound(250, 0.2), 450);
}

function playStartSound() {
    // Pacman opening mouth sound
    playSound(659.25, 0.08);
    setTimeout(() => playSound(783.99, 0.08), 100);
    setTimeout(() => playSound(659.25, 0.1), 200);
}

function playWinSound() {
    // Victory jingle
    playSound(523.25, 0.1);
    setTimeout(() => playSound(659.25, 0.1), 120);
    setTimeout(() => playSound(783.99, 0.1), 240);
    setTimeout(() => playSound(987.77, 0.2), 360);
}

// Initialize pellets
function initializePellets() {
    pellets = [];
    powerPellets = [];
    for (let y = 1; y < rows - 1; y++) {
        for (let x = 1; x < cols - 1; x++) {
            // Don't place pellets in ghost starting area
            if ((x < 12 || x > 15) || (y < 6 || y > 9)) {
                if (Math.random() > 0.15) {
                    pellets.push({ x, y });
                }
            }
        }
    }
    // Add power pellets in corners
    powerPellets.push({ x: 1, y: 1 });
    powerPellets.push({ x: cols - 2, y: 1 });
    powerPellets.push({ x: 1, y: rows - 2 });
    powerPellets.push({ x: cols - 2, y: rows - 2 });
}

// Event listeners
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
document.addEventListener('keydown', handleKeyPress);

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        score = 0;
        lives = 3;
        pacman = { x: 1, y: 1, direction: { x: 0, y: 0 }, nextDirection: { x: 0, y: 0 } };
        ghosts = [
            { x: 13, y: 7, color: '#ff0000', speed: 1 },
            { x: 14, y: 8, color: '#ffb6c1', speed: 1 },
            { x: 13, y: 8, color: '#00ffff', speed: 1 },
            { x: 14, y: 7, color: '#ffba55', speed: 1 }
        ];
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        pauseBtn.disabled = false;
        initializePellets();
        playStartSound();
        gameLoopId = setInterval(gameLoop, 100);
    }
}

function gameLoop() {
    if (gamePaused) return;

    // Update Pacman direction
    pacman.direction = pacman.nextDirection;

    // Move Pacman
    const newX = pacman.x + pacman.direction.x;
    const newY = pacman.y + pacman.direction.y;

    if (newX > 0 && newX < cols && newY > 0 && newY < rows) {
        pacman.x = newX;
        pacman.y = newY;
    }

    // Check pellet collision
    pellets = pellets.filter(pellet => {
        if (pellet.x === pacman.x && pellet.y === pacman.y) {
            score += 10;
            playPelletSound();
            return false;
        }
        return true;
    });

    // Check power pellet collision
    powerPellets = powerPellets.filter(pellet => {
        if (pellet.x === pacman.x && pellet.y === pacman.y) {
            score += 50;
            playPowerPelletSound();
            return false;
        }
        return true;
    });

    scoreDisplay.textContent = score;

    // Win condition
    if (pellets.length === 0 && powerPellets.length === 0) {
        endGame(true);
        return;
    }

    // Move ghosts
    ghosts.forEach(ghost => {
        moveGhost(ghost);
    });

    // Check ghost collision
    for (let ghost of ghosts) {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            lives--;
            livesDisplay.textContent = lives;
            if (lives === 0) {
                endGame(false);
                return;
            }
            // Reset Pacman position
            pacman.x = 1;
            pacman.y = 1;
            pacman.direction = { x: 0, y: 0 };
            pacman.nextDirection = { x: 0, y: 0 };
            playGameOverSound();
        }
    }

    draw();
}

function moveGhost(ghost) {
    const dx = pacman.x - ghost.x;
    const dy = pacman.y - ghost.y;

    // Simple AI: move towards Pacman with some randomness
    const random = Math.random();
    let newX = ghost.x;
    let newY = ghost.y;

    if (random < 0.7) {
        if (Math.abs(dx) > Math.abs(dy)) {
            newX = ghost.x + (dx > 0 ? 1 : -1);
        } else {
            newY = ghost.y + (dy > 0 ? 1 : -1);
        }
    } else {
        const rand = Math.random();
        if (rand < 0.25) newX += 1;
        else if (rand < 0.5) newX -= 1;
        else if (rand < 0.75) newY += 1;
        else newY -= 1;
    }

    // Keep ghost in bounds
    if (newX > 0 && newX < cols && newY > 0 && newY < rows) {
        ghost.x = newX;
        ghost.y = newY;
    }
}

function handleKeyPress(event) {
    if (!gameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            pacman.nextDirection = { x: 0, y: -1 };
            event.preventDefault();
            break;
        case 'ArrowDown':
            pacman.nextDirection = { x: 0, y: 1 };
            event.preventDefault();
            break;
        case 'ArrowLeft':
            pacman.nextDirection = { x: -1, y: 0 };
            event.preventDefault();
            break;
        case 'ArrowRight':
            pacman.nextDirection = { x: 1, y: 0 };
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

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw walls
    ctx.strokeStyle = '#0066ff';
    ctx.lineWidth = 2;
    ctx.strokeRect(tileSize / 2, tileSize / 2, canvas.width - tileSize, canvas.height - tileSize);

    // Draw pellets
    ctx.fillStyle = '#ffb8ff';
    pellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x * tileSize + tileSize / 2, pellet.y * tileSize + tileSize / 2, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw power pellets
    ctx.fillStyle = '#ffffff';
    powerPellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x * tileSize + tileSize / 2, pellet.y * tileSize + tileSize / 2, 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Pacman
    drawPacman();

    // Draw ghosts
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize / 2, ghost.y * tileSize + tileSize / 2, tileSize / 2 - 1, 0, Math.PI * 2);
        ctx.fill();

        // Draw ghost eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize / 2 - 3, ghost.y * tileSize + tileSize / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ghost.x * tileSize + tileSize / 2 + 3, ghost.y * tileSize + tileSize / 2 - 2, 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawPacman() {
    const pacmanX = pacman.x * tileSize + tileSize / 2;
    const pacmanY = pacman.y * tileSize + tileSize / 2;
    const mouthAngle = 0.3;

    ctx.fillStyle = '#ffff00';
    ctx.beginPath();

    // Determine mouth direction based on Pacman's direction
    let startAngle = 0;
    let endAngle = Math.PI * 2;

    if (pacman.direction.x === 1) { // Right
        startAngle = -mouthAngle;
        endAngle = mouthAngle;
    } else if (pacman.direction.x === -1) { // Left
        startAngle = Math.PI - mouthAngle;
        endAngle = Math.PI + mouthAngle;
    } else if (pacman.direction.y === -1) { // Up
        startAngle = Math.PI / 2 - mouthAngle;
        endAngle = Math.PI / 2 + mouthAngle;
    } else if (pacman.direction.y === 1) { // Down
        startAngle = -Math.PI / 2 - mouthAngle;
        endAngle = -Math.PI / 2 + mouthAngle;
    }

    ctx.arc(pacmanX, pacmanY, tileSize / 2 - 1, startAngle, endAngle);
    ctx.lineTo(pacmanX, pacmanY);
    ctx.fill();
}

function endGame(won) {
    gameRunning = false;
    gamePaused = false;
    clearInterval(gameLoopId);
    pauseBtn.disabled = true;
    pauseBtn.textContent = 'Pause';

    if (won) {
        playWinSound();
        gameStatusDisplay.textContent = `You Won! Final Score: ${score}`;
    } else {
        playGameOverSound();
        gameStatusDisplay.textContent = `Game Over! Final Score: ${score}`;
    }
}

// Initial draw
draw();
