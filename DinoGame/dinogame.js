// ────────────────────────────────────────────────
//  TEXTURES
// ────────────────────────────────────────────────
function createTexture(drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    drawFn(ctx);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
}

const textures = {
    brick: createTexture(ctx => {
        ctx.fillStyle = '#9c4a00';
        ctx.fillRect(0,0,128,128);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, 124, 60);
        ctx.strokeRect(2, 64, 60, 60);
        ctx.strokeRect(66, 64, 60, 60);
        ctx.fillStyle = '#ff8a3d';
        ctx.fillRect(4,4,120,4);
    }),
    question: createTexture(ctx => {
        ctx.fillStyle = '#f7941d';
        ctx.fillRect(0,0,128,128);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 100px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('?', 64, 100);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 4;
        ctx.strokeRect(10,10,108,108);
    }),
    grass: createTexture(ctx => {
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(0,0,128,128);
        ctx.fillStyle = '#458b00';
        ctx.fillRect(0,0,128,40);
        ctx.fillStyle = '#66cd00';
        ctx.fillRect(0,0,128,10);
    }),
    pipe: createTexture(ctx => {
        ctx.fillStyle = '#00a800';
        ctx.fillRect(0,0,128,128);
        ctx.fillStyle = '#007000';
        ctx.fillRect(0,0,20,128);
        ctx.fillRect(100,0,28,128);
    })
};

// ────────────────────────────────────────────────
//  GAME VARIABLES
// ────────────────────────────────────────────────
let scene, camera, renderer, player, clock;
let score = 0, coinsCount = 0, lives = 3, gameActive = true;
let velocity = new THREE.Vector3();
let moveDir = { horizontal: 0 };
const GRAVITY = -0.015;
const JUMP_FORCE = 0.35;
let onGround = false;

const objects = [];
const enemies = [];
const coins = [];

// ────────────────────────────────────────────────
//  INIT
// ────────────────────────────────────────────────
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x5c94fc);
    
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 1);
    sun.position.set(20, 30, 10);
    sun.castShadow = true;
    scene.add(sun);

    createPlayer();
    buildLevel();
    setupControls();
    
    lives = 3;
    score = 0;
    coinsCount = 0;
    updateUI();
    
    animate();
}

// ────────────────────────────────────────────────
//  PLAYER
// ────────────────────────────────────────────────
function createPlayer() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.9, 0.7),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    body.position.y = 0.45;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.5, 0.5),
        new THREE.MeshPhongMaterial({ color: 0xffdbac })
    );
    head.position.y = 1.15;
    group.add(head);

    const hat = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.15, 0.6),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
    );
    hat.position.y = 1.45;
    group.add(hat);

    player = group;
    player.position.set(0, 2, 5);
    scene.add(player);
}

// ────────────────────────────────────────────────
//  LEVEL
// ────────────────────────────────────────────────
function buildLevel() {
    // Ground
    const groundGeo = new THREE.BoxGeometry(10, 2, 250);
    const groundMat = new THREE.MeshPhongMaterial({ map: textures.grass });
    textures.grass.wrapS = textures.grass.wrapT = THREE.RepeatWrapping;
    textures.grass.repeat.set(2, 50);
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);
    objects.push(ground);

    // Blocks
    addBlock(0, 4, -10, 'question');
    addBlock(0, 4, -11.2, 'brick');
    addBlock(0, 4, -8.8, 'brick');

    // Pipes
    addPipe(0, 0, -20, 2);
    addPipe(0, 0, -35, 3.5);
    addPipe(0, 0, -50, 2.5);

    // Stairs
    for(let i = 0; i < 4; i++) {
        addBlock(0, 0.6 + i*1.2, -65 - i*1.2, 'brick');
    }

    // Coins
    for(let i = 0; i < 10; i++) addCoin(0, 1.5, -5 - i*8);
    
    // Enemies
    addEnemy(0, 0, -15);
    addEnemy(0, 0, -28);
    addEnemy(0, 0, -42);
    addEnemy(0, 0, -75);

    // Goal
    const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 8);
    const poleMat = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(0, 4, -110);
    scene.add(pole);
    objects.push({ mesh: pole, isGoal: true });
}

function addBlock(x, y, z, type) {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.2, 1.2),
        new THREE.MeshPhongMaterial({ map: textures[type] })
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = mesh.receiveShadow = true;
    scene.add(mesh);
    objects.push(mesh);
}

function addPipe(x, y, z, height) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(1.1, 1.1, height, 20),
        new THREE.MeshPhongMaterial({ map: textures.pipe })
    );
    body.position.y = height / 2;
    
    const top = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.8, 20),
        new THREE.MeshPhongMaterial({ map: textures.pipe })
    );
    top.position.y = height;
    
    group.add(body, top);
    group.position.set(x, y, z);
    scene.add(group);
    objects.push(body, top);
}

function addCoin(x, y, z) {
    const mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16),
        new THREE.MeshPhongMaterial({ color: 0xffd700, emissive: 0xaa8800 })
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(x, y, z);
    scene.add(mesh);
    coins.push(mesh);
}

