class Player {
    constructor(id, startLocation, angle, color, nickname, range, score, isHost, isAlive) {
        this.id = id;
        this.startLocation = [...startLocation];
        this.location = [...startLocation];
        this.range = range;
        this.width = 20;
        this.height = 100;
        this.color = color;
        this.nickname = nickname;
        this.velocity = 10.0;
        this.direction90Vector = vec2.rotate(vec3.fromValues(0, 0, 0), [0, 1], [0, 0], angle);
        this.direction = directions.PAUSE;
        this.angle = angle;
        this.drawingMode = gl.TRIANGLE_STRIP;
        this.score = score;
        this.isHost = isHost;
        this.isAlive = isAlive;
        this.lastUpdate = new Date().getTime();

        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(Object.create(startLocation)));

        this.computeVertices = () => [
            ...(rotated([-this.width / 2, this.height / 2], angle)),
            ...(rotated([this.width / 2, this.height / 2], angle)),
            ...(rotated([-this.width / 2, -this.height / 2], angle)),
            ...(rotated([this.width / 2, -this.height / 2], angle))];

        this.move = () => {
            const time = new Date().getTime();
            if (this.direction !== 0) {
                const newDir = vec3.scale(vec3.create(), this.direction90Vector, (time - this.lastUpdate) * 0.08 * this.velocity * this.direction);
                mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(newDir));
                vec3.add(this.location, this.location, newDir);
            }
            this.lastUpdate = time;
        };

        this.translateTo = (pos) => {
            mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip([pos[0] - this.location[0], pos[1] - this.location[1], 0]));
            this.location = [...pos];
            this.lastUpdate = new Date().getTime();
        }
    }
}

const rotated = (vertex, angle) => {
    return vec2.rotate(vec2.create(), vertex, [0, 0], angle);
};

const directions = {
    PAUSE: 0,
    FORWARD: 1,
    BACKWARD: -1,
};
