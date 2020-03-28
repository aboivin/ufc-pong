class Ball {

    constructor(locStart, color) {
        this.location = Object.create(locStart);
        this.radius = 10;
        this.velocity = [0.0, 0.0, 0.0];
        this.mvMatrix = mat4.create();
        this.color = color;
        this.drawingMode = gl.TRIANGLE_FAN;
        this.lastUpdate = new Date().getTime();

        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(Object.create(locStart)));

        this.computeVertices = () => {
            const vertices = [0, 0];

            const ballEdges = 100;
            for (let i = 0; i <= ballEdges; i++) {
                vertices.push(Math.cos(i * 2 * Math.PI / ballEdges) * this.radius);
                vertices.push(Math.sin(i * 2 * Math.PI / ballEdges) * this.radius);
            }
            return vertices;
        };

        this.move = () => {
            const time = new Date().getTime();
            const newDir = vec3.scale(vec3.create(), this.velocity, (time - this.lastUpdate) * 0.08);
            mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(newDir));
            vec3.add(this.location, this.location, newDir);
            this.lastUpdate = time;
        };

        this.translateTo = (pos) => {
            mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip([pos[0] - this.location[0], pos[1] - this.location[1], 0]));
            this.location = [...pos];
            this.lastUpdate = new Date().getTime();
        }
    }
}
