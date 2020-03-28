const {mat4, vec3, vec2} = glMatrix;

const WHITE = [1.0, 1.0, 1.0, 1.0];

let gl;

let canvas;
let overlay;
const players = {};
let ball;
let currentPlayerId;
let roundId = null;

const initBall = () => {
    ball = new Ball([400.0, 400.0, 0.0], WHITE);
    initBuffers(ball);
};

const normalToClip = (src) => {
    const zeroToOne = vec3.divide(vec3.create(), src, resolution);
    const zeroToTwo = vec3.multiply(vec3.create(), zeroToOne, [2.0, 2.0, 2.0]);
    return vec3.multiply(zeroToTwo, zeroToTwo, [1.0, -1.0, 0.0]);
};

const playerEliminated = (playerId) => {
    overlay.innerHTML = `${players[playerId].nickname} has been eliminated`;
    ball.velocity = [0.0, 0.0, 0.0];
    setTimeout(() => {
        overlay.innerHTML = '';
    }, 1000);
        wsEmitElimination(playerId, roundId);
};

const handlePlayersMovement = (players) => {
    for (let player of Object.values(players)) {
        player.move();
    }
};

const tick = () => {
    requestAnimFrame(tick);
    handlePlayersMovement(players);
    handleCollision(canvas, players, ball, playerEliminated);
    drawScene();
    ball.move();
    animate(players, ball);
};

const animate = (players, ball) => {
    for (let player of Object.values(players)) {
        if (player.isAlive) {
            refillBuffers(player);
        }
    }
    refillBuffers(ball);
};

const loadGame = () => {
    canvas = document.getElementById("canvas");
    overlay = document.getElementById("overlay");
    gl = initGL(canvas);
    initShaders(gl);
    initBall();
    initKeyBinding(players, currentPlayerId);
    initWebSocketHandlers(players, currentPlayerId, initBuffers, printScore);

    gl.clearColor(0.1875, 0.1875, 0.1875, 1.0);
    gl.enable(gl.DEPTH_TEST);

    setInterval(() => {
        if (players[currentPlayerId] != null && players[currentPlayerId].isHost) {
            // wsEmitBallLocation(ball);
        }
    }, 500);

    tick();
    printScore(players);
};

const printScore = (players) => {
    document.getElementById("score").innerHTML = Object.values(players).map(p => `player ${p.nickname}: ${p.score}`).join(', ');
};

const newGame = () => {
    wsEmitNewGame();
};

const joinGame = () => {
    const nickname = document.getElementById("nickname").value;
    if (nickname == null) {
        return;
    }
    wsEmitJoin(nickname);
};

const connect = () => {
    socket.on('connect', () => {
        currentPlayerId = socket.id.split('#')[1];
        loadGame();
    });
};

connect();

document.getElementById("newGameButton").onclick = newGame;
document.getElementById("joinGameButton").onclick = joinGame;
