const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const livesDisplay = document.getElementById('lives');
const gameStatusDisplay = document.getElementById('gameStatus');
const startBtn = document.getElementById('startBtn');

let gameRunning = false;
let score = 0;
let level = 1;
let lives = 3;

// Mario properties
let mario = {
    x: 50,
    y: 0,
    width: 30,
    height: 40,
    velocityY: 0,
    velocityX: 0,
    gravity: 0.6,
    jumping: false,
    direction: 1 // 1 for right, -1 for left
};

let platforms = [];
let enemies = [];
let coins = [];
let goal = null;

const groundLevel = canvas.height - 80;
mario.y = groundLevel - mario.height;

let gameLoopId = null;
let audioContext = null;
let keysPressed = {};

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

function playCoinSound() {
    playSound(659.25, 0.1);
}

function playGameOverSound() {
    playSound(400, 0.2);
    setTimeout(() => playSound(300, 0.3), 200);
}

function playStartSound() {
    playSound(659.25, 0.1);
    setTimeout(() => playSound(783.99, 0.1), 100);
}

function playLevelUpSound() {
    playSound(523.25, 0.1);
    setTimeout(() => playSound(659.25, 0.1), 100);
    setTimeout(() => playSound(783.99, 0.15), 200);
}

// Initialize level
function initLevel() {
    platforms = [];
    enemies = [];
    coins = [];

    if (level === 1) {
        // Level 1: Simple introductory level
        platforms.push({ x: 0, y: groundLevel, width: canvas.width, height: 80, solid: true });

        platforms.push({
            x: 250,
            y: groundLevel - 15,
            width: 150,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 550,
            y: groundLevel - 15,
            width: 150,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        // 1 enemy
        enemies.push({
            x: 200,
            y: groundLevel - 40,
            width: 30,
            height: 25,
            speed: 1.5,
            direction: 1,
            minX: 50,
            maxX: 400
        });

        goal = {
            x: 730,
            y: groundLevel - 20,
            width: 40,
            height: 80,
            type: 'castle'
        };

    } else if (level === 2) {
        // Level 2: More platforms and obstacles
        platforms.push({ x: 0, y: groundLevel, width: canvas.width, height: 80, solid: true });

        // Multiple platforms creating a path
        platforms.push({
            x: 80,
            y: groundLevel - 15,
            width: 100,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 220,
            y: groundLevel - 15,
            width: 100,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 360,
            y: groundLevel - 15,
            width: 100,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 500,
            y: groundLevel - 15,
            width: 100,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 640,
            y: groundLevel - 15,
            width: 80,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        // 2 enemies in level 2
        enemies.push({
            x: 150,
            y: groundLevel - 40,
            width: 30,
            height: 25,
            speed: 1.8,
            direction: 1,
            minX: 50,
            maxX: 700
        });

        enemies.push({
            x: 450,
            y: groundLevel - 40,
            width: 30,
            height: 25,
            speed: 1.8,
            direction: -1,
            minX: 50,
            maxX: 700
        });

        goal = {
            x: 720,
            y: groundLevel - 20,
            width: 40,
            height: 80,
            type: 'princess'
        };

    } else {
        // Level 3+: Challenging with pipes and varied enemies
        platforms.push({ x: 0, y: groundLevel, width: canvas.width, height: 80, solid: true });

        // Platforms with gaps
        platforms.push({
            x: 50,
            y: groundLevel - 15,
            width: 80,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 200,
            y: groundLevel - 15,
            width: 60,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 330,
            y: groundLevel - 15,
            width: 90,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 500,
            y: groundLevel - 15,
            width: 70,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        platforms.push({
            x: 640,
            y: groundLevel - 15,
            width: 80,
            height: 20,
            solid: true,
            themed: 'brick'
        });

        // Add a pipe obstacle
        platforms.push({
            x: 150,
            y: groundLevel - 50,
            width: 40,
            height: 50,
            solid: true,
            themed: 'pipe'
        });

        platforms.push({
            x: 450,
            y: groundLevel - 40,
            width: 40,
            height: 40,
            solid: true,
            themed: 'pipe'
        });

        // 2-3 enemies in level 3
        const numEnemies = 2 + Math.floor(level / 3);
        for (let i = 0; i < numEnemies; i++) {
            enemies.push({
                x: 100 + i * 200,
                y: groundLevel - 40,
                width: 30,
                height: 25,
                speed: 2 + level * 0.2,
                direction: i % 2 === 0 ? 1 : -1,
                minX: 50,
                maxX: 750
            });
        }

        goal = {
            x: 720,
            y: groundLevel - 20,
            width: 40,
            height: 80,
            type: 'castle'
        };
    }

    // Add coins to platforms
    for (let platform of platforms) {
        if (platform.solid && platform !== platforms[0] && !platform.themed) {
            for (let i = 0; i < 3; i++) {
                coins.push({
                    x: platform.x + 20 + i * 40,
                    y: platform.y - 30,
                    collected: false
                });
            }
        }
    }
}

// Event listeners
startBtn.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    keysPressed[event.key] = true;

    if (event.key === 'ArrowUp' && gameRunning && mario.velocityY === 0) {
        jump();
        event.preventDefault();
    }
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        level = 1;
        lives = 3;
        mario.x = 50;
        mario.y = groundLevel - mario.height;
        mario.velocityX = 0;
        mario.velocityY = 0;
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        livesDisplay.textContent = lives;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        initLevel();
        playStartSound();
        gameLoopId = setInterval(gameLoop, 30);
    }
}

function jump() {
    mario.velocityY = -14;
    playJumpSound();
}

function gameLoop() {
    update();
    draw();
}

function update() {
    // Handle input
    if (keysPressed['ArrowLeft']) {
        mario.velocityX = -5;
        mario.direction = -1;
    } else if (keysPressed['ArrowRight']) {
        mario.velocityX = 5;
        mario.direction = 1;
    } else {
        mario.velocityX = 0;
    }

    // Apply gravity
    mario.velocityY += mario.gravity;

    // Update position
    mario.x += mario.velocityX;
    mario.y += mario.velocityY;

    // Keep mario in bounds
    if (mario.x < 0) mario.x = 0;
    if (mario.x + mario.width > canvas.width) mario.x = canvas.width - mario.width;

    // Reset velocity for collision
    mario.velocityY = mario.velocityY;

    // Check collisions with platforms
    let onGround = false;
    for (let platform of platforms) {
        if (platform.moving) {
            platform.x += platform.moveSpeed;
            if (platform.x < 500 || platform.x > 500 + platform.moveRange) {
                platform.moveSpeed *= -1;
            }
        }

        if (mario.velocityY > 0 && 
            mario.y + mario.height >= platform.y &&
            mario.y + mario.height <= platform.y + platform.height + 5 &&
            mario.x + mario.width > platform.x &&
            mario.x < platform.x + platform.width) {
            mario.y = platform.y - mario.height;
            mario.velocityY = 0;
            onGround = true;
        }
    }

    // Update enemies
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;
        if (enemy.x < enemy.minX || enemy.x > enemy.maxX) {
            enemy.direction *= -1;
        }

        // Check collision with mario
        if (mario.x < enemy.x + enemy.width &&
            mario.x + mario.width > enemy.x &&
            mario.y < enemy.y + enemy.height &&
            mario.y + mario.height > enemy.y) {
            
            // If mario is above enemy, jump on it
            if (mario.velocityY > 0 && mario.y < enemy.y) {
                enemies = enemies.filter(e => e !== enemy);
                mario.velocityY = -10;
                score += 100;
                playCoinSound();
            } else {
                lives--;
                livesDisplay.textContent = lives;
                if (lives === 0) {
                    endGame();
                    return;
                }
                mario.x = 50;
                mario.y = groundLevel - mario.height;
                mario.velocityY = 0;
                playGameOverSound();
            }
        }
    });

    // Check coin collisions
    coins.forEach(coin => {
        if (!coin.collected &&
            mario.x < coin.x + 15 &&
            mario.x + mario.width > coin.x - 15 &&
            mario.y < coin.y + 15 &&
            mario.y + mario.height > coin.y - 15) {
            coin.collected = true;
            score += 50;
            playCoinSound();
            scoreDisplay.textContent = score;
        }
    });

    // Check goal collision
    if (mario.x < goal.x + goal.width &&
        mario.x + mario.width > goal.x &&
        mario.y < goal.y + goal.height &&
        mario.y + mario.height > goal.y) {
        levelUp();
    }

    // Fall off screen
    if (mario.y > canvas.height) {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) {
            endGame();
            return;
        }
        mario.x = 50;
        mario.y = groundLevel - mario.height;
        mario.velocityY = 0;
    }
}

function levelUp() {
    level++;
    levelDisplay.textContent = level;
    mario.x = 50;
    mario.y = groundLevel - mario.height;
    mario.velocityX = 0;
    mario.velocityY = 0;
    initLevel();
    playLevelUpSound();
}

function draw() {
    // Clear canvas
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87ceeb');
    gradient.addColorStop(1, '#e0f6ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(100 + i * 300, 50 + i * 20, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(120 + i * 300, 40 + i * 20, 25, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw platforms
    platforms.forEach(platform => {
        if (platform.themed === 'brick') {
            // Draw brick platform
            ctx.fillStyle = '#CD5C5C';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Brick pattern
            ctx.strokeStyle = '#8B3A3A';
            ctx.lineWidth = 1;
            for (let i = 0; i < platform.width; i += 20) {
                ctx.beginPath();
                ctx.moveTo(platform.x + i, platform.y);
                ctx.lineTo(platform.x + i, platform.y + platform.height);
                ctx.stroke();
            }
            for (let i = 0; i < platform.height; i += 10) {
                ctx.beginPath();
                ctx.moveTo(platform.x, platform.y + i);
                ctx.lineTo(platform.x + platform.width, platform.y + i);
                ctx.stroke();
            }
        } else if (platform.themed === 'pipe') {
            // Draw green pipe
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            ctx.strokeStyle = '#1a6b1a';
            ctx.lineWidth = 2;
            ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
            
            // Pipe shine/band
            ctx.fillStyle = '#32CD32';
            ctx.fillRect(platform.x, platform.y + platform.height - 8, platform.width, 8);
        } else {
            // Draw ground/default platform
            ctx.fillStyle = '#8B7355';
            ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
            
            // Platform pattern
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            for (let i = 0; i < platform.width; i += 30) {
                ctx.strokeRect(platform.x + i, platform.y, 20, platform.height);
            }
        }
    });

    // Draw coins
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(coin.x, coin.y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FFA500';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });

    // Draw goal (castle or princess)
    if (goal.type === 'princess') {
        // Draw princess tower
        ctx.fillStyle = '#FF69B4';
        ctx.fillRect(goal.x - 5, goal.y + 20, goal.width + 10, goal.height - 20);
        
        // Tower roof
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(goal.x - 10, goal.y + 20);
        ctx.lineTo(goal.x + goal.width / 2, goal.y);
        ctx.lineTo(goal.x + goal.width + 10, goal.y + 20);
        ctx.fill();
        
        // Window
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(goal.x + 5, goal.y + 30, 20, 20);
        ctx.fillStyle = '#000';
        ctx.fillRect(goal.x + 10, goal.y + 35, 5, 5);
        ctx.fillRect(goal.x + 20, goal.y + 35, 5, 5);
    } else {
        // Draw castle
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(goal.x, goal.y, goal.width, goal.height);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(goal.x + 5, goal.y + 10, 10, 15);
        ctx.fillRect(goal.x + 20, goal.y + 10, 10, 15);
        ctx.fillStyle = '#DC143C';
        ctx.fillRect(goal.x + 10, goal.y, 20, 15);
    }

    // Draw Mario
    drawMario();

    // Draw enemies
    enemies.forEach(enemy => {
        drawGoomba(enemy.x, enemy.y);
    });

    // Draw level info
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Level: ' + level, 20, 30);
}

function drawMario() {
    const x = mario.x;
    const y = mario.y;

    // Head
    ctx.fillStyle = '#FF8C69';
    ctx.fillRect(x + 5, y, 20, 20);

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(x + 10, y + 5, 3, 3);
    if (mario.direction === 1) {
        ctx.fillRect(x + 16, y + 5, 3, 3);
    } else {
        ctx.fillRect(x + 10, y + 5, 3, 3);
    }

    // Mustache
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x + 9, y + 12, 12, 2);

    // Body
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x + 5, y + 20, 20, 15);

    // Arms
    ctx.fillStyle = '#FF8C69';
    ctx.fillRect(x - 2, y + 20, 7, 12);
    ctx.fillRect(x + 25, y + 20, 7, 12);

    // Legs
    ctx.fillStyle = '#000080';
    ctx.fillRect(x + 8, y + 35, 5, 5);
    ctx.fillRect(x + 17, y + 35, 5, 5);

    // Shoes
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(x + 7, y + 38, 6, 2);
    ctx.fillRect(x + 17, y + 38, 6, 2);
}

function drawGoomba(x, y) {
    // Body
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.arc(x + 15, y + 12, 15, 0, Math.PI);
    ctx.fill();

    ctx.fillRect(x, y + 12, 30, 13);

    // Eyes
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 8, y + 8, 6, 6);
    ctx.fillRect(x + 16, y + 8, 6, 6);

    ctx.fillStyle = '#000';
    ctx.fillRect(x + 10, y + 10, 3, 3);
    ctx.fillRect(x + 18, y + 10, 3, 3);
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    playGameOverSound();
    gameStatusDisplay.textContent = `Game Over! Final Score: ${score} | Level: ${level}`;
}

// Initial draw
initLevel();
draw();
