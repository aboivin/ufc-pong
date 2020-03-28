class Ball {

    constructor(locStart, color) {
        this.location = Object.create(locStart);
        this.width = 20;
        this.height = 20;
        this.velocity = [-1.0, -1.0, 0.0];
        this.mvMatrix = mat4.create();
        this.color = color;

        mat4.identity(this.mvMatrix);
        mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(Object.create(locStart)));

        this.vertices = [
            -10.0, 10.0,
            10.0, 10.0,
            -10.0, -10.0,
            10.0, -10.0
        ];

        this.translate = () => {
            mat4.translate(this.mvMatrix, this.mvMatrix, normalToClip(Object.create(this.velocity)));
            vec3.add(this.location, this.location, this.velocity);
        }
    }
}
