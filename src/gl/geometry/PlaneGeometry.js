tm.define("glb.PlaneGeometry", {
    superClass: "glb.Geometry",
    
    position: null,
    uv: null,
    index: null,

    init: function(size, frameCountH, frameCountV) {
        this.superInit();

        size = size || 32;
        frameCountH = frameCountH || 1;
        frameCountV = frameCountV || 1;

        this.positionData = new Float32Array([
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
    
    build: function(glContext) {
        var gl = glContext.gl;
        this.position = this.createVbo(gl, this.positionData);
        this.uv = this.createVbo(gl, this.uvData);
        this.index = this.createIbo(gl, this.indexData);
    },
    
});
