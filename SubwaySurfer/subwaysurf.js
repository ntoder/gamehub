const gameContainer = document.querySelector('.game-container');
const player = document.querySelector('.player');
const uiScore = document.getElementById('score');
const uiCoins = document.getElementById('coins');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');

let gameRunning = false;
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
