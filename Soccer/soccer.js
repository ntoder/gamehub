const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playerScoreDisplay = document.getElementById('playerScore');
const aiScoreDisplay = document.getElementById('aiScore');
const timeDisplay = document.getElementById('time');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');

let gameRunning = false;
let gamePaused = false;
let playerScore = 0;
let aiScore = 0;
let timeLeft = 90;
let gameLoopId = null;
let keysPressed = {};

// Field dimensions
const fieldWidth = canvas.width;
const fieldHeight = canvas.height;
const goalWidth = 80;
const goalHeight = 200;
const centerLine = fieldWidth / 2;

// Player (blue)
const player = {
    x: 150,
    y: fieldHeight / 2,
    width: 30,
    height: 30,
    speed: 5,
    velocityX: 0,
    velocityY: 0,
    color: '#2196F3'
};

// AI (red)
const ai = {
    x: fieldWidth - 150,
    y: fieldHeight / 2,
    width: 30,
    height: 30,
    speed: 4.5,
    velocityX: 0,
    velocityY: 0,
    color: '#F44336'
};

// Ball
const ball = {
    x: centerLine,
    y: fieldHeight / 2,
    radius: 8,
    velocityX: 0,
    velocityY: 0,
    friction: 0.98,
    color: '#FFF'
};

let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playSound(frequency, duration, type = 'sine', volume = 0.1) {
    try {
        const ctx = getAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
        console.log('Audio not available');
    }
}

function playKickSound() {
    // Powerful kick sound with multiple frequencies
    playSound(200, 0.05, 'sine', 0.15);
    setTimeout(() => playSound(450, 0.12, 'sine', 0.12), 30);
    setTimeout(() => playSound(650, 0.1, 'sine', 0.1), 60);
}

function playHardKickSound() {
    // Extra powerful kick for stronger shots
    playSound(180, 0.08, 'sine', 0.18);
    setTimeout(() => playSound(500, 0.15, 'sine', 0.15), 40);
    setTimeout(() => playSound(750, 0.12, 'sine', 0.12), 80);
}

function playTouchSound() {
    // Light touch/pass sound
    playSound(600, 0.05, 'sine', 0.08);
    setTimeout(() => playSound(800, 0.04, 'sine', 0.06), 25);
}

function playGoalSound() {
    // Celebratory goal sound - ascending then descending
    playSound(400, 0.15, 'sine', 0.12);
    setTimeout(() => playSound(550, 0.15, 'sine', 0.12), 150);
    setTimeout(() => playSound(700, 0.15, 'sine', 0.12), 300);
    setTimeout(() => playSound(900, 0.2, 'sine', 0.15), 450);
    setTimeout(() => playSound(700, 0.15, 'sine', 0.12), 650);
    setTimeout(() => playSound(500, 0.15, 'sine', 0.1), 800);
}

function playStartSound() {
    // Game start sound
    playSound(500, 0.1, 'sine', 0.12);
    setTimeout(() => playSound(700, 0.15, 'sine', 0.12), 120);
}

function playWhistleSound() {
    // Whistle for end of game
    playSound(800, 0.08, 'sine', 0.1);
    setTimeout(() => playSound(1000, 0.08, 'sine', 0.1), 100);
    setTimeout(() => playSound(1200, 0.1, 'sine', 0.1), 200);
}

function playBounceSound() {
    // Ball bounce off wall
    playSound(350, 0.04, 'sine', 0.07);
    setTimeout(() => playSound(500, 0.03, 'sine', 0.05), 30);
}

function playSaveSound() {
    // Save/block sound
    playSound(300, 0.06, 'sine', 0.1);
    setTimeout(() => playSound(550, 0.08, 'sine', 0.12), 50);
    setTimeout(() => playSound(400, 0.05, 'sine', 0.08), 120);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        gamePaused = false;
        playerScore = 0;
        aiScore = 0;
        timeLeft = 90;
        player.x = 150;
        player.y = fieldHeight / 2;
        player.velocityX = 0;
        player.velocityY = 0;
        ai.x = fieldWidth - 150;
        ai.y = fieldHeight / 2;
        ai.velocityX = 0;
        ai.velocityY = 0;
        ball.x = centerLine;
        ball.y = fieldHeight / 2;
        ball.velocityX = 0;
        ball.velocityY = 0;
        
        updateDisplay();
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        playStartSound();
        gameLoopId = setInterval(gameLoop, 30);
        
        let timerInterval = setInterval(() => {
            if (gameRunning && !gamePaused) {
                timeLeft--;
                updateDisplay();
                if (timeLeft <= 0) {
                    endGame();
                    clearInterval(timerInterval);
                }
            }
        }, 1000);
    }
}

