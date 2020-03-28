const drawingMVMatrices = [];
const drawingVertexBuffers = [];
const drawingColorBuffers = [];
const drawingMode = [];

const initBuffers = (object) => {
    object.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
    const vertices = object.computeVertices();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    object.vertexBuffer.itemSize = 2;
    object.vertexBuffer.numItems = vertices.length / 2;

    object.colors = [];
    for (let i = 0; i < vertices.length / 2; i++) {
        object.colors = object.colors.concat(object.color);
    }
    object.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, object.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(object.colors), gl.STATIC_DRAW);
    object.colorBuffer.itemSize = 4;
    object.colorBuffer.numItems = vertices.length / 2;

    drawingMVMatrices.push(object.mvMatrix);
    drawingVertexBuffers.push(object.vertexBuffer);
    drawingColorBuffers.push(object.colorBuffer);
    drawingMode.push(object.drawingMode);
};

const refillBuffers = (object) => {
    drawingMVMatrices.push(object.mvMatrix);
    drawingVertexBuffers.push(object.vertexBuffer);
    drawingColorBuffers.push(object.colorBuffer);
    drawingMode.push(object.drawingMode);
};

const setMatrixUniforms = (mvMatrix) => {
    gl.uniform2f(shaderProgram.resolutionUniform, canvas.width, canvas.height);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
};

const drawScene = () => {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let vertexBuffer;
    let colorBuffer;
    let mode;
    for (let i = drawingVertexBuffers.length; i > 0; i--) {
        let mvMatrix = drawingMVMatrices.pop();
        vertexBuffer = drawingVertexBuffers.pop();
        colorBuffer = drawingColorBuffers.pop();
        mode = drawingMode.pop();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, colorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        setMatrixUniforms(mvMatrix);
        gl.drawArrays(mode, 0, mode === gl.TRIANGLE_FAN ? 101 : 4);
    }
};
