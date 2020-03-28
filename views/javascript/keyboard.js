const handleKeyDown = (players, id, event) => {
    const player = players[id];
    if(player == null) {
        return;
    }

    if (event.code === 'ArrowUp' && player.direction !== directions.BACKWARD ||
        event.code === 'ArrowDown' && player.direction !== directions.FORWARD) {
        player.direction = (event.ctrlKey || event.metaKey ? 3 : 1) * (event.code === 'ArrowUp' ? directions.BACKWARD : directions.FORWARD);
        wsEmitMove(player, player.direction);
    }
};

const handleKeyUp = (players, id, event) => {
    const player = players[id];
    if(player == null) {
        return;
    }

    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        player.direction = directions.PAUSE;
        wsEmitMove(player, player.direction);
    }
};

const initKeyBinding = (players, id) => {
    document.onkeydown = (event) => handleKeyDown(players, id, event);
    document.onkeyup = (event) => handleKeyUp(players, id, event);
};
