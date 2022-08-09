const ACCELERATION = 1.03;
const ELIMINATION_DISTANCE = 20;

const handleBallWithPlayerCollision = (player, ball, direction) => {
    const projectedPlayerLocation = vec3.fromValues(0, 0, 0);
    const projectedBallLocation = vec2.subtract(vec3.create(), ball.location, player.location);
    vec2.rotate(projectedBallLocation, projectedBallLocation, [0, 0], -player.angle);
    if (Math.abs(projectedBallLocation[0] - projectedPlayerLocation[0]) <= ball.radius + (player.width / 2.0) &&
        (projectedBallLocation[0] - projectedPlayerLocation[0]) * direction >= 0 &&
        Math.abs(projectedBallLocation[1] - projectedPlayerLocation[1]) <= ball.radius + (player.height / 2.0)) {
        const dir = player.direction90Vector;
        const dir90 = vec2.create();
        vec2.rotate(dir90, dir, [0.0, 0.0], Math.PI / 2);

        const scaleX = vec2.dot(ball.velocity, dir);
        const newX = vec3.fromValues(0, 0, 0);
        vec2.scale(newX, dir, scaleX);

        const projectionY = vec2.dot(ball.velocity, dir90);
        const newY = vec2.scale(vec3.fromValues(0, 0, 0), dir90, -projectionY);
        vec3.add(ball.velocity, newX, newY);

        vec3.scale(ball.velocity, ball.velocity, ACCELERATION);
        const newPosition = vec2.rotate(vec3.fromValues(0, 0, 0), [(ball.radius + (player.width / 2.0)) * direction, projectedBallLocation[1], 0], [0, 0], player.angle);
        ball.translateTo([player.location[0] + newPosition[0], player.location[1] + newPosition[1]]);
    }
};

const handleElimination = (player, ball, eliminationHandler) => {
    const projectedPlayerLocation = vec3.fromValues(0, 0, 0);
    const projectedBallLocation = vec2.subtract(vec3.create(), ball.location, player.location);
    vec2.rotate(projectedBallLocation, projectedBallLocation, [0, 0], -player.angle);
    if (projectedBallLocation[0] - ball.radius <= projectedPlayerLocation[0] - ELIMINATION_DISTANCE) {
        console.log('kick player ' + player.nickname + '(' + player.id+')');
        eliminationHandler(player.id);
    }
};

const handleBallWithCanvasCollision = () => {
    if ((ball.location[1] - ball.radius) < 0.0 || (ball.location[1] + ball.radius) >= canvas.height) {
        vec3.multiply(ball.velocity, ball.velocity, [1.0, -1.0, 1.0]);
        vec3.scale(ball.velocity, ball.velocity, ACCELERATION);
    }
    if ((ball.location[0] - ball.radius) < 0.0 || (ball.location[0] + ball.radius) >= canvas.height) {
        vec3.multiply(ball.velocity, ball.velocity, [-1.0, 1.0, 1.0]);
        vec3.scale(ball.velocity, ball.velocity, ACCELERATION);
    }
};

const handlePlayerRange = (canvas, player) => {
    const projectedPlayerLocation = vec3.subtract(vec3.create(), player.location, player.startLocation);
    vec2.rotate(projectedPlayerLocation, projectedPlayerLocation, [0, 0], -player.angle);

    if (projectedPlayerLocation[1] > player.range / 2 || projectedPlayerLocation[1] < -player.range / 2) {
        projectedPlayerLocation[1] = player.range / 2 * (projectedPlayerLocation[1] < -player.range / 2 ? -1 : 1);
        const newPosition = vec2.rotate(vec3.create(), projectedPlayerLocation, [0, 0], player.angle);
        player.translateTo([player.startLocation[0] + newPosition[0], player.startLocation[1] + newPosition[1]]);
    }
};

const handleCollision = (canvas, players, ball, eliminationHandler) => {
    for (let player of Object.values(players)) {
        handlePlayerRange(canvas, player);
        handleBallWithPlayerCollision(player, ball, 1);
        handleBallWithPlayerCollision(player, ball, -1);
        handleElimination(player, ball, eliminationHandler);
    }
    handleBallWithCanvasCollision();
};
