// Game Constants & State
const LANE_WIDTH = 3;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const JUMP_FORCE = 0.2;
const GRAVITY = 0.008;

let scene, camera, renderer, player, clock;
let currentLane = 1;
let isJumping = false;
let isRolling = false;
let verticalVelocity = 0;
let gameActive = false;
let score = 0;
let gameSpeed = 0.2;
let obstacles = [];
let coins = [];
let environment = [];
let animationId;

// Initialization
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 10, 50);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 4, 8);
    camera.lookAt(0, 1, -5);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('game-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(5, 10, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    createGround();
    createPlayer();

    clock = new THREE.Clock();

    window.addEventListener('resize', onWindowResize);
    setupControls();
}

// (ALL THE REST OF YOUR JS CODE STAYS EXACTLY THE SAME ↓)

// 👉 Paste EVERYTHING from your original <script> here unchanged

// Run
window.onload = init;