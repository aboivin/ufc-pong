let shaderProgram;
let resolution;

const initGL = (canvas) => {
    let gl;
    try {
        gl = canvas.getContext("webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        resolution = [canvas.width, canvas.height, 1.0];
    } catch (e) {
    }
    if (!gl) {
        console.log("Could not initialize WebGL.");
    }

    return gl;
};

const vertexShaderSource = `
  uniform vec2 uResolution;
  attribute vec2 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uMVMatrix;

  varying vec4 vColor;

  void main(void) {
    // Convert the rectangle from pixels to 0.0 to 1.0
    vec2 zeroToOne = aVertexPosition / uResolution;
    // Convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;
    // Convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
    gl_Position = uMVMatrix * vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
    vColor = aVertexColor;
  }
`;

const fragmentShaderSource = `
   precision mediump float;

   varying vec4 vColor;

   void main(void) {
    gl_FragColor = vColor;
   }
  `;

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

const initShaders = (gl) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialize shaders");
    }

    gl.useProgram(shaderProgram);
    shaderProgram.resolutionUniform = gl.getUniformLocation(shaderProgram, "uResolution");
    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
};

