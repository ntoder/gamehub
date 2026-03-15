const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');

let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('dinoHighScore') || 0;
let gameSpeed = 6;
let gameSpeedIncrement = 0.002;

// Dino properties
let dino = {
    x: 50,
    y: 0,
    width: 40,
    height: 50,
    jumping: false,
    jumpPower: 0,
    velocityY: 0,
    gravity: 0.6
};

const groundLevel = canvas.height - 80;
dino.y = groundLevel;

let obstacles = [];
let clouds = [];
let particles = [];

let gameLoopId = null;
let audioContext = null;
let lastObstacleTime = 0;

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

        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio not available');
    }
}

function playJumpSound() {
    playSound(523.25, 0.1);
}

function playGameOverSound() {
    playSound(400, 0.2);
    setTimeout(() => playSound(300, 0.3), 200);
}

function playStartSound() {
    playSound(659.25, 0.1);
}

// Initialize high score
highScoreDisplay.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyPress);
canvas.addEventListener('click', () => {
    if (gameRunning && dino.y >= groundLevel - 5) {
        jump();
    }
});

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        gameSpeed = 6;
        dino.y = groundLevel;
        dino.velocityY = 0;
        dino.jumping = false;
        obstacles = [];
        scoreDisplay.textContent = score;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        lastObstacleTime = 0;
        playStartSound();
        gameLoopId = setInterval(gameLoop, 30);
    }
}

function handleKeyPress(event) {
    if (event.code === 'Space' && gameRunning) {
        if (dino.y >= groundLevel - 5) {
            jump();
        }
        event.preventDefault();
    }
}

function jump() {
    if (dino.y >= groundLevel - 5) {
        dino.velocityY = -15;
        dino.jumping = true;
        playJumpSound();
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Update dino
    dino.velocityY += dino.gravity;
    dino.y += dino.velocityY;

    if (dino.y >= groundLevel) {
        dino.y = groundLevel;
        dino.velocityY = 0;
        dino.jumping = false;
    }

    // Increase game speed
    gameSpeed += gameSpeedIncrement;

    // Generate obstacles
    lastObstacleTime++;
    if (lastObstacleTime > Math.max(60, 180 - score / 100)) {
        createObstacle();
        lastObstacleTime = 0;
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;

        // Check collision
        if (checkCollision(dino, obstacles[i])) {
            endGame();
            return;
        }

        // Remove off-screen obstacles and add score
        if (obstacles[i].x < -50) {
            obstacles.splice(i, 1);
            score += 10;
            scoreDisplay.textContent = score;
        }
    }

    // Update clouds
    for (let i = clouds.length - 1; i >= 0; i--) {
        clouds[i].x -= gameSpeed * 0.3;
        if (clouds[i].x < -100) {
            clouds.splice(i, 1);
        }
    }

    // Create clouds occasionally
    if (Math.random() < 0.01 && clouds.length < 5) {
        clouds.push({
            x: canvas.width,
            y: Math.random() * 80 + 20,
            width: 60,
            height: 30
        });
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].x -= gameSpeed;
        particles[i].life--;
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function createObstacle() {
    const type = Math.random() > 0.7 ? 'bird' : 'cactus';
    const obstacle = {
        x: canvas.width,
        width: type === 'bird' ? 40 : 20,
        height: type === 'bird' ? 30 : 40,
        type: type
    };

    if (type === 'bird') {
        obstacle.y = groundLevel - 60;
    } else {
        obstacle.y = groundLevel;
    }

    obstacles.push(obstacle);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function draw() {
    // Clear canvas with sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cloud.x + 20, cloud.y - 10, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cloud.x + 40, cloud.y, 20, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw ground
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundLevel + 30);
    ctx.lineTo(canvas.width, groundLevel + 30);
    ctx.stroke();

    // Draw ground pattern
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i - (gameSpeed * 2) % 20, groundLevel + 30);
        ctx.lineTo(i - (gameSpeed * 2) % 20 + 10, groundLevel + 30);
        ctx.stroke();
    }

    // Draw dino
    drawDino();

    // Draw obstacles
    obstacles.forEach(obstacle => {
        if (obstacle.type === 'cactus') {
            drawCactus(obstacle.x, obstacle.y);
        } else {
            drawBird(obstacle.x, obstacle.y);
        }
    });

    // Draw score in top right
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Speed: ' + gameSpeed.toFixed(1), canvas.width - 20, 30);

    // Draw speed indicator
    ctx.fillStyle = '#ddd';
    ctx.fillRect(canvas.width - 200, 40, 180, 10);
    ctx.fillStyle = '#667eea';
    ctx.fillRect(canvas.width - 200, 40, (gameSpeed / 15) * 180, 10);
}

function drawDino() {
    const x = dino.x;
    const y = dino.y;

    // Body
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(x, y + 20, 30, 25);

    // Head
    ctx.beginPath();
    ctx.arc(x + 30, y + 15, 15, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 35, y + 10, 3, 0, Math.PI * 2);
    ctx.fill();

    // Back legs
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(x + 5, y + 45, 8, 20);
    ctx.fillRect(x + 18, y + 45, 8, 20);

    // Front legs
    ctx.fillRect(x + 25, y + 45, 8, 20);
    ctx.fillRect(x + 33, y + 45, 8, 20);

    // Tail
    ctx.beginPath();
    ctx.moveTo(x, y + 30);
    ctx.quadraticCurveTo(x - 15, y + 20, x - 20, y + 5);
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 8;
    ctx.stroke();
}

function drawCactus(x, y) {
    ctx.fillStyle = '#2d5016';
    
    // Main stem
    ctx.fillRect(x + 7, y - 40, 6, 40);

    // Arms
    ctx.fillRect(x - 5, y - 25, 12, 4);
    ctx.fillRect(x + 10, y - 20, 12, 4);

    // Spikes
    ctx.fillStyle = '#1a3009';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 8, y - 35 + i * 8, 4, 2);
    }
}

function drawBird(x, y) {
    ctx.fillStyle = '#333';
    
    // Body
    ctx.beginPath();
    ctx.arc(x + 20, y + 15, 10, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(x + 30, y + 10, 8, 0, Math.PI * 2);
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 15);
    ctx.quadraticCurveTo(x + 10, y + 5, x + 15, y + 20);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + 20, y + 15);
    ctx.quadraticCurveTo(x + 35, y + 5, x + 30, y + 20);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x + 32, y + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(x + 37, y + 10);
    ctx.lineTo(x + 42, y + 10);
    ctx.lineTo(x + 39, y + 12);
    ctx.fill();
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    playGameOverSound();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('dinoHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        gameStatusDisplay.textContent = `Game Over! New High Score: ${score}`;
    } else {
        gameStatusDisplay.textContent = `Game Over! Score: ${score}`;
    }
}

// Initial draw
draw();
