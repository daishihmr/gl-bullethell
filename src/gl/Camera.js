(function() {

    tm.define("glb.Camera", {

        position: null,
        target: null,
        up: null,
        vMatrix: null,
        pMatrix: null,
        vpMatrix: null,

        init: function() {
            this.position = glb.Vector3(0, 0, SCREEN_HEIGHT*0.5 / Math.tan(0.78 * 0.5));
            this.target = glb.Vector3();
            this.up = glb.Vector3(0, 1, 0);
            this.vMatrix = glb.Matrix4();
            this.pMatrix = this._setupProjectionMatrix();
            this.vpMatrix = glb.Matrix4();

            this.updateMatrix();

            this._defineAccessors();
        },
        
        _setupProjectionMatrix: function() {
            return glb.Matrix4().perspective(0.78, SCREEN_WIDTH / SCREEN_HEIGHT, 100, 10000);
        },

        _defineAccessors: function() {
            this.accessor("x", {
                set: function(v) {
                    this.position.x = v;
                },
                get: function() {
                    return this.position.x;
                },
            });
            this.accessor("y", {
                set: function(v) {
                    this.position.y = v;
                },
                get: function() {
                    return this.position.y;
                },
            });
            this.accessor("z", {
                set: function(v) {
                    this.position.z = v;
                },
                get: function() {
                    return this.position.z;
                },
            });
        },

        setPosition: function(x, y, z) {
            this.position.set(x, y, z);
            this.updateMatrix();
        },

        calcVpMatrix: function() {
            this.vpMatrix = glb.Matrix4.mul(this.pMatrix, this.vMatrix);
            return this.vpMatrix;
        },

        updateMatrix: function() {
            this.vMatrix.lookAt(this.position, this.target, this.up);
        },

    });

})();
