(function() {

    tm.define("glb.Camera", {

        position: null,
        target: null,
        up: null,
        vMatrix: null,
        pMatrix: null,
        vpMatrix: null,

        init: function() {
            this.position = vec3.set(vec3.create(), 0, 0, SCREEN_WIDTH * 0.5);
            this.target = vec3.create();
            this.up = vec3.set(vec3.create(), 0, 1, 0);
            this.vMatrix = mat4.create();
            this.pMatrix = mat4.perspective(mat4.create(), 45, SCREEN_WIDTH / SCREEN_HEIGHT, 0.1, 1000);
            // this.pMatrix = mat4.ortho (mat4.create(),
            //     SCREEN_WIDTH * -0.5,
            //     SCREEN_WIDTH * 0.5,
            //     SCREEN_HEIGHT * -0.5,
            //     SCREEN_HEIGHT * 0.5,
            //     0.1,
            //     1000
            // );
            this.vpMatrix = mat4.create();

            this.updateMatrix();

            this._defineAccessors();
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
            return mat4.multiply(this.vpMatrix, this.pMatrix, this.vMatrix);
        },

        updateMatrix: function() {
            mat4.lookAt(this.vMatrix, this.position, this.target, this.up);
        },

    });

})();
