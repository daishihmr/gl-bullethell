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

            this.mMatrix = glb.Matrix4();
            this.uvTranslate = glb.Vector2();

            this.position = glb.Vector3();
            this.rotation = glb.Quat();
            this.scale = glb.Vector3(1, 1, 1);

            this.geometry = geometry;
            this.material = material;

            this.updateMatrix();

            this._defineAccessors();
        },
        
        setGeometry: function(geometry) {
            this.geometry = geometry;
            return this;
        },
        getMaterial: function(material) {
            this.material = material;
            return this;
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
            this.accessor("scaleX", {
                set: function(v) {
                    this.scale.x = v;
                },
                get: function() {
                    return this.scale.x;
                },
            });
            this.accessor("scaleY", {
                set: function(v) {
                    this.scale.y = v;
                },
                get: function() {
                    return this.scale.y;
                },
            });
            this.accessor("scaleZ", {
                set: function(v) {
                    this.scale.z = v;
                },
                get: function() {
                    return this.scale.z;
                },
            });
        },

        initialize: function(glContext) {
            this.geometry.initialize(glContext);
            this.material.initialize(glContext);
        },

        updateMatrix: function() {
            this.mMatrix.fromRotationTranslationScale(this.rotation, this.position, this.scale);
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
            this.position.set(x, y, z);
            return this;
        },

        setScale: function(x, y, z) {
            if (arguments.length === 1) {
                y = x;
                z = x;
            }
            this.scale.set(x, y, z);
            return this;
        },

        setRotationX: function(rad) {
            this.rotation.setAxisAngle(glb.Vector3.X, rad);
            return this;
        },

        setRotationY: function(rad) {
            this.rotation.setAxisAngle(glb.Vector3.Y, rad);
            return this;
        },

        setRotationZ: function(rad) {
            this.rotation.setAxisAngle(glb.Vector3.Z, rad);
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
            this.rotation.rotateX(rad);
            return this;
        },
        rotateY: function(rad) {
            this.rotation.rotateY(rad);
            return this;
        },
        rotateZ: function(rad) {
            this.rotation.rotateZ(rad);
            return this;
        },
    });
})();
