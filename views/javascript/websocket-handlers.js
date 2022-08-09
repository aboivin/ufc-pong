function displayCountDown() {
    for(let i = 5; i >= 0; i--) {
        setTimeout(() => overlay.innerHTML = i === 0 ? 'GO!' : i, 2500 - i*500);
    }
    setTimeout(() => overlay.innerHTML = '', 3000);

}

const initPing = () => {
    setInterval(() => wsEmitPing(), 1000);
}

const initWebSocketHandlers = (players, currentPlayerId, initBuffers, printScore) => {

    const createPlayer = (playerMsg) => {
        // console.log(playerMsg.location);
        const player = new Player(playerMsg.id,
            playerMsg.location,
            playerMsg.angle,
            playerMsg.color,
            playerMsg.nickname,
            playerMsg.range,
            playerMsg.score,
            playerMsg.isHost,
            playerMsg.isAlive);
        initBuffers(player);
        return player;
    };

    socket.on('players-sync', (playersMsg) => {
        for (let playerMsg of Object.values(playersMsg)) {
            // console.log('players-sync-handler ', playersMsg);
            if (players[playerMsg.id] == null) {
                players[playerMsg.id] = createPlayer(playerMsg);
            }
            if (playerMsg.id !== currentPlayerId) {
                players[playerMsg.id].translateTo([...playerMsg.location]);
                players[playerMsg.id].direction = playerMsg.direction;
            }
            players[playerMsg.id].score = playerMsg.score;
        }

        const msgIds = Object.values(playersMsg).map(p => p.id);
        Object.keys(players).filter(id => !msgIds.includes(id))
            .forEach(id => delete players[id]);

        printScore(players);
        // console.log('players-sync', players);
    });

    socket.on('new-round', (msg) => {
        // console.log('handler-new-round', msg.ball, msg.players);
        roundId = msg.roundId;
        ball.translateTo(Object.values(msg.ball.location));
        ball.velocity = [0.0, 0.0, 0.0];
        for (let playerMsg of msg.players) {
            players[playerMsg.id] = createPlayer(playerMsg);
            console.log('new-round init buffer');
        }

        displayCountDown();
        setTimeout(() => {
            // console.log("new-round started", msg.ball.velocity);
            ball.velocity = msg.ball.velocity;
        }, 2500);
    });

    socket.on('ball-sync', (msg) => {
        ball.velocity = msg.velocity;
        ball.location = msg.location;
        ball.mvMatrix = mat4.fromValues(...Object.values(msg.mvMatrix));
    });

    socket.on('ping-response', (msg) => {
        document.getElementById("ping").innerHTML = (new Date().getTime() - msg.time).toString();
    });
};
