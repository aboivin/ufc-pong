const handleBallWithPlayerCollision = (player, ball, direction) => {
    if (Math.abs(ball.location[0] - player.location[0]) <= (ball.width / 2.0) + (player.width / 2.0) &&
        (ball.location[0] - player.location[0]) * direction >= 0 &&
        Math.abs(ball.location[1] - player.location[1]) <= (ball.height / 2.0) + (player.height / 2.0)) {
        // console.log(ball.location[0], player.location[0], Math.abs(ball.location[0] - player.location[0]), Math.abs(ball.location[0] - player.location[0]) <= (ball.width / 2.0) + (player.width / 2.0));
        vec3.multiply(ball.velocity, ball.velocity, [-1.0, 1.0, 1.0]);
        vec3.multiply(ball.velocity, ball.velocity, [1.1, 1.1, 1.0]);
        mat4.translate(ball.mvMatrix, ball.mvMatrix, normalToClip([direction * (((ball.width / 2.0) + (player.width / 2.0)) - Math.abs(ball.location[0] - player.location[0])), 0, 0]));
        ball.location[0] = player.location[0] + ((ball.width / 2.0) + (player.width / 2.0)) * direction;
        console.log(ball.location[0]);
    }
};

const handleBallWithCanvasCollision = () => {
    if ((ball.location[1] - (ball.height / 2.0)) < 0.0 || (ball.location[1] + (ball.height / 2.0)) >= canvas.height) {
        vec3.multiply(ball.velocity, ball.velocity, [1.0, -1.0, 1.0]);
    }
};

const handlePlayerWithCanvasCollision = (canvas, player) => {
    if (player.location[1] - (player.height / 2.0) <= 0) {
        mat4.translate(player.mvMatrix, player.mvMatrix, normalToClip([0, (player.height / 2.0) - player.location[1], 0]));
        player.location[1] = (player.height / 2.0);
    }
    if (player.location[1] + (player.height / 2.0) >= canvas.height) {
        mat4.translate(player.mvMatrix, player.mvMatrix, normalToClip([0, canvas.height - (player.location[1] + (player.height / 2.0)), 0]));
        player.location[1] = canvas.height - (player.height / 2.0);
    }
};

const handleCollision = (canvas, players, ball) => {
    for (let player of players) {
        handlePlayerWithCanvasCollision(canvas, player);
        handleBallWithPlayerCollision(player, ball, 1);
        handleBallWithPlayerCollision(player, ball, -1);
    }

    handleBallWithCanvasCollision();
};
