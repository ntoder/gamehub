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
let gameLoopId = null;
let keysPressed = {};

// Player (Bubble Dragon)
const player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 25,
    height: 25,
    velocityX: 0,
    velocityY: 0,
    velocityY_max: 12,
    gravity: 0.5,
    speed: 4,
    jumping: false,
    color: '#FF6B9D'
};

// Game objects
let platforms = [];
let enemies = [];
let bubbles = [];

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

function playBubbleSound() {
    playSound(600, 0.1, 'sine', 0.1);
    setTimeout(() => playSound(800, 0.1, 'sine', 0.1), 60);
}

function playPopSound() {
    playSound(400, 0.05, 'sine', 0.12);
    setTimeout(() => playSound(200, 0.08, 'sine', 0.1), 40);
}

function playJumpSound() {
    playSound(500, 0.08, 'sine', 0.1);
}

function playLevelUpSound() {
    playSound(400, 0.1, 'sine', 0.12);
    setTimeout(() => playSound(600, 0.12, 'sine', 0.12), 100);
    setTimeout(() => playSound(800, 0.15, 'sine', 0.12), 200);
}

function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        level = 1;
        lives = 3;
        player.x = canvas.width / 2;
        player.y = canvas.height - 80;
        player.velocityX = 0;
        player.velocityY = 0;
        player.jumping = false;
        bubbles = [];
        
        scoreDisplay.textContent = score;
        levelDisplay.textContent = level;
        livesDisplay.textContent = lives;
        gameStatusDisplay.textContent = '';
        startBtn.textContent = 'Restart';
        
        initLevel();
        gameLoopId = setInterval(gameLoop, 30);
    }
}

function initLevel() {
    // Create platforms
    platforms = [];
    const platformY = [100, 200, 300, 400, 500];
    for (let y of platformY) {
        platforms.push({ x: 50, y: y, width: 150, height: 15 });
        platforms.push({ x: canvas.width - 200, y: y, width: 150, height: 15 });
    }
    
    // Bottom platform
    platforms.push({ x: 0, y: canvas.height - 40, width: canvas.width, height: 15 });
    
    // Create enemies
    enemies = [];
    const numEnemies = 2 + level;
    for (let i = 0; i < numEnemies; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 200) + 50,
            width: 30,
            height: 30,
            velocityX: (Math.random() > 0.5 ? 1 : -1) * (2 + level * 0.5),
            velocityY: 0,
            gravity: 0.5,
            color: '#' + Math.floor(Math.random()*16777215).toString(16),
            trapped: false
        });
    }
}

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

function handleKeyDown(event) {
    keysPressed[event.key] = true;
    
    if (event.key === 'ArrowUp') {
        if (gameRunning && !player.jumping) {
            player.velocityY = -10;
            player.jumping = true;
            playJumpSound();
        }
        event.preventDefault();
    }
    
    if (event.key === 'a' || event.key === 'A') {
        if (gameRunning) {
            shootBubble();
        }
        event.preventDefault();
    }
}

function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

function shootBubble() {
    // Shoot bubble in the direction the player is facing
    const direction = player.velocityX >= 0 ? 1 : -1;
    bubbles.push({
        x: player.x + direction * 15,
        y: player.y,
        radius: 12,
        velocityX: direction * 6,
        velocityY: -3,
        trappedEnemy: null,
        age: 0,
        maxAge: 300 // 10 seconds at 30fps
    });
    playBubbleSound();
}

function gameLoop() {
    update();
    draw();
}

