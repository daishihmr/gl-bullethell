(function() {

  phina.define("glb.Mesh", {
    superClass: "glb.Object3D",

    mMatrix: null,
    invMatrix: null,
    uvTranslate: null,

    position: null,
    rotation: null,
    scale: null,

    geometry: null,
    material: null,

    visible: true,

    needsUpdate: false,

    init: function(geometry, material) {
      this.superInit();

      this.mMatrix = glb.Matrix4();
      this.invMatrix = glb.Matrix4();
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
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.x;
        },
      });
      this.accessor("y", {
        set: function(v) {
          this.position.y = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.y;
        },
      });
      this.accessor("z", {
        set: function(v) {
          this.position.z = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.z;
        },
      });
      this.accessor("scaleX", {
        set: function(v) {
          this.scale.x = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.scale.x;
        },
      });
      this.accessor("scaleY", {
        set: function(v) {
          this.scale.y = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.scale.y;
        },
      });
      this.accessor("scaleZ", {
        set: function(v) {
          this.scale.z = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.scale.z;
        },
      });
    },

    build: function(glContext) {
      var gl = glContext.gl;
      var ext = glContext.ext;

      this.geometry.build(glContext);
      this.material.build(glContext);

      if (ext !== null) {
        this.material.setVao(glContext);
        this.material.setAttributes(glContext, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
        this.material.unsetVao(glContext);
      }
    },

    updateMatrix: function() {
      this.mMatrix.fromRotationTranslationScale(this.rotation, this.position, this.scale);
      this.needsUpdate = false;
      return this;
    },

    render: function(glContext, vpMatrix, light) {
      var gl = glContext.gl;
      var ext = glContext.ext;

      this.updateMatrix();

      this.material.setProgram(glContext);

      if (ext !== null) {
        this.material.setVao(glContext);
      } else {
        this.material.setAttributes(glContext, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
      }
      this.material.setTextures(glContext);

      this.material.setUniforms(glContext, this);
      this.material.setUniform(glContext, "vpMatrix", vpMatrix);
      if (this.material.uniforms.invMatrix) {
        mat4.invert(this.invMatrix.array, glb.Matrix4.mul(vpMatrix, this.mMatrix).array);
        this.material.setUniform(glContext, "invMatrix", this.invMatrix);
      }
      if (light) {
        this.material.setUniform(glContext, "lightDirection", light.lightDirection);
        this.material.setUniform(glContext, "lightColor", light.lightColor);
        this.material.setUniform(glContext, "ambientColor", light.ambientColor);
      }

      this.material.draw(glContext, this.geometry.indexData.length);

      if (ext !== null) this.material.unsetVao(glContext);
    },

    setPosition: function(x, y, z) {
      this.position.set(x, y, z);
      this.needsUpdate = true;
      return this;
    },

    setScale: function(x, y, z) {
      if (arguments.length === 1) {
        y = x;
        z = x;
      }
      this.scale.set(x, y, z);
      this.needsUpdate = true;
      return this;
    },

    setRotationX: function(rad) {
      this.rotation.setAxisAngle(glb.Vector3.X, rad);
      this.needsUpdate = true;
      return this;
    },

    setRotationY: function(rad) {
      this.rotation.setAxisAngle(glb.Vector3.Y, rad);
      this.needsUpdate = true;
      return this;
    },

    setRotationZ: function(rad) {
      this.rotation.setAxisAngle(glb.Vector3.Z, rad);
      this.needsUpdate = true;
      return this;
    },

    translate: function(x, y, z) {
      this.position.x += x;
      this.position.y += y;
      this.position.z += z;
      this.needsUpdate = true;
      return this;
    },

    scale: function(x, y, z) {
      if (arguments.length === 1) {
        y = x;
        z = x;
      }
      this.scale.x *= x;
      this.scale.y *= y;
      this.scale.z *= z;
      this.needsUpdate = true;
      return this;
    },

    rotateX: function(rad) {
      this.rotation.rotateX(rad);
      this.needsUpdate = true;
      return this;
    },
    rotateY: function(rad) {
      this.rotation.rotateY(rad);
      this.needsUpdate = true;
      return this;
    },
    rotateZ: function(rad) {
      this.rotation.rotateZ(rad);
      this.needsUpdate = true;
      return this;
    },
  });
})();
