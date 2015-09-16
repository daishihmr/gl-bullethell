phina.namespace(function() {

  phina.define("glb.Mesh", {
    superClass: "glb.Object3D",

    localMatrix: null,
    worldMatrix: null,
    invMatrix: null,
    uvTranslate: null,

    /** @type {glb.Vector3} */
    position: null,
    /** @type {glb.Quat} */
    rotation: null,
    /** @type {glb.Vector3} */
    scale: null,

    geometry: null,
    material: null,

    visible: true,

    needsUpdate: false,

    init: function(geometry, material) {
      this.superInit();

      this.localMatrix = glb.Matrix4();
      this.worldMatrix = glb.Matrix4();
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

    build: function(glLayer) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      this.geometry.build(glLayer);
      this.material.build(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
        this.material.setAttributes(glLayer, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
        this.material.unsetVao(glLayer);
      }
    },

    updateMatrix: function() {
      this.localMatrix.fromRotationTranslationScale(this.rotation, this.position, this.scale);
      this.needsUpdate = false;
      return this;
    },

    render: function(glLayer, vpMatrix, light) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      this.updateMatrix();

      // ワールド行列を計算
      // TODO 計算回数を減らす
      this.worldMatrix.identity();
      var p = this;
      while (p) {
        if (p.localMatrix) {
          this.worldMatrix.preMul(p.localMatrix);
        }
        p = p.parent;
      }

      this.material.setProgram(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
      } else {
        this.material.setAttributes(glLayer, this.geometry);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
      }
      this.material.setTextures(glLayer);

      if (this.material.uniforms.invMatrix) {
        mat4.invert(this.invMatrix.array, glb.Matrix4.mul(vpMatrix, this.worldMatrix).array);
        this.material.setUniform(glLayer, "invMatrix", this.invMatrix);
      }
      this.material.setUniforms(glLayer, this);
      this.material.setUniform(glLayer, "vpMatrix", vpMatrix);

      if (light) {
        this.material.setUniform(glLayer, "lightDirection", light.lightDirection);
        this.material.setUniform(glLayer, "lightColor", light.lightColor);
        this.material.setUniform(glLayer, "ambientColor", light.ambientColor);
      }

      this.material.draw(glLayer, this.geometry.indexData.length);

      if (ext !== null) this.material.unsetVao(glLayer);
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

    translateX: function(distance) {
      vec3.set(tempV3, distance, 0, 0);
      vec3.transformQuat(tempV3, tempV3, this.rotation.array);
      return this.translate(tempV3[0], tempV3[1], tempV3[2]);
    },
    translateY: function(distance) {
      vec3.set(tempV3, 0, distance, 0);
      vec3.transformQuat(tempV3, tempV3, this.rotation.array);
      return this.translate(tempV3[0], tempV3[1], tempV3[2]);
    },
    translateZ: function(distance) {
      vec3.set(tempV3, 0, 0, distance);
      vec3.transformQuat(tempV3, tempV3, this.rotation.array);
      return this.translate(tempV3[0], tempV3[1], tempV3[2]);
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

  var tempV3 = vec3.create();

});
