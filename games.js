// games.js — the list of every game on the hub (no Firebase needed, so the homepage always works)
// ---------- Every game on the hub ----------
// id = game folder name in lowercase. To add a game: add a line here — the homepage,
// profile and admin page all read this list.
export const GAMES = {
    noametry:     { name: "Noametry",      path: "/Noametry/noametry",         img: "/Noametry.png",           tags: ["puzzle"],           desc: "Jump and dodge your way through geometric levels.", original: true },
    spaceshooter: { name: "Space Shooter", path: "/SpaceShooter/spaceshooter", img: "/thumbs/spaceshooter.png", tags: ["arcade"],           desc: "Blast alien waves, grab power-ups, beat the boss." },
    game2048:     { name: "2048",          path: "/Game2048/2048",             img: "/thumbs/2048.png",         tags: ["puzzle"],           desc: "Slide and merge the tiles to reach 2048." },
    breakout:     { name: "Brick Smash",      path: "/Breakout/breakout",         img: "/thumbs/breakout.png",     tags: ["arcade"],           desc: "Smash every brick — level after level." },
    memory:       { name: "Memory Match",  path: "/Memory/memory",             img: "/thumbs/memory.png",       tags: ["puzzle"],           desc: "Flip cards and find every pair." },
    subwaysurfer: { name: "Subway Runner", path: "/SubwaySurfer/subwaysurf",   img: "/thumbs/subway.png",       tags: ["runner"],           desc: "Switch lanes, jump barriers, dodge the trains." },
    dinogame:     { name: "Dino Run",      path: "/DinoGame/dinogame",         img: "/thumbs/dino.png",         tags: ["runner", "arcade"], desc: "Jump the cacti and duck under the birds." },
    flappybird:   { name: "Sky Hopper",    path: "/FlappyBird/flappybird",     img: "/thumbs/flappybird.png",  tags: ["arcade"],           desc: "Tap to flap and fly through the gaps." },
    snake:        { name: "Snake",         path: "/Snake/snake",               img: "/thumbs/snake.png",              tags: ["arcade"],           desc: "The classic — eat and grow longer." },
    pacman:       { name: "Maze Muncher",        path: "/Pacman/pacman",             img: "/thumbs/pacman.png",             tags: ["arcade"],           desc: "Eat all the dots and avoid the ghosts." },
    tetris:       { name: "Block Drop",        path: "/Tetris/tetris",             img: "/thumbs/tetris.png",             tags: ["puzzle"],           desc: "Arrange falling blocks to clear lines." },
    mario:        { name: "Pixel Jumper",         path: "/Mario/mario",               img: "/thumbs/mario.png",              tags: ["platformer"],       desc: "Run, jump and stomp across new levels." },
    bubblebobble: { name: "Bubble Blaster", path: "/BubbleBobble/bubblebobble", img: "/thumbs/bubblebobble.png",       tags: ["arcade", "platformer"], desc: "Blow bubbles to trap the monsters." },
    chess:        { name: "Chess",         path: "/Chess/chess",               img: "/thumbs/chess.png",              tags: ["puzzle", "brain"],           desc: "Play chess against the computer or a friend." },
    motorracing:  { name: "Motor Racing",  path: "/MotorRacing/motorracing",   img: "/thumbs/motorracing.png",        tags: ["sports"],           desc: "Race and dodge the traffic." },
    soccer:       { name: "Soccer",        path: "/Soccer/soccer",             img: "/thumbs/soccer.png",             tags: ["sports"],           desc: "Score more goals than the computer in 90 seconds." },
    paddlebattle: { name: "Paddle Battle", path: "/PaddleBattle/paddlebattle", img: "/thumbs/paddlebattle.png", tags: ["arcade", "sports"], desc: "Bounce the ball past the computer. First to 7 wins.", isNew: true },
    fourinarow:   { name: "Four in a Row", path: "/FourInARow/fourinarow",     img: "/thumbs/fourinarow.png",   tags: ["puzzle", "brain"],  desc: "Drop discs and line up four before the computer.", isNew: true },
    tictactoe:    { name: "Tic-Tac-Toe",   path: "/TicTacToe/tictactoe",       img: "/thumbs/tictactoe.png",    tags: ["puzzle", "brain"],  desc: "X and O against the computer or a friend.", isNew: true },
    minefinder:   { name: "Mine Finder",   path: "/MineFinder/minefinder",     img: "/thumbs/minefinder.png",   tags: ["puzzle", "brain"],  desc: "Use the numbers to find every hidden mine.", isNew: true },
    molemash:     { name: "Mole Mash",     path: "/MoleMash/molemash",         img: "/thumbs/molemash.png",     tags: ["arcade"],           desc: "Bop the moles, skip the bombs, beat the clock.", isNew: true },
    colorecho:    { name: "Color Echo",    path: "/ColorEcho/colorecho",       img: "/thumbs/colorecho.png",    tags: ["puzzle", "brain"],  desc: "Remember the colour pattern and play it back.", isNew: true },
    stacktower:   { name: "Stack Tower",   path: "/StackTower/stacktower",     img: "/thumbs/stacktower.png",   tags: ["arcade"],           desc: "Drop the blocks and build the tallest tower.", isNew: true },
    spacerocks:   { name: "Space Rocks",   path: "/SpaceRocks/spacerocks",     img: "/thumbs/spacerocks.png",   tags: ["arcade"],           desc: "Fly, shoot and break the space rocks apart.", isNew: true },
    mathblitz:    { name: "Math Blitz",    path: "/MathBlitz/mathblitz",       img: "/thumbs/mathblitz.png",    tags: ["brain"],            desc: "Solve as many sums as you can in 60 seconds.", isNew: true },
    typingrain:   { name: "Typing Rain",   path: "/TypingRain/typingrain",     img: "/thumbs/typingrain.png",   tags: ["brain"],            desc: "Type the falling words before they land.", isNew: true }
};

// Games that only count plays (no score)
export const PLAY_ONLY = ["chess", "tictactoe"];

// Used until you save your own choice on the admin page (stored in Firestore: settings/games)
export const DEFAULT_PREMIUM = ["spaceshooter", "game2048", "mario", "bubblebobble", "chess", "spacerocks", "typingrain"];

