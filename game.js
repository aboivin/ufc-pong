class Game {

    constructor(id, io) {
        this.ball = {
            location: [400, 400],
            velocity: [0.0, 0.0, 0.0]
        };

        this.players = {};
        this.id = id;
        this.roundId = null;

        this.gameRoom = io.of('/games/' + id);

        this.gameRoom.on('connection', socket => {
            this.listenToNewRound(socket);
            this.listenToElimination(socket);
            this.listenToPlayerLocation(socket);
            this.listenToBallLocation(socket);
            this.listenToJoin(socket);
            this.listenToDisconnect(io, socket);
        });

        setInterval(() => this.gameRoom.emit('players-sync', this.players), 1000);
    }

    resetPlayersPositions() {
        const alivePlayers = Object.values(this.players).filter(p => p.isAlive);
        const gamePosition = gamePositions[alivePlayers.length];


        let i = 0;
        for (let player of Object.values(this.players)) {
            if (player.isAlive) {
                const position = gamePosition[i];
                this.players[player.id].location = position.location;
                this.players[player.id].range = position.range;
                this.players[player.id].angle = position.angle;
                this.players[player.id].isHost = position.isHost;
                i++;
            } else {
                this.players[player.id].location = [];
                this.players[player.id].range = 500;
                this.players[player.id].angle = 0;
                this.players[player.id].isHost = false;
            }
        }

        console.log(`Reseting player with a ${alivePlayers.length} players setup ${Object.values(this.players).filter(p => p.isAlive).map(p => p.nickname)}`);
    };

    listenToBallLocation(socket) {
        socket.on('ball-location', msg => {
            this.ball.location = msg.location;
            this.ball.velocity = msg.velocity;
            this.ball.mvMatrix = msg.mvMatrix;
            this.gameRoom.emit('ball-sync', this.ball);
        });
    }

    listenToPlayerLocation(socket) {
        socket.on('player-location', msg => {
            // console.log('player-location', msg);
            this.players[msg.id] = {...this.players[msg.id], ...msg};
            this.gameRoom.emit('players-sync', this.players);
        });
    }

    listenToElimination(socket) {
        socket.on('elimination', msg => {
            if (this.players[msg.id] != null && msg.roundId === this.roundId) {
                console.log(`Eliminating player ${this.players[msg.id].nickname}(${msg.id})`);
                this.players[msg.id].isAlive = false;
                let alivePlayers = Object.values(this.players).filter(p => p.isAlive);
                if (alivePlayers.length === 1) {
                    console.log(`Player ${alivePlayers[0].nickname} has scored.`);
                    alivePlayers[0].score++;
                }

                this.startNewRound()
            }
        });
    }

    listenToNewRound(socket) {
        socket.on('new-game', () => {
            Object.values(this.players).forEach(player => {
                player.score = 0
            });
            this.startNewRound();
        });
    }

    startNewRound() {
        if (Object.values(this.players).filter(p => p.isAlive).length < 2) {
            Object.values(this.players).forEach(p => p.isAlive = true);
        }
        this.ball.location = [400, 400];
        this.resetPlayersPositions();
        const randomAngle = Math.random() * 2 * Math.PI;
        this.ball.velocity = [3 * Math.cos(randomAngle), 3 * Math.sin(randomAngle), 0.0];
        this.roundId = Math.floor(Math.random() * 100000);
        this.gameRoom.emit('new-round', {players: Object.values(this.players), ball: this.ball, roundId: this.roundId});
    }

    listenToJoin(socket) {
        socket.on('join', msg => {
            if (this.players[msg.id] != null) {
                return;
            }
            let randomColor = [Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2, Math.random() * 0.8 + 0.2, 1.0];
            this.players[msg.id] = buildPlayer(msg.id, [], 500, randomColor, msg.nickname, 0, false);
            this.gameRoom.emit('players-sync', this.players);
            console.log(`Player ${msg.nickname}(${msg.id}) joined game ${this.id} (${Object.keys(this.players).length} players)`);
        });
    }

    listenToDisconnect(io, socket) {
        socket.on('disconnect', () => {
            delete this.players[socket.conn.id];
            console.log(`Player ${socket.conn.id} disconnected from game ${this.id}`);
        });
    }
}

const buildPlayer = (id, location, range, color, nickname, angle, isHost) => {
    return {id, score: 0, location, range, angle, color, nickname, isHost, direction: 0, isAlive: false};
};

const gamePositions = {
    0: [],
    1: [{location: [100.0, 400.0, 0.0], range: 700, angle: 0, isHost: true}],
    2: [{location: [100.0, 400.0, 0.0], range: 700, angle: 0, isHost: true},
        {location: [700.0, 400.0, 0.0], range: 700, angle: Math.PI, isHost: false}],
    3: [{location: [400.0, 600.0, 0.0], range: 600, angle: -Math.PI / 2, isHost: true},
        {location: [250.0, 300.0, 0.0], range: 600, angle: Math.PI / 6, isHost: false},
        {location: [550.0, 300.0, 0.0], range: 600, angle: Math.PI * 5 / 6, isHost: false}],
    4: [{location: [100.0, 400.0, 0.0], range: 700, angle: 0, isHost: true},
        {location: [700.0, 400.0, 0.0], range: 700, angle: Math.PI, isHost: false},
        {location: [400.0, 100.0, 0.0], range: 700, angle: Math.PI / 2, isHost: false},
        {location: [400.0, 700.0, 0.0], range: 700, angle: -Math.PI / 2, isHost: false}]
};


module.exports.Game = Game;
