const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gameRunning = false;
let score = 0;
let coins = 0;
let playerLane = 1;
let isJumping = false;
let jumpVelocity = 0;
let isSliding = false;
let slideDuration = 0;
let gameTime = 0;
let gameSpeed = 6;
let obstacles = [];
let collectibles = [];

const GRAVITY = 0.6;
const LANES = 3;
const GROUND_Y = canvas.height * 0.65;
const LANE_WIDTH = canvas.width / LANES;

class Player {
    constructor() {
        this.lane = 1;
        this.y = GROUND_Y;
        this.width = 35;
        this.height = 50;
    }

    draw() {
        const x = this.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const y = this.y - (isJumping ? Math.abs(jumpVelocity) * 3 : 0);

        ctx.save();
        ctx.translate(x, y);

        // Body
        ctx.fillStyle = '#FF4757';
        if (isSliding) {
            ctx.fillRect(-25, -15, 50, 25);
        } else {
            ctx.fillRect(-18, -25, 36, 50);
        }

        // Head
        ctx.fillStyle = '#FFB366';
        ctx.beginPath();
        ctx.arc(0, -28, 12, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(-5, -30, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(5, -30, 3, 0, Math.PI * 2);
        ctx.fill();

        // Arms
        ctx.strokeStyle = '#FFB366';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-18, -10);
        ctx.lineTo(-28, 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(18, -10);
        ctx.lineTo(28, 5);
        ctx.stroke();

        ctx.restore();
    }

    moveLane(direction) {
        if (direction === 'left' && this.lane > 0) this.lane--;
        if (direction === 'right' && this.lane < LANES - 1) this.lane++;
    }

    jump() {
        if (!isJumping && !isSliding) {
            isJumping = true;
            jumpVelocity = -15;
        }
    }

    slide() {
        if (!isSliding && !isJumping) {
            isSliding = true;
            slideDuration = 40;
        }
    }

    update() {
        if (isJumping) {
            jumpVelocity += GRAVITY;
            if (this.y + jumpVelocity * 3 >= GROUND_Y) {
                this.y = GROUND_Y;
                isJumping = false;
                jumpVelocity = 0;
            }
        }

        if (isSliding) {
            slideDuration--;
            if (slideDuration <= 0) {
                isSliding = false;
            }
        }
    }
}

class Obstacle {
    constructor(lane, distance) {
        this.lane = lane;
        this.distance = distance;
        this.width = LANE_WIDTH * 0.8;
        this.height = 60;
        this.passed = false;
    }

    draw() {
        const scale = Math.max(0.2, Math.min(1.2, this.distance / 800));
        const x = this.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const y = GROUND_Y - 50 + (800 - this.distance) * 0.3;

        if (y < 0 || y > canvas.height) return;

        ctx.save();
        ctx.globalAlpha = Math.min(1, scale);
        
        // Obstacle (barrier)
        ctx.fillStyle = '#FF6B9D';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 15;
        ctx.fillRect(x - this.width * scale / 2, y - this.height * scale / 2, this.width * scale, this.height * scale);

        // Stripes
        ctx.fillStyle = '#FF4757';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(x - this.width * scale / 2 + i * (this.width * scale / 3), y - this.height * scale / 2, this.width * scale / 10, this.height * scale);
        }

        ctx.restore();
    }

    update() {
        this.distance -= gameSpeed;
        return this.distance < 0;
    }
}

class Coin {
    constructor(lane, distance) {
        this.lane = lane;
        this.distance = distance;
        this.rotation = 0;
        this.collected = false;
        this.size = 15;
    }

    draw() {
        const scale = Math.max(0.2, Math.min(1.2, this.distance / 800));
        const x = this.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const y = GROUND_Y - 80 + (800 - this.distance) * 0.3;

        if (y < 0 || y > canvas.height || this.collected) return;

        this.rotation += 0.15;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = Math.min(1, scale);

        // Coin circle
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * scale, 0, Math.PI * 2);
        ctx.fill();

        // Coin shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.arc(-this.size * scale * 0.3, -this.size * scale * 0.3, this.size * scale * 0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    update() {
        this.distance -= gameSpeed;
    }
}

const player = new Player();

function drawBackground() {
    // Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground (tracks)
    ctx.fillStyle = '#222';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    // Track lines (perspective)
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
        const offset = (gameTime * gameSpeed + i * 80) % 80;
        const y = GROUND_Y + offset;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Lane dividers
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 3;
    ctx.setLineDash([15, 15]);
    for (let i = 1; i < LANES; i++) {
        const x = i * LANE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y - 200);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    ctx.setLineDash([]);
}

