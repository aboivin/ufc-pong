const currentlyPressedKeys = {};
const keyBinding = {};

const handleKeyDown = (event) => {
    currentlyPressedKeys[event.keyCode] = true;
};

const handleKeyUp = (event) => {
    currentlyPressedKeys[event.keyCode] = false;
};

const handleKeyPress = () => {
    for(let [keyCode, handler] of Object.entries(keyBinding)) {
        if (currentlyPressedKeys[keyCode]) {
            handler();
        }
    }
};

const initKeyBinding = (players) => {
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;

    keyBinding[87] = () => players[0].translatePlayer(1);
    keyBinding[83] = () => players[0].translatePlayer(-1);
    keyBinding[38] = () => players[1].translatePlayer(-1);
    keyBinding[40] = () => players[1].translatePlayer(1);
};
