(function() {

  phina.define("glb.Matrix4", {

    array: null,

    init: function() {
      this.array = mat4.create();
    },

    copy: function(m) {
      mat4.copy(this.array, m.array);
      return this;
    },

    clone: function() {
      var result = glb.Matrix4();
      result.array = mat4.clone(this.array);
      return result;
    },

    identity: function() {
      mat4.identity(this.array);
      return this;
    },

    transpose: function() {
      mat4.transpose(this.array, this.array);
      return this;
    },

    invert: function() {
      mat4.invert(this.array, this.array);
      return this;
    },

    adjoint: function() {
      mat4.adjoint(this.array, this.array);
      return this;
    },

    determinant: function() {
      return mat4.determinant(this.array);
    },

    mul: function(m) {
      mat4.multiply(this.array, this.array, m.array);
      return this;
    },
    preMul: function(m) {
      mat4.multiply(this.array, m.array, this.array);
      return this;
    },

    translate: function(v) {
      mat4.translate(this.array, this.array, v.array);
      return this;
    },

    scale: function(v) {
      mat4.scale(this.array, this.array, v.array);
      return this;
    },

    rotate: function(rad, axis) {
      mat4.rotate(this.array, this.array, rad, axis.array);
      return this;
    },

    rotateX: function(rad) {
      mat4.rotateX(this.array, this.array, rad);
      return this;
    },
    rotateY: function(rad) {
      mat4.rotateY(this.array, this.array, rad);
      return this;
    },
    rotateZ: function(rad) {
      mat4.rotateZ(this.array, this.array, rad);
      return this;
    },

    fromTranslation: function(v) {
      mat4.fromTranslation(this.array, v.array);
      return this;
    },

    fromScaling: function(v) {
      mat4.fromScaling(this.array, v.array);
      return this;
    },

    fromRotation: function(rad, axis) {
      mat4.fromRotation(this.array, rad, axis.array);
      return this;
    },

    fromXRotation: function(rad) {
      mat4.fromXRotation(this.array, rad);
      return this;
    },
    fromYRotation: function(rad) {
      mat4.fromYRotation(this.array, rad);
      return this;
    },
    fromZRotation: function(rad) {
      mat4.fromZRotation(this.array, rad);
      return this;
    },

    fromRotationTranslation: function(q, v) {
      mat4.fromRotationTranslation(this.array, q.array, v.array);
      return this;
    },

    fromRotationTranslationScale: function(q, v, s) {
      mat4.fromRotationTranslationScale(this.array, q.array, v.array, s.array);
      return this;
    },

    fromRotationTranslationScaleOrigin: function(q, v, s, o) {
      mat4.fromRotationTranslationScaleOrigin(this.array, q.array, v.array, s.array, o.array);
      return this;
    },

    fromQuat: function(q) {
      mat4.fromQuat(this.array, q.array);
      return this;
    },

    frustum: function(left, right, bottom, top, near, far) {
      mat4.frustum(this.array, left, right, bottom, top, near, far);
      return this;
    },

    perspective: function(fovy, aspect, near, far) {
      mat4.perspective(this.array, fovy, aspect, near, far);
      return this;
    },

    perspectiveFromFieldOfView: function(fov, near, far) {
      mat4.perspectiveFromFieldOfView(this.array, fov, near, far);
      return this;
    },

    ortho: function(left, right, bottom, top, near, far) {
      mat4.ortho(this.array, left, right, bottom, top, near, far);
      return this;
    },

    lookAt: function(eye, center, up) {
      mat4.lookAt(this.array, eye.array, center.array, up.array);
      return this;
    },

    viewport: function(w, h) {
      this.identity();
      this.array[0] = w * 0.5;
      this.array[5] = h * -0.5;
      this.array[12] = w * 0.5;
      this.array[13] = h * 0.5;
      return this;
    },

    _accessor: {
      "typedArray": {
        get: function() {
          return this.array;
        },
        set: function(v) {
          this.array = v
        },
      }
    }
  });

  glb.Matrix4.mul = function(a, b) {
    var result = glb.Matrix4();
    mat4.mul(result.array, a.array, b.array);
    return result;
  };

})();
