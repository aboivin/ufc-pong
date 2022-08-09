const wsEmitMove = (player) => {
    socket.emit('player-location', {
        id: player.id,
        location: player.location,
        direction: player.direction,
    });
};

const wsEmitBallLocation = (ball) => {
    socket.emit('ball-location', {
        location: ball.location,
        velocity: ball.velocity,
        mvMatrix: ball.mvMatrix
    });
};

const wsEmitElimination = (playerId, roundId) => {
    socket.emit('elimination', {id: playerId, roundId});
};

const wsEmitNewGame = () => {
    socket.emit('new-game', {});
};

const wsEmitJoin = (nickname) => {
    socket.emit('join', {id: currentPlayerId, nickname});
};

const wsEmitPing = () => {
    socket.emit('ping-request', { time: new Date().getTime() });
};
