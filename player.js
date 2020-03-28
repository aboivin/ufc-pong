class Player {
    constructor(locStart, color) {
        this.location = Object.create(locStart);
        this.width = 20;
        this.height = 100;
        this.color = color;
        this.velocity = 6.0;

        this.mvMatrix = mat4.create();
        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(Object.create(locStart)));

        this.vertices = [
            -10.0, 50.0,
            10.0, 50.0,
            -10.0, -50.0,
            10.0, -50.0
        ];

        this.translatePlayer = (direction) => {
            mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip([0.0, this.velocity * direction, 0.0]));
            vec3.add(this.location, this.location, [0.0, this.velocity * direction, 0.0]);
        }
    }
}
