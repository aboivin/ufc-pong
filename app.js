'use strict';

const {Game} = require('./game');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const fs = require('fs');
const uglify = require("uglify-es");

const games = {};

app.get('/', function (req, res) {
    const gameId = Math.floor(Math.random() * 100000);
    res.redirect('/games/' + gameId);
});

app.get('/games', function (req, res) {
    res.send(JSON.stringify(games));
});

app.get('/games/:id', function (req, res) {
    const gameId = req.params.id;
    if (games[gameId] == null) {
        games[gameId] = new Game(gameId, io);
    }
    res.render('index.ejs', {gameId: gameId});
});

const jsOrderedFiles = ['webgl-utils.js', 'player.js', 'ball.js', 'keyboard.js', 'collision.js',
    'webgl-setup.js', 'drawing.js', 'websocket-triggers.js', 'websocket-handlers.js', 'pong.js'];
let files = jsOrderedFiles.map(fileName => 'views/javascript/' + fileName)
    .reduce((res, fileName) => ({...res, [fileName]: fs.readFileSync(fileName, "utf8")}), {});
const options = { compress: true,
    mangle: {
        reserved: ['socket']
    }
};
const uglified = uglify.minify(files, options);
fs.writeFile('./static/ufc-pong.min.js', uglified.code, (err) =>
    console.log(err ? err : "Script generated and saved:", 'ufc-pong.min.js'));

app.use('/static', express.static('static'));

if (module === require.main) {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
        console.log('Press Ctrl+C to quit.');
    });
}
