(function() {

  phina.define("glb.Matrix3", {

    array: null,

    init: function() {
      this.array = mat3.create();
    },

    fromMat4: function(m) {
      mat3.fromMat4(this.array, m.array);
      return this;
    },

    clone: function() {
      var result = glb.Matrix3();
      result.array = mat3.clone(this.array);
      return result;
    },

    identity: function() {
      mat3.identity(this.array);
      return this;
    },

    transpose: function() {
      mat3.transpose(this.array, this.array);
      return this;
    },

    invert: function() {
      mat3.invert(this.array, this.array);
      return this;
    },

    adjoint: function() {
      mat3.adjoint(this.array, this.array);
      return this;
    },

    determinant: function() {
      return mat3.determinant(this.array);
    },

    mul: function(m) {
      mat3.multiply(this.array, this.array, m.array);
      return this;
    },

    translate: function(v) {
      mat3.translate(this.array, this.array, v.array);
      return this;
    },

    scale: function(v) {
      mat3.scale(this.array, this.array, v.array);
      return this;
    },

    rotate: function(rad, axis) {
      mat3.rotate(this.array, this.array, rad, axis.array);
      return this;
    },

    fromTranslation: function(v) {
      mat3.fromTranslation(this.array, v.array);
    },

    fromRotation: function(rad) {
      mat3.fromRotation(this.array, rad);
      return this;
    },

    fromScaling: function(v) {
      mat3.fromScaling(this.array, v.array);
      return this;
    },

    fromQuat: function(q) {
      mat3.fromQuat(this.array, q.array);
      return this;
    },

    normalFromMat4: function(m) {
      mat3.normalFromMat4(this.array, m.array);
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

})();
