tm.define("glb.Program", {
    init: function(gl, program) {
        this.gl = gl;
        this.program = program;
    },
    
    getAttributeLocation: function(name) {
        var loc = this.gl.getAttribLocation(this.program, name);
        this.gl.enableVertexAttribArray(loc);
        return loc;
    }
});
