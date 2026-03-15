const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

const LANES = [1, 2, 3];
const LANE_WIDTH = canvas.width / 3;
const TRACK_SEGMENTS = 30;

let gameRunning = false;
let score = 0;
let coins = 0;
let playerLane = 1;
let isJumping = false;
let jumpProgress = 0;
let isSliding = false;
let slidingProgress = 0;
let speed = 8;
let obstacles = [];
let collectibles = [];
let gameTime = 0;

const player = {
    lane: 1,
    jumpHeight: 0,
    slideProgress: 0,
    scale: 1
};

class Obstacle {
    constructor(lane, distance) {
        this.lane = lane;
        this.distance = distance;
        this.width = LANE_WIDTH * 0.7;
        this.height = 40;
        this.passed = false;
    }

    draw(perspective) {
        const screenPos = this.getScreenY(perspective);
        if (screenPos < -50 || screenPos > canvas.height + 50) return;

        const scale = Math.max(0.3, Math.min(1, (300 - this.distance) / 300));
        const x = this.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const y = screenPos;
        const w = this.width * scale;
        const h = this.height * scale;

        ctx.fillStyle = 'rgba(255, 50, 50, 0.9)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillRect(x - w / 2, y - h / 2, w, h);

        ctx.fillStyle = 'rgba(200, 0, 0, 0.8)';
        ctx.fillRect(x - w / 2, y - h / 2, w / 5, h);
        ctx.fillRect(x - w / 2 + w * 4 / 5, y - h / 2, w / 5, h);
    }

    getScreenY(perspective) {
        return (this.distance / perspective) * canvas.height;
    }
}

class Coin {
    constructor(lane, distance) {
        this.lane = lane;
        this.distance = distance;
        this.rotation = 0;
        this.collected = false;
    }

