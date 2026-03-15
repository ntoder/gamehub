class GeometryDash {
    constructor() {
        // DOM Elements
        this.gameBoard = document.querySelector('.game-board');
        this.player = document.getElementById('player');
        this.ground = document.getElementById('ground');
        this.scoreDisplay = document.getElementById('score');
        this.bestDisplay = document.getElementById('best');
        this.levelDisplay = document.getElementById('level');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');

        // Audio context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Game properties
        this.playerY = this.gameBoard.clientHeight - 80;
        this.playerX = 50;
        this.playerVelocity = 0;
        this.isJumping = false;
        this.gravity = 0.6;
        this.jumpPower = -12;
        this.gameActive = true;
        this.score = 0;
        this.bestScore = localStorage.getItem('bestScore') || 0;
        this.level = 1;
        this.baseGameSpeed = 6;
        this.gameSpeed = 6;
        this.maxGameSpeed = 12;
        this.obstacles = [];
        this.obstacleId = 0;

        // Level thresholds (score needed to reach each level)
        this.levelThresholds = [0, 100, 200, 350, 500, 700, 950, 1250, 1600, 2000, 2500];

        // Game settings
        this.groundLevel = this.gameBoard.clientHeight - 50;
        this.playerSize = 30;

        // Initialize
        this.init();
    }

    init() {
        this.bestDisplay.textContent = this.bestScore;
        this.levelDisplay.textContent = this.level;
        this.updatePlayerPosition();
        this.setupEventListeners();
        this.spawnObstacles();
        this.gameLoop();
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.jump();
            }
        });

        document.addEventListener('click', () => this.jump());
        this.restartBtn.addEventListener('click', () => this.restart());
    }

    jump() {
        if (this.gameActive && !this.isJumping) {
            this.isJumping = true;
            this.playerVelocity = this.jumpPower;
            this.player.classList.add('jumping');
            this.playJumpSound();
        }
    }

    playJumpSound() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        oscillator.frequency.value = 500;
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playScoreSound() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    playGameOverSound() {
        const oscillator = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(this.audioContext.destination);
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
        oscillator.type = 'sine';
        gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    spawnObstacles() {
        setInterval(() => {
            if (!this.gameActive) return;

            const obstacleType = Math.random() < 0.4 ? 'spike' : (Math.random() < 0.6 ? 'block' : 'tall-spike');
            const obstacle = this.createObstacle(obstacleType);
            this.obstacles.push(obstacle);
        }, 2500 - Math.min(this.gameSpeed * 200, 1200));
    }

    createObstacle(type) {
        const obstacle = document.createElement('div');
        obstacle.className = `obstacle ${type}`;
        obstacle.id = `obstacle-${this.obstacleId++}`;
        
        const startX = this.gameBoard.clientWidth;
        obstacle.style.left = startX + 'px';

        this.gameBoard.insertBefore(obstacle, this.ground);

        return {
            element: obstacle,
            x: startX,
            width: type === 'spike' ? 30 : (type === 'tall-spike' ? 40 : 40),
            type: type,
            id: obstacle.id
        };
    }

    updatePlayerPosition() {
        this.playerY += this.playerVelocity;
        this.playerVelocity += this.gravity;

        // Ground collision
        if (this.playerY >= this.groundLevel) {
            this.playerY = this.groundLevel;
            this.playerVelocity = 0;
            this.isJumping = false;
            this.player.classList.remove('jumping');
        }

        // Ceiling collision (optional safety)
        if (this.playerY < 0) {
            this.playerY = 0;
            this.playerVelocity = 0;
        }

        this.player.style.bottom = (this.gameBoard.clientHeight - this.playerY - this.playerSize) + 'px';
    }

    moveObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.x -= this.gameSpeed;
            obs.element.style.left = obs.x + 'px';

            // Check collision
            if (this.checkCollision(obs)) {
                this.gameOver();
                return;
            }

            // Remove off-screen obstacles and add score
            if (obs.x + obs.width < 0) {
                obs.element.remove();
                this.obstacles.splice(i, 1);
                this.addScore(10);
            }
        }
    }

    checkCollision(obstacle) {
        const playerLeft = this.playerX;
        const playerRight = this.playerX + this.playerSize;
        const playerTop = this.playerY;
        const playerBottom = this.playerY + this.playerSize;

        const obsLeft = obstacle.x;
        const obsRight = obstacle.x + obstacle.width;
        const obsTop = this.groundLevel;
        const obsBottom = this.groundLevel + (obstacle.type === 'spike' ? 30 : (obstacle.type === 'tall-spike' ? 50 : 50));

        return playerRight > obsLeft &&
               playerLeft < obsRight &&
               playerBottom > obsTop &&
               playerTop < obsBottom;
    }

    addScore(points) {
        this.score += points;
        this.scoreDisplay.textContent = this.score;
        this.playScoreSound();

        // Check for level up
        this.checkLevelUp();

        // Increase game speed gradually
        if (this.gameSpeed < this.maxGameSpeed) {
            this.gameSpeed += 0.01;
        }
    }

    checkLevelUp() {
        for (let i = this.level; i <= 10; i++) {
            if (this.score >= this.levelThresholds[i] && this.level < 10) {
                this.level = i;
                this.levelDisplay.textContent = this.level;
                this.playLevelUpSound();
                // Increase difficulty
                this.maxGameSpeed = 12 + (this.level - 1) * 0.8;
            }
        }
    }

    playLevelUpSound() {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                oscillator.connect(gain);
                gain.connect(this.audioContext.destination);
                oscillator.frequency.value = 600 + i * 200;
                oscillator.type = 'sine';
                gain.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, i * 150);
        }
    }

    gameOver() {
        this.gameActive = false;
        this.finalScoreDisplay.textContent = this.score;
        this.playGameOverSound();

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('bestScore', this.bestScore);
            this.bestDisplay.textContent = this.bestScore;
        }

        this.gameOverScreen.classList.add('show');
    }

    restart() {
        // Clear obstacles
        this.obstacles.forEach(obs => obs.element.remove());
        this.obstacles = [];
        this.obstacleId = 0;

        // Reset game state
        this.playerY = this.gameBoard.clientHeight - 80;
        this.playerVelocity = 0;
        this.isJumping = false;
        this.gameActive = true;
        this.score = 0;
        this.level = 1;
        this.gameSpeed = this.baseGameSpeed;
        this.maxGameSpeed = 12;
        this.scoreDisplay.textContent = 0;
        this.levelDisplay.textContent = 1;
        this.gameOverScreen.classList.remove('show');
        this.player.classList.remove('jumping');

        this.updatePlayerPosition();
    }

    gameLoop() {
        if (this.gameActive) {
            this.updatePlayerPosition();
            this.moveObstacles();
        }

        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new GeometryDash();
});
