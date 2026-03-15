// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game variables
const gravity = 0.5;
const gameSpeed = 5;
const gap = 280;
const pipeWidth = 52;

let bird = {
    x: 64,
    y: 265,
    radius: 12,
    velocity: 0,
    jump: -6,
    color: '#FFD700'
};

let pipes = [];
let score = 0;
let highScore = localStorage.getItem('flappyBirdHighScore') || 0;
let gameRunning = false;
let gameOverFlag = false;

// Elements
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const gameOverScreen = document.getElementById('gameOver');
const startScreen = document.getElementById('startScreen');
const restartBtn = document.getElementById('restartBtn');
const finalScoreDisplay = document.getElementById('finalScore');

// Sound functions using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playJumpSound() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 400;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

function playScoreSound() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.value = 600;
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
}

function playGameOverSound() {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
    oscillator.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Initialize high score display
highScoreDisplay.textContent = highScore;

// Pipe class
class Pipe {
    constructor() {
        this.x = canvas.width;
        this.pipeTop = Math.random() * (canvas.height - gap - 100) + 50;
        this.pipeBottom = this.pipeTop + gap;
        this.width = pipeWidth;
        this.passed = false;
        this.color = '#2ecc71';
    }

    draw() {
        // Top pipe
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, 0, this.width, this.pipeTop);
        
        // Bottom pipe
        ctx.fillRect(this.x, this.pipeBottom, this.width, canvas.height - this.pipeBottom);

        // Pipe borders
        ctx.strokeStyle = '#27ae60';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, 0, this.width, this.pipeTop);
        ctx.strokeRect(this.x, this.pipeBottom, this.width, canvas.height - this.pipeBottom);
    }

    update() {
        this.x -= gameSpeed;
    }

    offScreen() {
        return this.x + this.width < 0;
    }
}

// Draw bird
function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    
    // Rotate bird based on velocity
    const angle = Math.min(bird.velocity / 10, 1) * 0.3;
    ctx.rotate(angle);
    
    // Bird body
    ctx.fillStyle = bird.color;
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bird eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(5, -3, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(6, -3, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
}

// Update bird position
function updateBird() {
    bird.velocity += gravity;
    bird.y += bird.velocity;

    // Collision detection with ground
    if (bird.y + bird.radius > canvas.height) {
        endGame();
    }

    // Collision detection with ceiling
    if (bird.y - bird.radius < 0) {
        bird.y = bird.radius;
        bird.velocity = 0;
    }
}

// Create new pipes
function createPipe() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 150) {
        pipes.push(new Pipe());
    }
}

// Update pipes
function updatePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].update();

        // Check collision with bird
        if (checkCollision(pipes[i])) {
            endGame();
        }

        // Check if bird passed pipe
        if (!pipes[i].passed && pipes[i].x < bird.x) {
            pipes[i].passed = true;
            score++;
            scoreDisplay.textContent = score;
            playScoreSound();
        }

        // Remove off-screen pipes
        if (pipes[i].offScreen()) {
            pipes.splice(i, 1);
        }
    }
}

// Check collision
function checkCollision(pipe) {
    // Check if bird is horizontally aligned with pipe
    if (bird.x - bird.radius < pipe.x + pipe.width && bird.x + bird.radius > pipe.x) {
        // Check if bird is in the gap
        if (bird.y - bird.radius < pipe.pipeTop || bird.y + bird.radius > pipe.pipeBottom) {
            return true;
        }
    }
    return false;
}

// Game loop
function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameRunning) {
        updateBird();
        updatePipes();
        createPipe();
    }

    // Draw everything
    drawBird();
    pipes.forEach(pipe => pipe.draw());

    requestAnimationFrame(gameLoop);
}

// Start game
function startGame() {
    gameRunning = true;
    gameOverFlag = false;
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    score = 0;
    scoreDisplay.textContent = 0;
    bird.y = 265;
    bird.velocity = 0;
    pipes = [];
}

// End game
function endGame() {
    gameRunning = false;
    gameOverFlag = true;
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = score;
    playGameOverSound();

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = highScore;
        localStorage.setItem('flappyBirdHighScore', highScore);
    }
}

// Bird jump
function jump() {
    if (!gameOverFlag) {
        if (!gameRunning) {
            startGame();
        } else {
            bird.velocity = bird.jump;
            playJumpSound();
        }
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', jump);
restartBtn.addEventListener('click', startGame);

// Start the game loop
gameLoop();
