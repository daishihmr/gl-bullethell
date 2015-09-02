tm.define("glb.BoxGeometry", {
    
    vertex: null,
    uv: null,
    index: null,

    init: function(w, h, d) {
        w = w || 1;
        h = h || w;
        d = d || w;
        
        w *= 0.5;
        h *= 0.5;
        d *= 0.5;

        this.vertexData = new Float32Array([
            -w,  h, -d,
             w,  h, -d,
            -w,  h,  d,
             w,  h,  d,
            -w, -h, -d,
             w, -h, -d,
            -w, -h,  d,
             w, -h,  d,
        ]);
        this.uvData = new Float32Array([
            0, 1,
            1, 1,
            0, 0,
            1, 0,
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ]);
        this.indexData = new Int16Array([
            0, 4, 6,
            0, 6, 2,

            0, 2, 3,
            0, 3, 1,

            3, 7, 5,
            3, 5, 1,

            2, 6, 7,
            2, 7, 3,

            6, 4, 5,
            6, 5, 7,

            1, 5, 4,
            1, 4, 0,
        ]);
    },
    
    initialize: function(glContext) {
        this.vertex = glContext.createVbo(this.vertexData);
        this.uv = glContext.createVbo(this.uvData);
        this.index = glContext.createIbo(this.indexData);
    },
    
});
