tm.define("glb.Geometry", {
    init: function() {},

    initialize: function(glContext) {},
    
    bufferUsage: 0,

    createVbo: function(gl, data) {
        var usage = [gl.STATIC_DRAW, gl.DYNAMIC_DRAW][this.bufferUsage];
        
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

    transfarVbo: function(gl, vbo, data) {
        var usage = [gl.STATIC_DRAW, gl.DYNAMIC_DRAW][this.bufferUsage];

        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

    createIbo: function(gl, data) {
        var usage = [gl.STATIC_DRAW, gl.DYNAMIC_DRAW][this.bufferUsage];

        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    },
});
