const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const speedDisplay = document.getElementById('speed');
const highScoreDisplay = document.getElementById('highScore');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');

let gameRunning = false;
let score = 0;
let highScore = localStorage.getItem('motoHighScore') || 0;
let gameSpeed = 4;
let gameSpeedIncrement = 0.003;

// Motorcycle properties
let motorcycle = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 100,
    width: 40,
    height: 60,
    speed: 0,
    maxSpeed: 15,
    acceleration: 0.3,
    deceleration: 0.2,
    steering: 0,
    maxSteering: 4
};

const roadTopWidth = 80;
const roadBottomWidth = 320;
const cameraHeight = 0;

let obstacles = [];
let roadOffset = 0;
let gameLoopId = null;
let audioContext = null;
let keysPressed = {};
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

function playCollisionSound() {
    playSound(300, 0.3);
    setTimeout(() => playSound(200, 0.3), 300);
}

function playGameOverSound() {
    playSound(400, 0.2);
    setTimeout(() => playSound(300, 0.2), 200);
    setTimeout(() => playSound(200, 0.3), 400);
}

function playStartSound() {
    playSound(659.25, 0.1);
    setTimeout(() => playSound(783.99, 0.1), 100);
}

// Initialize high score
highScoreDisplay.textContent = highScore;

// Event listeners
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    keysPressed[event.key] = true;
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        gameSpeed = 4;
        motorcycle.x = canvas.width / 2 - 15;
        motorcycle.y = canvas.height - 80;
        motorcycle.speed = 0;
        motorcycle.steering = 0;
        obstacles = [];
        roadOffset = 0;
        scoreDisplay.textContent = score;
        speedDisplay.textContent = '0';
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        lastObstacleTime = 0;
        playStartSound();
        gameLoopId = setInterval(gameLoop, 30);
    }
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Handle steering
    motorcycle.steering = 0;
    if (keysPressed['ArrowLeft']) {
        motorcycle.steering = -motorcycle.maxSteering;
    }
    if (keysPressed['ArrowRight']) {
        motorcycle.steering = motorcycle.maxSteering;
    }

    // Handle acceleration
    if (keysPressed[' ']) {
        motorcycle.speed = Math.min(motorcycle.speed + motorcycle.acceleration, motorcycle.maxSpeed);
    } else {
        motorcycle.speed = Math.max(motorcycle.speed - motorcycle.deceleration, 0);
    }

    // Update position with 3D perspective
    motorcycle.x += motorcycle.steering * 1.5;

    // Keep motorcycle on road with 3D perspective constraints
    const roadWidth = roadBottomWidth;
    const roadLeft = (canvas.width - roadWidth) / 2;
    const roadRight = roadLeft + roadWidth;
    
    if (motorcycle.x < roadLeft + 20) {
        motorcycle.x = roadLeft + 20;
        motorcycle.speed *= 0.8;
    }
    if (motorcycle.x + motorcycle.width > roadRight - 20) {
        motorcycle.x = roadRight - motorcycle.width - 20;
        motorcycle.speed *= 0.8;
    }

    // Update road
    roadOffset += motorcycle.speed;
    if (roadOffset > canvas.height) {
        roadOffset -= canvas.height;
    }

    // Increase game speed
    gameSpeed += gameSpeedIncrement;

    // Generate obstacles
    lastObstacleTime += motorcycle.speed;
    if (lastObstacleTime > Math.max(80, 200 - gameSpeed)) {
        createObstacle();
        lastObstacleTime = 0;
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += motorcycle.speed + gameSpeed;

        // Check collision
        if (checkCollision(motorcycle, obstacles[i])) {
            endGame();
            return;
        }

        // Remove off-screen obstacles and add score
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            score += 10;
            scoreDisplay.textContent = score;
        }
    }

    // Update speed display
    speedDisplay.textContent = Math.floor(motorcycle.speed * 20);
}

function createObstacle() {
    const lanes = 3;
    const laneIndex = Math.floor(Math.random() * lanes);
    const roadWidth = roadBottomWidth;
    const roadLeft = (canvas.width - roadWidth) / 2;
    const laneWidth = roadWidth / lanes;
    
    const lane = roadLeft + laneWidth / 2 + laneIndex * laneWidth;
    const type = Math.random() > 0.6 ? 'car' : 'truck';
    
    const obstacle = {
        x: lane,
        y: -100,
        width: type === 'car' ? 50 : 60,
        height: type === 'car' ? 35 : 40,
        type: type
    };

    obstacles.push(obstacle);
}

function checkCollision(moto, obstacle) {
    // 3D collision detection considering perspective
    const distanceFromCamera = (canvas.height - obstacle.y) / canvas.height;
    const obstacleScale = 0.3 + distanceFromCamera * 0.7;
    const scaledWidth = obstacle.width * obstacleScale;
    const scaledHeight = obstacle.height * obstacleScale;
    
    return moto.x < obstacle.x + scaledWidth &&
           moto.x + moto.width > obstacle.x - scaledWidth &&
           moto.y < obstacle.y + scaledHeight * 1.5 &&
           moto.y + moto.height > obstacle.y - scaledHeight;
}

