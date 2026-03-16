const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const container = document.getElementById('game-container');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-btn');
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const finalScoreDisplay = document.getElementById('final-score-display');

const GRAVITY = 0.6;
const JUMP_FORCE = -11.5;
const GROUND_Y = 200;
let INITIAL_SPEED = 5;
let gameSpeed = INITIAL_SPEED;
let gameActive = false;
let score = 0;
let highScore = 0;
let isNight = false;

const dino = {
    x: 50,
    y: GROUND_Y,
    width: 44,
    height: 47,
    dy: 0,
    grounded: true,
    isDucking: false,
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y - (this.isDucking ? this.height * 0.6 : this.height));
        ctx.fillStyle = isNight ? '#ccc' : '#535353';

        if (!this.isDucking) {
            // גוף וזנב
            ctx.fillRect(0, 22, 4, 8);
            ctx.fillRect(4, 18, 4, 10);
            ctx.fillRect(8, 14, 18, 20);
            // צוואר וראש
            ctx.fillRect(22, 6, 8, 10);
            ctx.fillRect(22, 0, 20, 14);
            ctx.fillRect(42, 2, 4, 8);
            // עין
            ctx.fillStyle = isNight ? '#1a1a2e' : 'white';
            ctx.fillRect(34, 4, 4, 4);
            
            ctx.fillStyle = isNight ? '#ccc' : '#535353';
            ctx.fillRect(26, 20, 6, 3);

            // רגליים
            const legCycle = Math.floor(Date.now() / 100) % 2;
            if (!this.grounded) {
                ctx.fillRect(12, 34, 7, 12);
                ctx.fillRect(25, 34, 7, 12);
            } else {
                ctx.fillRect(12, 34, 7, legCycle === 0 ? 12 : 6);
                ctx.fillRect(25, 34, 7, legCycle === 1 ? 12 : 6);
            }
        } else {
            // דינוזאור מתכופף
            ctx.fillRect(0, 14, 10, 8);
            ctx.fillRect(10, 10, 30, 16);
            ctx.fillRect(40, 10, 14, 12);
            ctx.fillRect(54, 12, 3, 6);
            ctx.fillStyle = isNight ? '#1a1a2e' : 'white';
            ctx.fillRect(48, 12, 3, 3);
            
            ctx.fillStyle = isNight ? '#ccc' : '#535353';
            const legCycle = Math.floor(Date.now() / 80) % 2;
            ctx.fillRect(15, 26, 8, legCycle === 0 ? 6 : 3);
            ctx.fillRect(28, 26, 8, legCycle === 1 ? 6 : 3);
        }
        ctx.restore();
    },
    update() {
        if (!(this.isDucking && this.grounded)) {
            this.dy += GRAVITY;
            this.y += this.dy;
        }
        if (this.y > GROUND_Y) {
            this.y = GROUND_Y;
            this.dy = 0;
            this.grounded = true;
        }
    },
    jump() {
        if (this.grounded && !this.isDucking) {
            this.dy = JUMP_FORCE;
            this.grounded = false;
        }
    }
};

class Obstacle {
    constructor() {
        this.type = (score > 400 && Math.random() < 0.3) ? 'dragon' : 'cactus';
        this.x = canvas.width;
        
        if (this.type === 'cactus') {
            this.variant = Math.floor(Math.random() * 5);
            this.isLarge = this.variant >= 3;
            this.count = (this.variant % 3) + 1;
            
            this.height = this.isLarge ? 46 : 32;
            this.unitWidth = this.isLarge ? 20 : 15;
            this.width = this.unitWidth * this.count;
            this.y = GROUND_Y - this.height;
        } else {
            const heights = [GROUND_Y - 20, GROUND_Y - 55, GROUND_Y - 90];
            this.y = heights[Math.floor(Math.random() * heights.length)];
            this.width = 42;
            this.height = 30;
        }
    }

    drawPixelCactus(x, y, h, w) {
        const color = isNight ? '#ccc' : '#535353';
        ctx.fillStyle = color;
        
        const stemW = Math.floor(w * 0.4);
        const stemX = x + Math.floor((w - stemW) / 2);
        
        ctx.fillRect(stemX, y + 4, stemW, h - 4);
        ctx.fillRect(stemX + 2, y, stemW - 4, 4);

        // ענף שמאל
        const branchLeftY = y + Math.floor(h * 0.3);
        const branchH = Math.floor(h * 0.4);
        ctx.fillRect(x, branchLeftY + 4, 4, branchH - 4);
        ctx.fillRect(x + 1, branchLeftY, 2, 4);
        ctx.fillRect(x, branchLeftY + branchH - 4, stemX - x, 4);

        // ענף ימין
        const branchRightY = y + Math.floor(h * 0.4);
        const branchRH = Math.floor(h * 0.3);
        ctx.fillRect(x + w - 4, branchRightY + 4, 4, branchRH - 4);
        ctx.fillRect(x + w - 3, branchRightY, 2, 4);
        ctx.fillRect(stemX + stemW, branchRightY + branchRH - 4, (x + w) - (stemX + stemW), 4);
    }