function addEnemy(x, y, z) {
    const group = new THREE.Group();
    const head = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.8, 0.6, 8),
        new THREE.MeshPhongMaterial({ color: 0x8b4513 })
    );
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.4, 0.4),
        new THREE.MeshPhongMaterial({ color: 0xffdbac })
    );
    body.position.y = -0.4;
    group.add(head, body);
    group.position.set(x, 0.7, z);
    scene.add(group);
    enemies.push({ mesh: group, dir: 1, startZ: z });
}

// ────────────────────────────────────────────────
//  CONTROLS
// ────────────────────────────────────────────────
function setupControls() {
    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'd') moveDir.horizontal = -1;
        if (e.key === 'ArrowLeft'  || e.key === 'a') moveDir.horizontal = 1;
        if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === ' ') && onGround) {
            velocity.y = JUMP_FORCE;
        }
    });

    window.addEventListener('keyup', e => {
        if (['ArrowLeft','ArrowRight','a','d'].includes(e.key)) {
            moveDir.horizontal = 0;
        }
    });

    // ── Mobile joystick ───────────────────────────
    const joy = document.getElementById('joy-container');
    const knob = document.getElementById('joy-knob');

    joy.addEventListener('touchmove', e => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = joy.getBoundingClientRect();
        const dx = touch.clientX - (rect.left + rect.width / 2);
        const dist = Math.min(Math.abs(dx), 50);
        knob.style.transform = `translateX(${dx > 0 ? dist : -dist}px)`;
        moveDir.horizontal = dx > 0 ? -1 : 1;
    });

    joy.addEventListener('touchend', () => {
        knob.style.transform = `translate(0,0)`;
        moveDir.horizontal = 0;
    });

    document.getElementById('mobile-jump').addEventListener('touchstart', e => {
        e.preventDefault();
        if (onGround) velocity.y = JUMP_FORCE;
    });
}

// ────────────────────────────────────────────────
//  COLLISIONS & LOGIC
// ────────────────────────────────────────────────
function checkCollisions() {
    onGround = false;
    const playerBox = new THREE.Box3().setFromObject(player);

    objects.forEach(obj => {
        const mesh = obj.isMesh ? obj : obj.mesh || obj;
        const objBox = new THREE.Box3().setFromObject(mesh);

        if (playerBox.intersectsBox(objBox)) {
            if (obj.isGoal) {
                endGame(true);
                return;
            }
            if (player.position.y > mesh.position.y && velocity.y <= 0) {
                player.position.y = objBox.max.y;
                velocity.y = 0;
                onGround = true;
            } else if (player.position.y < mesh.position.y && velocity.y > 0) {
                velocity.y = -0.05;
            }
        }
    });

    // Coins
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        coin.rotation.y += 0.1;
        if (player.position.distanceTo(coin.position) < 1.2) {
            scene.remove(coin);
            coins.splice(i, 1);
            coinsCount++;
            score += 100;
            updateUI();
        }
    }

    // Enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const en = enemies[i];
        en.mesh.position.z += 0.05 * en.dir;
        if (Math.abs(en.mesh.position.z - en.startZ) > 4) en.dir *= -1;

        if (player.position.distanceTo(en.mesh.position) < 1.1) {
            if (player.position.y > en.mesh.position.y + 0.4 && velocity.y < 0) {
                scene.remove(en.mesh);
                enemies.splice(i, 1);
                velocity.y = 0.25;
                score += 500;
                updateUI();
            } else {
                playerHit();
            }
        }
    }

    if (player.position.y < -5) playerHit();
}

function playerHit() {
    lives--;
    updateUI();
    if (lives > 0) {
        player.position.set(0, 2, 5);
        velocity.set(0, 0, 0);
        moveDir.horizontal = 0;
    } else {
        endGame(false);
    }
}

function updateUI() {
    document.getElementById('score').innerText = score.toString().padStart(6, '0');
    document.getElementById('coins').innerText = coinsCount;
    document.getElementById('lives').innerText = lives;
}

function endGame(win) {
    gameActive = false;
    const modal = document.getElementById('modal');
    modal.style.display = 'flex';
    
    document.getElementById('modal-title').innerText = win ? "COURSE CLEAR!" : "GAME OVER";
    document.getElementById('modal-title').style.color = win ? "#22c55e" : "#ef4444";
    document.getElementById('modal-text').innerText = `ניקוד סופי: ${score}`;
}

// ────────────────────────────────────────────────
//  ANIMATION LOOP
// ────────────────────────────────────────────────
function animate() {
    if (!gameActive) return;
    requestAnimationFrame(animate);

    player.position.z += moveDir.horizontal * 0.18;
    player.position.x = 0; // lock to center line

    velocity.y += GRAVITY;
    player.position.y += velocity.y;

    checkCollisions();

    // Camera (side view)
    const camDistance = 18;
    const camHeight = 4;
    camera.position.set(camDistance, player.position.y * 0.5 + camHeight, player.position.z);
    camera.lookAt(0, player.position.y + 1, player.position.z);

    renderer.render(scene, camera);
}

// ────────────────────────────────────────────────
//  RESIZE
// ────────────────────────────────────────────────
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the game
init();