function updateDisplay() {
    playerScoreDisplay.textContent = `You: ${playerScore}`;
    aiScoreDisplay.textContent = `AI: ${aiScore}`;
    timeDisplay.textContent = `Time: ${timeLeft}s`;
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    
    let status = '';
    if (playerScore > aiScore) {
        status = `🎉 YOU WIN! ${playerScore} - ${aiScore}`;
    } else if (aiScore > playerScore) {
        status = `😢 YOU LOSE! ${playerScore} - ${aiScore}`;
    } else {
        status = `🤝 DRAW! ${playerScore} - ${aiScore}`;
    }
    
    gameStatusDisplay.textContent = status;
    playWhistleSound();
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    keysPressed[event.key] = true;
    
    if (event.key === ' ') {
        if (gameRunning && !gamePaused) {
            kickBall(player);
        }
        event.preventDefault();
    }
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function kickBall(kicker) {
    const dx = ball.x - kicker.x;
    const dy = ball.y - kicker.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 60) {
        const angle = Math.atan2(dy, dx);
        const speed = 12;
        ball.velocityX = Math.cos(angle) * speed;
        ball.velocityY = Math.sin(angle) * speed;
        playKickSound();
    }
}

function aiMove() {
    // AI tries to reach the ball
    const dx = ball.x - ai.x;
    const dy = ball.y - ai.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 10) {
        const angle = Math.atan2(dy, dx);
        ai.velocityX = Math.cos(angle) * ai.speed;
        ai.velocityY = Math.sin(angle) * ai.speed;
    } else {
        ai.velocityX *= 0.9;
        ai.velocityY *= 0.9;
    }
    
    // AI is more aggressive with kicking
    if (distance < 60 && Math.random() > 0.75) {
        kickBall(ai);
    }
    
    // Update AI position
    ai.x += ai.velocityX;
    ai.y += ai.velocityY;
    
    // Keep AI in bounds
    if (ai.y < ai.height / 2) ai.y = ai.height / 2;
    if (ai.y > fieldHeight - ai.height / 2) ai.y = fieldHeight - ai.height / 2;
    if (ai.x < ai.width / 2) ai.x = ai.width / 2;
    if (ai.x > fieldWidth - ai.width / 2) ai.x = fieldWidth - ai.width / 2;
}

function gameLoop() {
    update();
    draw();
}

function update() {
    if (!gameRunning || gamePaused) return;
    
    // Player movement
    player.velocityX = 0;
    player.velocityY = 0;
    
    if (keysPressed['ArrowLeft']) player.velocityX = -player.speed;
    if (keysPressed['ArrowRight']) player.velocityX = player.speed;
    if (keysPressed['ArrowUp']) player.velocityY = -player.speed;
    if (keysPressed['ArrowDown']) player.velocityY = player.speed;
    
    // Update player position
    player.x += player.velocityX;
    player.y += player.velocityY;
    
    // Keep player in bounds
    if (player.x < player.width / 2) player.x = player.width / 2;
    if (player.x > fieldWidth - player.width / 2) player.x = fieldWidth - player.width / 2;
    if (player.y < player.height / 2) player.y = player.height / 2;
    if (player.y > fieldHeight - player.height / 2) player.y = fieldHeight - player.height / 2;
    
    // AI movement
    aiMove();
    
    // Ball physics
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ball.velocityX *= ball.friction;
    ball.velocityY *= ball.friction;
    
    // Ball boundary collision
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > fieldHeight) {
        ball.velocityY *= -0.9;
        if (ball.y - ball.radius < 0) ball.y = ball.radius;
        if (ball.y + ball.radius > fieldHeight) ball.y = fieldHeight - ball.radius;
        playBounceSound();
    }
    
    // Check goals
    if (ball.x - ball.radius < 0) {
        if (ball.y > fieldHeight / 2 - goalHeight / 2 && ball.y < fieldHeight / 2 + goalHeight / 2) {
            aiScore++;
            updateDisplay();
            playGoalSound();
            resetBall();
        } else {
            ball.velocityX *= -0.8;
            ball.x = ball.radius;
            playSaveSound();
        }
    }
    
    if (ball.x + ball.radius > fieldWidth) {
        if (ball.y > fieldHeight / 2 - goalHeight / 2 && ball.y < fieldHeight / 2 + goalHeight / 2) {
            playerScore++;
            updateDisplay();
            playGoalSound();
            resetBall();
        } else {
            ball.velocityX *= -0.8;
            ball.x = fieldWidth - ball.radius;
            playSaveSound();
        }
    }
    
    // Player-ball collision
    checkBallCollision(player);
    
    // AI-ball collision
    checkBallCollision(ai);
}

