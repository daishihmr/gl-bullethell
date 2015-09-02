(function() {

    tm.define("glb.Mesh", {
        superClass: "glb.Object3D",

        mMatrix: null,
        vpMatrix: null,
        uvTranslate: null,

        position: null,
        rotation: null,
        scale: null,

        geometry: null,
        material: null,

        init: function(geometry, material) {
            this.superInit();

            this.mMatrix = mat4.create();
            this.uvTranslate = vec2.create();

            this.position = vec3.create();
            this.rotation = quat.create();
            this.scale = vec3.set(vec3.create(), 1, 1, 1);

            this.geometry = geometry;
            this.material = material;

            this.updateMatrix();

            this._defineAccessors();
        },

        _defineAccessors: function() {
            this.accessor("x", {
                set: function(v) {
                    this.position[0] = v;
                },
                get: function() {
                    return this.position[0];
                },
            });
            this.accessor("y", {
                set: function(v) {
                    this.position[1] = v;
                },
                get: function() {
                    return this.position[1];
                },
            });
            this.accessor("z", {
                set: function(v) {
                    this.position[2] = v;
                },
                get: function() {
                    return this.position[2];
                },
            });
            this.accessor("scaleX", {
                set: function(v) {
                    this.scale[0] = v;
                },
                get: function() {
                    return this.scale[0];
                },
            });
            this.accessor("scaleY", {
                set: function(v) {
                    this.scale[1] = v;
                },
                get: function() {
                    return this.scale[1];
                },
            });
            this.accessor("scaleZ", {
                set: function(v) {
                    this.scale[2] = v;
                },
                get: function() {
                    return this.scale[2];
                },
            });
        },

        initialize: function(glContext) {
            this.geometry.initialize(glContext);
            this.material.initialize(glContext);
        },

        updateMatrix: function() {
            mat4.fromRotationTranslationScale(this.mMatrix, this.rotation, this.position, this.scale);
            return this;
        },

        render: function(glContext, vpMatrix) {
            var gl = glContext.gl;
            
            this.updateMatrix();

            this.material.setProgram(glContext);
            this.material.setAttributes(glContext, this.geometry);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);

            this.material.setUniforms(glContext, this);
            this.material.setUniform(glContext, "vpMatrix", vpMatrix);
            
            this.material.draw(glContext, this.geometry.indexData.length);
        },

        setPosition: function(x, y, z) {
            vec3.set(this.position, x, y, z);
            return this;
        },

        setScale: function(x, y, z) {
            if (arguments.length === 1) {
                y = x;
                z = x;
            }
            vec3.set(this.scale, x, y, z);
            return this;
        },

        setRotationX: function(rad) {
            quat.setAxisAngle(this.rotation, glb.Vec3.X, rad);
            return this;
        },

        setRotationY: function(rad) {
            quat.setAxisAngle(this.rotation, glb.Vec3.Y, rad);
            return this;
        },

        setRotationZ: function(rad) {
            quat.setAxisAngle(this.rotation, glb.Vec3.Z, rad);
            return this;
        },

        translate: function(x, y, z) {
            this.position[0] += x;
            this.position[1] += y;
            this.position[2] += z;
            return this;
        },

        scale: function(x, y, z) {
            if (arguments.length === 1) {
                y = x;
                z = x;
            }
            this.scale[0] *= x;
            this.scale[1] *= y;
            this.scale[2] *= z;
            return this;
        },

        rotateX: function(rad) {
            quat.rotateX(this.rotation, this.rotation, rad);
            return this;
        },
        rotateY: function(rad) {
            quat.rotateY(this.rotation, this.rotation, rad);
            return this;
        },
        rotateZ: function(rad) {
            quat.rotateZ(this.rotation, this.rotation, rad);
            return this;
        },
    });
})();
