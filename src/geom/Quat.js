(function() {

  phina.define("glb.Quat", {

    array: null,

    init: function(x, y, z, w) {
      this.array = quat.create();
      this.set(x || 0, y || 0, z || 0, w || 1);
    },

    set: function(x, y, z, w) {
      quat.set(this.array, x, y, z, w);
      return this;
    },

    rotationTo: function(va, vb) {
      quat.rotationTo(this.array, va.array, vb.array);
      return this;
    },

    setAxes: function(view, right, up) {
      quat.setAxes(this.array, view.array, right.array, up.array);
      return this;
    },

    copy: function(q) {
      quat.copy(this.array, q.array);
      return this;
    },

    clone: function() {
      var result = glb.Quat();
      result.array = quat.clone(this.array);
      return result;
    },

    identity: function() {
      quat.identity(this.array);
      return this;
    },

    setAxisAngle: function(axis, rad) {
      quat.setAxisAngle(this.array, axis.array, rad);
      return this;
    },

    add: function(q) {
      quat.add(this.array, this.array, q.array);
      return this;
    },

    mul: function(q) {
      quat.multiply(this.array, this.array, q.array);
      return this;
    },

    rotateX: function(rad) {
      quat.rotateX(this.array, this.array, rad);
      return this;
    },
    rotateY: function(rad) {
      quat.rotateY(this.array, this.array, rad);
      return this;
    },
    rotateZ: function(rad) {
      quat.rotateZ(this.array, this.array, rad);
      return this;
    },

    calculateW: function() {
      quat.calculateW(this.array, this.array);
      return this;
    },

    dot: function(q) {
      return quat.dot(this.array, q.array);
    },

    slerp: function(q, t) {
      quat.slerp(this.array, this.array, q.array, t);
      return this;
    },

    invert: function() {
      quat.invert(this.array, this.array);
      return this;
    },

    conjugate: function() {
      quat.conjugate(this.array, this.array);
      return this;
    },

    length: function() {
      return quat.length(this.array);
    },
    squaredLength: function() {
      return quat.squaredLength(this.array);
    },

    normalize: function() {
      quat.normalize(this.array, this.array);
      return this;
    },

    fromMat3: function(m) {
      quat.fromMat3(this.array, m.array);
      return this;
    },

    toMat3: function() {
      var m3 = glb.Matrix3();
      mat3.fromQuat(m3.array, this.array);
      return m3;
    },

    getAngle: function() {
      return Math.acos(quat.dot(this.array, [0, 0, 0, 1])) * 2;
    },
    getAngleTo: function(quat) {
      return Math.acos(quat.dot(this.array, quat.array)) * 2;
    },

    _accessor: {
      "typedArray": {
        get: function() {
          return this.array;
        },
        set: function(v) {
          this.array = v
        },
      },
      "x": {
        get: function() {
          return this.array[0];
        },
        set: function(v) {
          this.array[0] = v;
        },
      },
      "y": {
        get: function() {
          return this.array[1];
        },
        set: function(v) {
          this.array[1] = v;
        },
      },
      "z": {
        get: function() {
          return this.array[2];
        },
        set: function(v) {
          this.array[2] = v;
        },
      },
      "w": {
        get: function() {
          return this.array[3];
        },
        set: function(v) {
          this.array[3] = v;
        },
      },
    }
  });

  glb.Quat.slerp = function(a, b, t) {
    var result = glb.Quat();
    quat.slerp(result.array, a.array, b.array, t);
    return result;
  };

  glb.Quat.getAngle = function(a, b)  {
    return Math.acos(quat.dot(a.array, b.array)) * 2;
  };

})();
