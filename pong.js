const {mat4, vec3} = glMatrix;

let gl;

let canvas;
const players = [];
let ball;

const RED = [1.0, 0.0, 0.0, 1.0];
const GREEN = [0.0, 1.0, 0.0, 1.0];
const BLUE = [0.0, 0.0, 1.0, 1.0];
const WHITE = [1.0, 1.0, 1.0, 1.0];

const initObjects = (players) => {
    players.push(new Player([100.0, 50.0, 0.0], RED));
    players.push(new Player([400.0, 50.0, 0.0], GREEN));
    players.push(new Player([200.0, 100.0, 0.0], WHITE));

    for (let player of players) {
        initBuffers(player);
    }

    ball = new Ball([250.0, 250.0, 0.0], BLUE);
    initBuffers(ball);
};

function normalToClip(src) {
    const zeroToOne = vec3.create();
    vec3.divide(zeroToOne, src, resolution);
    const zeroToTwo = vec3.create();
    vec3.multiply(zeroToTwo, zeroToOne, [2.0, 2.0, 2.0]);
    return vec3.multiply(zeroToTwo, zeroToTwo, [1.0, -1.0, 0.0]);
}

function tick() {
    requestAnimFrame(tick);
    handleKeyPress();
    handleCollision(canvas, players, ball);
    drawScene();
    ball.translate();
    animate(players, ball);
}

function animate(players, ball) {
    for (let player of players) {
        refillBuffers(player);
    }
    refillBuffers(ball);
}

function webGLStart() {
    canvas = document.getElementById("canvas");
    gl = initGL(canvas);
    initShaders(gl);
    initObjects(players);
    initKeyBinding(players);

    gl.clearColor(0.1875, 0.1875, 0.1875, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