function update() {
    if (!gameRunning) return;
    
    // Player movement
    player.velocityX = 0;
    if (keysPressed['ArrowLeft']) player.velocityX = -player.speed;
    if (keysPressed['ArrowRight']) player.velocityX = player.speed;
    
    player.x += player.velocityX;
    
    // Wrap player around walls (pass through)
    if (player.x < 0) player.x = canvas.width;
    if (player.x > canvas.width) player.x = 0;
    
    // Apply gravity
    player.velocityY += player.gravity;
    if (player.velocityY > player.velocityY_max) player.velocityY = player.velocityY_max;
    
    player.y += player.velocityY;
    
    // Platform collision
    let onPlatform = false;
    for (let platform of platforms) {
        if (player.velocityY > 0 &&
            player.y + player.height / 2 >= platform.y &&
            player.y + player.height / 2 <= platform.y + platform.height + 5 &&
            player.x > platform.x &&
            player.x < platform.x + platform.width) {
            player.y = platform.y - player.height / 2;
            player.velocityY = 0;
            player.jumping = false;
            onPlatform = true;
        }
    }
    
    // Fall off screen
    if (player.y > canvas.height) {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) {
            endGame();
            return;
        }
        player.y = canvas.height - 80;
        player.velocityY = 0;
    }
    
    // Update enemies
    for (let enemy of enemies) {
        if (enemy.trapped) continue;
        
        // Movement
        enemy.x += enemy.velocityX;
        enemy.y += enemy.velocityY;
        enemy.velocityY += enemy.gravity;
        
        // Platform collision
        for (let platform of platforms) {
            if (enemy.velocityY > 0 &&
                enemy.y + enemy.height / 2 >= platform.y &&
                enemy.y + enemy.height / 2 <= platform.y + platform.height + 5 &&
                enemy.x > platform.x &&
                enemy.x < platform.x + platform.width) {
                enemy.y = platform.y - enemy.height / 2;
                enemy.velocityY = 0;
            }
        }
        
        // Bounce off walls
        if (enemy.x < enemy.width / 2 || enemy.x > canvas.width - enemy.width / 2) {
            enemy.velocityX *= -1;
        }
        if (enemy.x < enemy.width / 2) enemy.x = enemy.width / 2;
        if (enemy.x > canvas.width - enemy.width / 2) enemy.x = canvas.width - enemy.width / 2;
    }
    
    // Update bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
        let bubble = bubbles[i];
        
        bubble.x += bubble.velocityX;
        bubble.y += bubble.velocityY;
        bubble.velocityY += 0.3; // Gravity
        bubble.age++;
        
        // If bubble has trapped an enemy, move with it
        if (bubble.trappedEnemy) {
            bubble.x = bubble.trappedEnemy.x;
            bubble.y = bubble.trappedEnemy.y;
        }
        
        // Remove old bubbles
        if (bubble.age > bubble.maxAge) {
            bubbles.splice(i, 1);
            continue;
        }
        
        // Check collision with enemies
        if (!bubble.trappedEnemy) {
            for (let enemy of enemies) {
                if (!enemy.trapped) {
                    const dx = bubble.x - enemy.x;
                    const dy = bubble.y - enemy.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < bubble.radius + enemy.width / 2) {
                        bubble.trappedEnemy = enemy;
                        enemy.trapped = true;
                        enemy.velocityX = 0;
                        enemy.velocityY = 0;
                    }
                }
            }
        }
        
        // Check if bubble is popped (out of bounds or collision)
        if (bubble.y < 0) {
            if (bubble.trappedEnemy) {
                // Enemy is destroyed
                bubble.trappedEnemy.trapped = false;
                enemies = enemies.filter(e => e !== bubble.trappedEnemy);
                score += 100;
                scoreDisplay.textContent = score;
                playPopSound();
            }
            bubbles.splice(i, 1);
        }
    }
    
    // Check if all enemies are trapped or destroyed
    const trappedCount = enemies.filter(e => e.trapped).length;
    if (enemies.length === 0 || (trappedCount + (enemies.filter(e => !e.trapped).length) === 0)) {
        levelUp();
    }
    
    // Check collision with enemies
    for (let enemy of enemies) {
        if (!enemy.trapped) {
            const dx = player.x - enemy.x;
            const dy = player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < player.width / 2 + enemy.width / 2) {
                lives--;
                livesDisplay.textContent = lives;
                if (lives === 0) {
                    endGame();
                    return;
                }
                player.y = canvas.height - 80;
                player.velocityY = 0;
            }
        }
    }
}

function levelUp() {
    level++;
    levelDisplay.textContent = level;
    score += 500;
    scoreDisplay.textContent = score;
    playLevelUpSound();
    initLevel();
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    gameStatusDisplay.textContent = `Game Over! Final Score: ${score}`;
}

function draw() {
    // Draw background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw platforms
    ctx.fillStyle = '#00d4ff';
    for (let platform of platforms) {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        ctx.strokeStyle = '#0099cc';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    }
    
    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    
    // Player eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x - 8, player.y - 5, 4, 4);
    ctx.fillRect(player.x + 4, player.y - 5, 4, 4);
    
    // Player mouth
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(player.x, player.y + 3, 3, 0, Math.PI);
    ctx.stroke();
    
    // Draw enemies
    for (let enemy of enemies) {
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Enemy eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(enemy.x - 8, enemy.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y - 5, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(enemy.x - 8, enemy.y - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(enemy.x + 8, enemy.y - 5, 1.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw bubbles
    for (let bubble of bubbles) {
        // Bubble gradient
        const gradient = ctx.createRadialGradient(bubble.x - 5, bubble.y - 5, 0, bubble.x, bubble.y, bubble.radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        gradient.addColorStop(0.7, 'rgba(100, 200, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(50, 150, 255, 0.6)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Bubble outline
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Bubble shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(bubble.x - 4, bubble.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Draw level info
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Level: ' + level, 20, 30);
}

startBtn.addEventListener('click', startGame);

// Initial draw
draw();