    draw(perspective) {
        this.rotation += 0.1;
        const screenPos = this.getScreenY(perspective);
        if (screenPos < -20 || screenPos > canvas.height + 20) return;

        const scale = Math.max(0.2, Math.min(1, (300 - this.distance) / 300));
        const x = this.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const y = screenPos;
        const size = 20 * scale;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);

        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(-size / 3, -size / 3, size / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    getScreenY(perspective) {
        return (this.distance / perspective) * canvas.height;
    }
}

function drawTrack() {
    // Ground
    ctx.fillStyle = '#333333';
    ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

    // Track lines
    for (let i = 1; i < LANES.length; i++) {
        const x = i * LANE_WIDTH;
        ctx.strokeStyle = '#FFFF00';
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height / 2);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Perspective grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < TRACK_SEGMENTS; i++) {
        const y = canvas.height * (i / TRACK_SEGMENTS);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawPlayer() {
    const x = player.lane * LANE_WIDTH + LANE_WIDTH / 2;
    let y = canvas.height - 120;

    if (isJumping) {
        const jumpArc = Math.sin(jumpProgress * Math.PI) * 80;
        y -= jumpArc;
    }

    const playerHeight = isSliding ? 30 : 50;
    const playerWidth = isSliding ? 45 : 35;

    ctx.save();
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetY = 5;

    // Body
    ctx.fillStyle = '#FF6B6B';
    ctx.fillRect(x - playerWidth / 2, y - playerHeight / 2, playerWidth, playerHeight);

    // Eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(x - 8, y - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8, y - 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(x - 8, y - 10, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 8, y - 10, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function updateGame() {
    gameTime++;

    // Update position
    for (let obs of obstacles) {
        obs.distance -= speed;
        if (obs.distance < 0 && !obs.passed) {
            obs.passed = true;
            score += 10;
        }
    }

    for (let coin of collectibles) {
        coin.distance -= speed;
        if (coin.distance < -50 && !coin.collected) {
            collectibles.splice(collectibles.indexOf(coin), 1);
        }
    }

    // Remove off-screen obstacles
    obstacles = obstacles.filter(obs => obs.distance > -100);
    collectibles = collectibles.filter(coin => coin.distance > -100);

    // Spawn new obstacles
    if (gameTime % 40 === 0) {
        const lanes = [0, 1, 2];
        const numObstacles = Math.random() > 0.4 ? 2 : 1;
        for (let i = 0; i < numObstacles; i++) {
            const randomIdx = Math.floor(Math.random() * lanes.length);
            const lane = lanes.splice(randomIdx, 1)[0];
            obstacles.push(new Obstacle(lane, 400));
        }
    }

    // Spawn coins
    if (gameTime % 60 === 0) {
        const lane = Math.floor(Math.random() * 3);
        collectibles.push(new Coin(lane, 350));
    }

    // Increase difficulty
    if (gameTime % 300 === 0 && speed < 15) {
        speed += 0.5;
    }

    // Jump physics
    if (isJumping) {
        jumpProgress += 0.15;
        if (jumpProgress >= 1) {
            isJumping = false;
            jumpProgress = 0;
        }
    }

    // Slide physics
    if (isSliding) {
        slidingProgress += 0.1;
        if (slidingProgress >= 1) {
            isSliding = false;
            slidingProgress = 0;
        }
    }

    // Collision detection
    checkCollisions();

    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
}

function checkCollisions() {
    const playerX = player.lane * LANE_WIDTH + LANE_WIDTH / 2;
    const playerY = canvas.height - 120;
    const playerCollisionRadius = isSliding ? 45 : 35;

    for (let obs of obstacles) {
        const screenY = (obs.distance / 300) * canvas.height;
        const scale = Math.max(0.3, Math.min(1, (300 - obs.distance) / 300));

        if (screenY > canvas.height - 160 && screenY < canvas.height - 80) {
            const obsX = obs.lane * LANE_WIDTH + LANE_WIDTH / 2;
            const obsWidth = obs.width * scale * 0.8;

            if (Math.abs(playerX - obsX) < obsWidth && !isJumping && !isSliding) {
                endGame();
                return;
            }
        }
    }

    // Coin collection
    for (let coin of collectibles) {
        const screenY = (coin.distance / 300) * canvas.height;
        const scale = Math.max(0.2, Math.min(1, (300 - coin.distance) / 300));

        if (screenY > canvas.height - 160 && screenY < canvas.height - 80 && !coin.collected) {
            const coinX = coin.lane * LANE_WIDTH + LANE_WIDTH / 2;
            if (Math.abs(playerX - coinX) < 40) {
                coin.collected = true;
                coins++;
                score += 50;
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawTrack();

    // Draw obstacles and coins
    for (let obs of obstacles) {
        obs.draw(300);
    }
    for (let coin of collectibles) {
        coin.draw(300);
    }

    drawPlayer();
}

function gameLoop() {
    if (!gameRunning) return;

    updateGame();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').classList.add('hidden');
    
    gameRunning = true;
    score = 0;
    coins = 0;
    playerLane = 1;
    isJumping = false;
    isSliding = false;
    speed = 8;
    gameTime = 0;
    obstacles = [];
    collectibles = [];
    player.lane = 1;

    gameLoop();
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            if (player.lane > 0) player.lane--;
            break;
        case 'arrowright':
        case 'd':
            if (player.lane < 2) player.lane++;
            break;
        case 'arrowup':
        case 'w':
            if (!isJumping && !isSliding) {
                isJumping = true;
                jumpProgress = 0;
            }
            break;
        case 'arrowdown':
        case 's':
            if (!isSliding && !isJumping) {
                isSliding = true;
                slidingProgress = 0;
            }
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();

    const diffX = e.touches[0].clientX - touchStartX;
    if (Math.abs(diffX) > 50) {
        if (diffX > 0 && player.lane < 2) player.lane++;
        else if (diffX < 0 && player.lane > 0) player.lane--;
        touchStartX = e.touches[0].clientX;
    }
});

// Initial draw
draw();
let score = 0;
let coins = 0;
let playerX = 182.5;
let playerY = 470;
let playerWidth = 35;
let playerHeight = 50;
let isJumping = false;
let velocityY = 0;
let gravity = 0.5;
let jumpPower = -12;
let isSliding = false;
let slideDuration = 0;
let obstacles = [];
let gameCoins = [];
let obstacleSpeed = 5;
let spawnRate = 80;
let spawnCounter = 0;

const LANE_WIDTH = 133;
const LANES = [66.5, 182.5, 298.5];
const GRAVITY = 0.5;
const JUMP_POWER = -12;

function startGame() {
    gameRunning = true;
    score = 0;
    coins = 0;
    playerX = 182.5;
    playerY = 470;
    isJumping = false;
    isSliding = false;
    velocityY = 0;
    obstacles = [];
    gameCoins = [];
    obstacleSpeed = 5;
    spawnRate = 80;

    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');

    updateUI();
    gameLoop();
}

function restartGame() {
    startGame();
}

function updateUI() {
    uiScore.textContent = score;
    uiCoins.textContent = coins;
}

function movePlayer(direction) {
    const currentLane = LANES.indexOf(playerX);
    if (direction === 'left' && currentLane > 0) {
        playerX = LANES[currentLane - 1];
    } else if (direction === 'right' && currentLane < LANES.length - 1) {
        playerX = LANES[currentLane + 1];
    }
    player.style.left = playerX + 'px';
}

function jumpPlayer() {
    if (!isJumping && !isSliding) {
        isJumping = true;
        velocityY = JUMP_POWER;
    }
}

function slidePlayer() {
    if (!isSliding && !isJumping) {
        isSliding = true;
        slideDuration = 30;
        player.style.height = '25px';
    }
}

function updatePlayerPhysics() {
    if (isJumping) {
        velocityY += GRAVITY;
        playerY += velocityY;

        if (playerY >= 470) {
            playerY = 470;
            isJumping = false;
            velocityY = 0;
        }
    }

    if (isSliding) {
        slideDuration--;
        if (slideDuration <= 0) {
            isSliding = false;
            player.style.height = '50px';
        }
    }

    player.style.bottom = (600 - playerY - playerHeight) + 'px';
}

function spawnObstacle() {
    spawnCounter++;
    if (spawnCounter >= spawnRate) {
        spawnCounter = 0;

        const lanes = [0, 1, 2];
        const randomLanes = [];
        
        // Randomly choose 1-3 lanes to have obstacles
        const numObstacles = Math.random() > 0.4 ? 2 : 1;
        for (let i = 0; i < numObstacles; i++) {
            const randomIndex = Math.floor(Math.random() * lanes.length);
            randomLanes.push(lanes.splice(randomIndex, 1)[0]);
        }

        randomLanes.forEach(lane => {
            const hasGap = Math.random() > 0.7;
            obstacles.push({
                y: -80,
                lanes: [lane],
                hasGap: hasGap,
                gapLane: hasGap ? Math.floor(Math.random() * 3) : -1
            });
        });

        // Spawn coins between obstacles
        if (Math.random() > 0.6) {
            const coinLane = Math.floor(Math.random() * 3);
            gameCoins.push({
                y: -40,
                lane: coinLane,
                collected: false
            });
        }

        // Gradually increase difficulty
        if (spawnRate > 40) spawnRate -= 0.05;
        if (obstacleSpeed < 10) obstacleSpeed += 0.01;
    }
}

function updateObstacles() {
    obstacles.forEach((obs, index) => {
        obs.y += obstacleSpeed;

        // Check collision
        if (checkCollision(obs)) {
            endGame();
        }

        // Remove off-screen obstacles and award points
        if (obs.y > 600) {
            obstacles.splice(index, 1);
            score += 10;
            updateUI();
        }
    });
}

function updateCoins() {
    gameCoins.forEach((coin, index) => {
        coin.y += obstacleSpeed;

        // Check collection
        if (!coin.collected && checkCoinCollision(coin)) {
            coin.collected = true;
            coins += 1;
            score += 50;
            updateUI();
        }

        // Remove off-screen coins
        if (coin.y > 600) {
            gameCoins.splice(index, 1);
        }
    });
}

function checkCollision(obstacle) {
    const playerLaneIndex = LANES.indexOf(playerX);
    const adjustedHeight = isSliding ? 25 : playerHeight;

    for (let lane of obstacle.lanes) {
        if (lane === playerLaneIndex) {
            const obsTop = obstacle.y;
            const obsBottom = obstacle.y + 80;
            const playerTop = playerY;
            const playerBottom = playerY + adjustedHeight;

            if (!(playerBottom < obsTop || playerTop > obsBottom)) {
                return true;
            }
        }
    }
    return false;
}

function checkCoinCollision(coin) {
    const playerLaneIndex = LANES.indexOf(playerX);
    const adjustedHeight = isSliding ? 25 : playerHeight;

    if (coin.lane === playerLaneIndex) {
        const coinTop = coin.y;
        const coinBottom = coin.y + 20;
        const playerTop = playerY;
        const playerBottom = playerY + adjustedHeight;

        if (!(playerBottom < coinTop || playerTop > coinBottom)) {
            return true;
        }
    }
    return false;
}

function renderObstacles() {
    gameContainer.querySelectorAll('.obstacle').forEach(el => el.remove());
    
    obstacles.forEach(obs => {
        const obstacleEl = document.createElement('div');
        obstacleEl.className = 'obstacle';
        obstacleEl.style.top = obs.y + 'px';
        
        for (let i = 0; i < 3; i++) {
            const block = document.createElement('div');
            block.className = 'obstacle-block';
            
            // Create gap if needed
            if (obs.hasGap && obs.gapLane === i) {
                block.classList.add('safe');
                block.style.opacity = '0.3';
            }
            
            obstacleEl.appendChild(block);
        }
        
        gameContainer.appendChild(obstacleEl);
    });
}

function renderCoins() {
    gameContainer.querySelectorAll('.coin').forEach(el => el.remove());
    
    gameCoins.forEach(coin => {
        if (!coin.collected) {
            const coinEl = document.createElement('div');
            coinEl.className = 'coin';
            coinEl.style.top = coin.y + 'px';
            coinEl.style.left = LANES[coin.lane] + 'px';
            gameContainer.appendChild(coinEl);
        }
    });
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    gameOverScreen.classList.remove('hidden');
}

function gameLoop() {
    if (!gameRunning) return;

    updatePlayerPhysics();
    spawnObstacle();
    updateObstacles();
    updateCoins();
    renderObstacles();
    renderCoins();

    requestAnimationFrame(gameLoop);
}

// Keyboard controls
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch(e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            movePlayer('left');
            break;
        case 'arrowright':
        case 'd':
            movePlayer('right');
            break;
        case 'arrowup':
        case 'w':
            jumpPlayer();
            break;
        case 'arrowdown':
        case 's':
            slidePlayer();
            break;
    }
});

// Touch controls for mobile
let touchStartX = 0;
let touchStartY = 0;

gameContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

gameContainer.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    e.preventDefault();

    const touchEndX = e.touches[0].clientX;
    const touchEndY = e.touches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30) {
            movePlayer('right');
        } else if (diffX < -30) {
            movePlayer('left');
        }
    } else {
        if (diffY < -30) {
            jumpPlayer();
        } else if (diffY > 30) {
            slidePlayer();
        }
    }
});