function checkBallCollision(player) {
    const dx = ball.x - player.x;
    const dy = ball.y - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < player.width / 2 + ball.radius) {
        const angle = Math.atan2(dy, dx);
        const speed = 8;
        ball.velocityX = Math.cos(angle) * speed + player.velocityX * 0.3;
        ball.velocityY = Math.sin(angle) * speed + player.velocityY * 0.3;
        
        // Push ball away from player
        const overlap = player.width / 2 + ball.radius - distance;
        ball.x += Math.cos(angle) * overlap;
        ball.y += Math.sin(angle) * overlap;
        
        // Play touch sound for light collisions or kick sound for harder hits
        if (Math.abs(ball.velocityX) > 5 || Math.abs(ball.velocityY) > 5) {
            playKickSound();
        } else {
            playTouchSound();
        }
    }
}

function resetBall() {
    ball.x = centerLine;
    ball.y = fieldHeight / 2;
    ball.velocityX = 0;
    ball.velocityY = 0;
}

function draw() {
    // Draw field
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(0, 0, fieldWidth, fieldHeight);
    
    // Draw field lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    
    // Center line
    ctx.beginPath();
    ctx.moveTo(centerLine, 0);
    ctx.lineTo(centerLine, fieldHeight);
    ctx.stroke();
    
    // Center circle
    ctx.beginPath();
    ctx.arc(centerLine, fieldHeight / 2, 60, 0, Math.PI * 2);
    ctx.stroke();
    
    // Center point
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerLine, fieldHeight / 2, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Goal areas
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, fieldHeight / 2 - goalHeight / 2, 50, goalHeight);
    ctx.strokeRect(fieldWidth - 50, fieldHeight / 2 - goalHeight / 2, 50, goalHeight);
    
    // Goal lines (red)
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, fieldHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(fieldWidth, 0);
    ctx.lineTo(fieldWidth, fieldHeight);
    ctx.stroke();
    
    // Draw player as a person
    drawPlayer(player.x, player.y, player.color);
    
    // Draw AI as a person
    drawPlayer(ai.x, ai.y, ai.color);
    
    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Ball shadow/pattern
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius - i * 3, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    // Draw score on field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(playerScore, centerLine - 100, 80);
    ctx.fillText(aiScore, centerLine + 100, 80);
}

function drawPlayer(x, y, color) {
    // Head
    ctx.fillStyle = '#DBAC78';
    ctx.beginPath();
    ctx.arc(x, y - 10, 7, 0, Math.PI * 2);
    ctx.fill();
    
    // Body
    ctx.fillStyle = color;
    ctx.fillRect(x - 5, y - 2, 10, 12);
    
    // Arms
    ctx.strokeStyle = '#DBAC78';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + 2);
    ctx.lineTo(x - 12, y + 1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 2);
    ctx.lineTo(x + 12, y + 1);
    ctx.stroke();
    
    // Legs
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - 3, y + 10);
    ctx.lineTo(x - 3, y + 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 3, y + 10);
    ctx.lineTo(x + 3, y + 20);
    ctx.stroke();
    
    // Jersey number
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const number = (color === '#2196F3') ? '1' : '2';
    ctx.fillText(number, x, y);
}

startBtn.addEventListener('click', startGame);

// Initial draw
draw();
