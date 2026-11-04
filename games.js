// games.js — the list of every game on the hub (no Firebase needed, so the homepage always works)
// ---------- Every game on the hub ----------
// id = game folder name in lowercase. To add a game: add a line here — the homepage,
// profile and admin page all read this list.
export const GAMES = {
    noametry:     { name: "Noametry",      path: "/Noametry/noametry",         img: "/Noametry.png",           tags: ["puzzle"],           desc: "Jump and dodge your way through geometric levels.", original: true },
    spaceshooter: { name: "Space Shooter", path: "/SpaceShooter/spaceshooter", img: "/thumbs/spaceshooter.png", tags: ["arcade"],           desc: "Blast alien waves, grab power-ups, beat the boss.", isNew: true },
    game2048:     { name: "2048",          path: "/Game2048/2048",             img: "/thumbs/2048.png",         tags: ["puzzle"],           desc: "Slide and merge the tiles to reach 2048.", isNew: true },
    breakout:     { name: "Brick Smash",      path: "/Breakout/breakout",         img: "/thumbs/breakout.png",     tags: ["arcade"],           desc: "Smash every brick — level after level.", isNew: true },
    memory:       { name: "Memory Match",  path: "/Memory/memory",             img: "/thumbs/memory.png",       tags: ["puzzle"],           desc: "Flip cards and find every pair.", isNew: true },
    subwaysurfer: { name: "Subway Runner", path: "/SubwaySurfer/subwaysurf",   img: "/thumbs/subway.png",       tags: ["runner"],           desc: "Switch lanes, jump barriers, dodge the trains." },
    dinogame:     { name: "Dino Run",      path: "/DinoGame/dinogame",         img: "/thumbs/dino.png",         tags: ["runner", "arcade"], desc: "Jump the cacti and duck under the birds." },
    flappybird:   { name: "Sky Hopper",    path: "/FlappyBird/flappybird",     img: "/thumbs/flappybird.png",  tags: ["arcade"],           desc: "Tap to flap and fly through the gaps." },
    snake:        { name: "Snake",         path: "/Snake/snake",               img: "/thumbs/snake.png",              tags: ["arcade"],           desc: "The classic — eat and grow longer." },
    pacman:       { name: "Maze Muncher",        path: "/Pacman/pacman",             img: "/thumbs/pacman.png",             tags: ["arcade"],           desc: "Eat all the dots and avoid the ghosts." },
    tetris:       { name: "Block Drop",        path: "/Tetris/tetris",             img: "/thumbs/tetris.png",             tags: ["puzzle"],           desc: "Arrange falling blocks to clear lines." },
    mario:        { name: "Pixel Jumper",         path: "/Mario/mario",               img: "/thumbs/mario.png",              tags: ["platformer"],       desc: "Run, jump and stomp across new levels." },
    bubblebobble: { name: "Bubble Blaster", path: "/BubbleBobble/bubblebobble", img: "/thumbs/bubblebobble.png",       tags: ["arcade", "platformer"], desc: "Blow bubbles to trap the monsters." },
    chess:        { name: "Chess",         path: "/Chess/chess",               img: "/thumbs/chess.png",              tags: ["puzzle"],           desc: "Full chess for two players on one screen." },
    motorracing:  { name: "Motor Racing",  path: "/MotorRacing/motorracing",   img: "/thumbs/motorracing.png",        tags: ["sports"],           desc: "Race and dodge the traffic." },
    soccer:       { name: "Soccer",        path: "/Soccer/soccer",             img: "/thumbs/soccer.png",             tags: ["sports"],           desc: "Score more goals than the computer in 90 seconds." }
};

// Games that only count plays (no score)
export const PLAY_ONLY = ["chess"];

// Used until you save your own choice on the admin page (stored in Firestore: settings/games)
export const DEFAULT_PREMIUM = ["spaceshooter", "game2048", "mario", "bubblebobble", "chess"];