function checkCollisions() {
    const playerX = player.lane * LANE_WIDTH + LANE_WIDTH / 2;

    for (let obs of obstacles) {
        const scale = Math.max(0.2, Math.min(1.2, obs.distance / 800));
        const obsX = obs.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const obsY = GROUND_Y - 50 + (800 - obs.distance) * 0.3;

        if (obs.distance > -100 && obs.distance < 100) {
            const collisionWidth = obs.width * scale * 0.7;
            const collisionHeight = obs.height * scale;

            if (Math.abs(playerX - obsX) < collisionWidth && Math.abs(player.y - obsY) < collisionHeight + 30) {
                if (!isJumping && !isSliding) {
                    endGame();
                }
            }
        }
    }

    for (let coin of collectibles) {
        const scale = Math.max(0.2, Math.min(1.2, coin.distance / 800));
        const coinX = coin.lane * LANE_WIDTH + LANE_WIDTH / 2;
        const coinY = GROUND_Y - 80 + (800 - coin.distance) * 0.3;

        if (coin.distance > -50 && coin.distance < 100 && !coin.collected) {
            const distance = Math.abs(playerX - coinX) + Math.abs(player.y - coinY);
            if (distance < 50 * scale) {
                coin.collected = true;
                coins++;
                score += 50;
            }
        }
    }
}

function update() {
    gameTime++;

    player.update();

    // Spawn obstacles
    if (gameTime % 50 === 0) {
        const lanes = [0, 1, 2].sort(() => Math.random() - 0.5);
        const count = Math.random() > 0.5 ? 1 : 2;
        for (let i = 0; i < count; i++) {
            obstacles.push(new Obstacle(lanes[i], 800));
        }
    }

    // Spawn coins
    if (gameTime % 70 === 0) {
        const lane = Math.floor(Math.random() * LANES);
        collectibles.push(new Coin(lane, 700));
    }

    // Update obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].update()) {
            if (!obstacles[i].passed) {
                obstacles[i].passed = true;
                score += 10;
            }
            obstacles.splice(i, 1);
        }
    }

    // Update coins
    for (let i = collectibles.length - 1; i >= 0; i--) {
        collectibles[i].update();
        if (collectibles[i].distance < -50) {
            collectibles.splice(i, 1);
        }
    }

    // Increase difficulty
    if (gameTime % 200 === 0 && gameSpeed < 12) {
        gameSpeed += 0.5;
    }

    checkCollisions();

    document.getElementById('score').textContent = score;
    document.getElementById('coins').textContent = coins;
}

function draw() {
    drawBackground();

    // Draw game objects
    for (let obs of obstacles.sort((a, b) => a.distance - b.distance)) {
        obs.draw();
    }

    for (let coin of collectibles.sort((a, b) => a.distance - b.distance)) {
        coin.draw();
    }

    player.draw();
}

function gameLoop() {
    if (!gameRunning) return;

    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('gameOverScreen').style.display = 'none';

    gameRunning = true;
    score = 0;
    coins = 0;
    gameTime = 0;
    gameSpeed = 6;
    playerLane = 1;
    isJumping = false;
    isSliding = false;
    obstacles = [];
    collectibles = [];
    player.lane = 1;
    player.y = GROUND_Y;

    gameLoop();
}

function endGame() {
    gameRunning = false;
    document.getElementById('finalScore').textContent = score;
    document.getElementById('finalCoins').textContent = coins;
    document.getElementById('gameOverScreen').style.display = 'flex';
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;

    switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
            player.moveLane('left');
            break;
        case 'arrowright':
        case 'd':
            player.moveLane('right');
            break;
        case 'arrowup':
        case 'w':
        case ' ':
            player.jump();
            e.preventDefault();
            break;
        case 'arrowdown':
        case 's':
            player.slide();
            break;
    }
});

// Touch controls
let touchStartX = 0;
canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
});

canvas.addEventListener('touchmove', (e) => {
    if (!gameRunning) return;
    const diff = e.touches[0].clientX - touchStartX;
    if (Math.abs(diff) > 50) {
        if (diff > 0) player.moveLane('right');
        else player.moveLane('left');
        touchStartX = e.touches[0].clientX;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

draw();
