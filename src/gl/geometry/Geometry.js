tm.define("glb.Geometry", {
    init: function() {},

    build: function(glContext) {},

    createVbo: function(gl, data, usage) {
        usage = usage || GL.STATIC_DRAW;

        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

    transfarVbo: function(gl, vbo, data, offset, usage) {
        offset = offset || 0;
        usage = usage || GL.STATIC_DRAW;

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

    createIbo: function(gl, data, usage) {
        usage = usage || GL.STATIC_DRAW;

        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    },
});
