tm.define("glb.PlaneGeometry", {
    superClass: "glb.Geometry",
    
    vertex: null,
    uv: null,
    index: null,

    init: function(size, frameCountH, frameCountV) {
        this.superInit();

        size = size || 32;
        frameCountH = frameCountH || 1;
        frameCountV = frameCountV || 1;

        this.vertexData = new Float32Array([
            -size * 0.5, -size * 0.5, 0,
             size * 0.5, -size * 0.5, 0,
            -size * 0.5,  size * 0.5, 0,
             size * 0.5,  size * 0.5, 0,
        ]);
        this.uvData = new Float32Array([
            0,               1 / frameCountV,
            1 / frameCountH, 1 / frameCountV,
            0,               0,
            1 / frameCountH, 0,
        ]);
        this.indexData = new Int16Array([0, 1, 2, 1, 3, 2]);
    },
    
    initialize: function(glContext) {
        var gl = glContext.gl;
        this.vertex = this.createVbo(gl, this.vertexData);
        this.uv = this.createVbo(gl, this.uvData);
        this.index = this.createIbo(gl, this.indexData);
    },
    
});
