tm.define("glb.PerspectiveCamera", {
    superClass: "glb.Camera",

    init: function(fovy, aspect, near, far) {
        this.fovy = fovy;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.superInit();
    },

    _setupProjectionMatrix: function() {
        return glb.Matrix4().perspective(
            this.fovy,
            this.aspect,
            this.near,
            this.far
        );
    },

});