function draw() {
    // Draw sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw 3D perspective road
    const roadLeft = (canvas.width - roadBottomWidth) / 2;
    const roadRight = roadLeft + roadBottomWidth;
    const topRoadLeft = (canvas.width - roadTopWidth) / 2;
    const topRoadRight = topRoadLeft + roadTopWidth;

    // Road with perspective (trapezoid)
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.moveTo(topRoadLeft, 0);
    ctx.lineTo(topRoadRight, 0);
    ctx.lineTo(roadRight, canvas.height);
    ctx.lineTo(roadLeft, canvas.height);
    ctx.closePath();
    ctx.fill();

    // Draw road markings with 3D perspective
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 15]);

    // Center line with perspective
    for (let i = 0; i < canvas.height; i += 30) {
        const progress = i / canvas.height;
        const x1 = topRoadLeft + (roadLeft - topRoadLeft) * progress + roadTopWidth / 2;
        const x2 = topRoadLeft + (roadRight - topRoadLeft) * progress + roadTopWidth / 2;
        const offset = (i - roadOffset) % 30;
        
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, i - offset);
        ctx.lineTo(canvas.width / 2, i - offset + 15);
        ctx.stroke();
    }

    // Lane lines with perspective
    ctx.strokeStyle = '#FFFFFF';
    ctx.setLineDash([10, 10]);
    for (let lane = 1; lane < 3; lane++) {
        for (let i = 0; i < canvas.height; i += 20) {
            const progress = i / canvas.height;
            const laneX = topRoadLeft + (roadBottomWidth / 3) * lane + 
                         ((roadBottomWidth / 3) * lane - (roadTopWidth / 3) * lane) * progress;
            const offset = (i - roadOffset) % 20;
            
            ctx.beginPath();
            ctx.moveTo(laneX, i - offset);
            ctx.lineTo(laneX, i - offset + 10);
            ctx.stroke();
        }
    }

    ctx.setLineDash([]);

    // Draw obstacles (cars and trucks) with 3D scaling
    obstacles.sort((a, b) => a.y - b.y); // Sort by distance
    obstacles.forEach(obstacle => {
        const distanceFromCamera = (canvas.height - obstacle.y) / canvas.height;
        const scale = 0.3 + distanceFromCamera * 0.7;
        
        if (obstacle.type === 'car') {
            drawCar3D(obstacle.x, obstacle.y, obstacle.width, obstacle.height, scale);
        } else {
            drawTruck3D(obstacle.x, obstacle.y, obstacle.width, obstacle.height, scale);
        }
    });

    // Draw motorcycle
    drawMotorcycle();

    // Draw speed indicator
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Speed: ' + Math.floor(motorcycle.speed * 20) + ' km/h', 10, 30);
    ctx.fillText('Score: ' + score, 10, 50);
}

function drawMotorcycle() {
    const x = motorcycle.x;
    const y = motorcycle.y;

    // Bike body
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 5, y + 15, 20, 25);

    // Bike seat
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(x + 15, y + 10, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Handlebars
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 8);
    ctx.lineTo(x + 20, y + 8);
    ctx.stroke();

    // Wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 8, y + 45, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 22, y + 45, 6, 0, Math.PI * 2);
    ctx.fill();

    // Wheel rims
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + 8, y + 45, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 22, y + 45, 4, 0, Math.PI * 2);
    ctx.stroke();

    // Driver
    ctx.fillStyle = '#FDBCB4';
    ctx.beginPath();
    ctx.arc(x + 15, y + 3, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawCar(x, y, width, height) {
    // Car body
    ctx.fillStyle = '#0066FF';
    ctx.fillRect(x, y, width, height);

    // Car windows
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(x + 5, y + 5, 15, 8);
    ctx.fillRect(x + 25, y + 5, 15, 8);

    // Car wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 8, y + height, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width - 8, y + height, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawCar3D(x, y, width, height, scale) {
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    // Car body
    ctx.fillStyle = '#0066FF';
    ctx.fillRect(x - scaledWidth / 2, y, scaledWidth, scaledHeight);

    // Car windows
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(x - scaledWidth / 2 + 5, y + 5, scaledWidth / 3, scaledHeight / 3);
    ctx.fillRect(x + scaledWidth / 4, y + 5, scaledWidth / 3, scaledHeight / 3);

    // Car wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - scaledWidth / 2 + 8, y + scaledHeight, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + scaledWidth / 2 - 8, y + scaledHeight, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + scaledHeight + 5, scaledWidth / 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawTruck(x, y, width, height) {
    // Truck cabin
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(x, y, 25, height);

    // Truck bed
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 25, y, width - 25, height);

    // Cabin window
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(x + 5, y + 5, 15, 8);

    // Truck wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x + 8, y + height, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width - 8, y + height, 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawTruck3D(x, y, width, height, scale) {
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    // Truck cabin
    ctx.fillStyle = '#FF6600';
    ctx.fillRect(x - scaledWidth / 2, y, scaledWidth * 0.3, scaledHeight);

    // Truck bed
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - scaledWidth / 2 + scaledWidth * 0.3, y, scaledWidth * 0.7, scaledHeight);

    // Cabin window
    ctx.fillStyle = '#ADD8E6';
    ctx.fillRect(x - scaledWidth / 2 + 5, y + 5, scaledWidth * 0.2, scaledHeight / 3);

    // Truck wheels
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(x - scaledWidth / 2 + 8, y + scaledHeight, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + scaledWidth / 2 - 8, y + scaledHeight, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x, y + scaledHeight + 5, scaledWidth / 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    playGameOverSound();

    if (score > highScore) {
        highScore = score;
        localStorage.setItem('motoHighScore', highScore);
        highScoreDisplay.textContent = highScore;
        gameStatusDisplay.textContent = `Game Over! New High Score: ${score}`;
    } else {
        gameStatusDisplay.textContent = `Game Over! Score: ${score}`;
    }
}

// Initial draw
draw();
