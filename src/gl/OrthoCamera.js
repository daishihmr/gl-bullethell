tm.define("glb.OrthoCamera", {
    superClass: "glb.Camera",

    init: function() {
        this.superInit();
    },

    _setupProjectionMatrix: function() {
        return glb.Matrix4().ortho(
            SCREEN_WIDTH * -0.5,
            SCREEN_WIDTH * 0.5,
            SCREEN_HEIGHT * -0.5,
            SCREEN_HEIGHT * 0.5,
            100,
            10000
        );
    },

});