    draw() {
        if (this.type === 'cactus') {
            for (let i = 0; i < this.count; i++) {
                this.drawPixelCactus(this.x + (i * this.unitWidth), this.y, this.height, this.unitWidth);
            }
        } else {
            ctx.fillStyle = isNight ? '#ccc' : '#535353';
            ctx.fillRect(this.x, this.y + 10, 30, 8);
            ctx.fillRect(this.x + 25, this.y, 12, 12);
            const wingPos = Math.sin(Date.now() / 100) > 0 ? -15 : 15;
            ctx.fillRect(this.x + 8, this.y + 10, 10, wingPos);
        }
    }

    update() {
        this.x -= gameSpeed;
    }
}

let obstacles = [];
let stars = Array.from({ length: 25 }, () => ({
    x: Math.random() * 800,
    y: Math.random() * 150,
    size: Math.random() * 2
}));

function drawBackground() {
    if (isNight) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        stars.forEach(s => ctx.fillRect(s.x, s.y, s.size, s.size));
        ctx.beginPath();
        ctx.arc(650, 50, 18, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(650, 50, 22, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.strokeStyle = isNight ? '#444' : '#535353';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    ctx.fillStyle = isNight ? '#333' : '#dbdbdb';
    for (let i = 0; i < canvas.width; i += 120) {
        ctx.fillRect((i - (score * 2) % 120), GROUND_Y + 10, 3, 2);
        ctx.fillRect((i + 50 - (score * 2) % 120), GROUND_Y + 15, 5, 2);
    }
}

function checkCollision(dino, obs) {
    const dH = {
        x: dino.x + 12,
        y: dino.isDucking ? dino.y - dino.height * 0.55 : dino.y - dino.height + 8,
        w: dino.width - 24,
        h: dino.isDucking ? dino.height * 0.45 : dino.height - 14
    };
    return (
        dH.x < obs.x + obs.width &&
        dH.x + dH.w > obs.x &&
        dH.y < obs.y + obs.height &&
        dH.y + dH.h > obs.y
    );
}

function gameLoop() {
    if (!gameActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score += 0.15;
    gameSpeed += 0.0006;

    const currentScoreInt = Math.floor(score);
    const nightCycle = Math.floor(currentScoreInt / 500) % 2 === 1;
    if (nightCycle !== isNight) {
        isNight = nightCycle;
        container.classList.toggle('night', isNight);
    }

    drawBackground();
    dino.update();
    dino.draw();

    if (obstacles.length === 0 || canvas.width - obstacles[obstacles.length - 1].x > (350 + Math.random() * 400)) {
        obstacles.push(new Obstacle());
    }

    obstacles.forEach((obs, i) => {
        obs.update();
        obs.draw();
        if (checkCollision(dino, obs)) {
            gameActive = false;
            gameOver();
        }
        if (obs.x + obs.width < 0) obstacles.splice(i, 1);
    });

    currentScoreEl.innerText = currentScoreInt.toString().padStart(5, '0');
    highScoreEl.innerText = Math.floor(highScore).toString().padStart(5, '0');

    requestAnimationFrame(gameLoop);
}

function gameOver() {
    if (score > highScore) highScore = score;
    document.getElementById('game-over-text').classList.remove('hidden');
    finalScoreDisplay.innerText = `הניקוד שלך: ${Math.floor(score)}`;
    startBtn.innerText = 'נסה שוב';
    overlay.classList.remove('hidden');
}

function start() {
    score = 0;
    gameSpeed = INITIAL_SPEED;
    obstacles = [];
    gameActive = true;
    overlay.classList.add('hidden');
    gameLoop();
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!gameActive) start(); else dino.jump();
        e.preventDefault();
    }
    if (e.code === 'ArrowDown') {
        dino.isDucking = true;
        e.preventDefault();
    }
});

window.addEventListener('keyup', e => {
    if (e.code === 'ArrowDown') dino.isDucking = false;
});

startBtn.addEventListener('click', start);

document.getElementById('mobile-jump')?.addEventListener('touchstart', e => {
    if (!gameActive) start(); else dino.jump();
    e.preventDefault();
});

document.getElementById('mobile-duck')?.addEventListener('touchstart', e => {
    dino.isDucking = true;
    e.preventDefault();
});

document.getElementById('mobile-duck')?.addEventListener('touchend', e => {
    dino.isDucking = false;
    e.preventDefault();
});

function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resize);
resize();