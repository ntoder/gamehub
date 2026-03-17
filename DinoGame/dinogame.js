const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const container = document.getElementById('game-container');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-btn');

const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');

let gameActive = false;
let score = 0;
let highScore = 0;

const dino = {
    x: 50,
    y: 200,
    dy: 0,
    grounded: true,

    draw() {
        ctx.fillRect(this.x, this.y - 40, 40, 40);
    },

    update() {
        this.dy += 0.6;
        this.y += this.dy;

        if (this.y > 200) {
            this.y = 200;
            this.dy = 0;
            this.grounded = true;
        }
    },

    jump() {
        if (this.grounded) {
            this.dy = -12;
            this.grounded = false;
        }
    }
};

let obstacles = [];

class Obstacle {
    constructor() {
        this.x = canvas.width;
        this.width = 20;
        this.height = 40;
        this.y = 200 - this.height;
    }

    draw() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= 5;
    }
}

function gameLoop() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score += 1;

    dino.update();
    dino.draw();

    if (Math.random() < 0.02) {
        obstacles.push(new Obstacle());
    }

    obstacles.forEach((obs, i) => {
        obs.update();
        obs.draw();

        if (
            dino.x < obs.x + obs.width &&
            dino.x + 40 > obs.x &&
            dino.y > obs.y
        ) {
            gameOver();
        }

        if (obs.x < -20) obstacles.splice(i, 1);
    });

    currentScoreEl.innerText = score;

    requestAnimationFrame(gameLoop);
}

function start() {
    score = 0;
    obstacles = [];
    gameActive = true;
    overlay.classList.add('hidden');
    gameLoop();
}

function gameOver() {
    gameActive = false;
    overlay.classList.remove('hidden');

    if (score > highScore) {
        highScore = score;
        highScoreEl.innerText = highScore;
    }
}

window.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        if (!gameActive) start();
        else dino.jump();
    }
});

startBtn.addEventListener('click', start);

function resize() {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
}
window.addEventListener('resize', resize);
resize();