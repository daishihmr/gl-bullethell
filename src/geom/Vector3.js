(function() {
  phina.define("glb.Vector3", {
    array: null,

    init: function(x, y, z) {
      this.array = vec3.create();
      this.set(x || 0, y || 0, z || 0);
    },

    set: function(x, y, z) {
      vec3.set(this.array, x, y, z);
      return this;
    },

    copy: function(v) {
      vec3.copy(this.array, v.array);
      return this;
    },

    clone: function() {
      return glb.Vector3(this.x, this.y, this.z);
    },

    add: function(v) {
      vec3.add(this.array, this.array, v.array);
      return this;
    },

    sub: function(v) {
      vec3.sub(this.array, this.array, v.array);
      return this;
    },

    mul: function(v) {
      vec3.scale(this.array, this.array, v);
      return this;
    },

    length: function() {
      return vec3.length(this.array);
    },
    squaredLength: function() {
      return vec3.squaredLength(this.array);
    },

    negate: function() {
      vec3.negate(this.array, this.array);
      return this;
    },

    inverse: function() {
      vec3.inverse(this.array, this.array);
      return this;
    },

    normalize: function() {
      vec3.normalize(this.array, this.array);
      return this;
    },

    dot: function(v) {
      return vec3.dot(this.array, v.array);
    },

    cross: function(v) {
      vec3.cross(this.array, this.array, v.array);
      return this;
    },

    transformMat4: function(m) {
      vec3.transformMat4(this.array, this.array, m.array);
      return this;
    },

    transformMat3: function(m) {
      vec3.transformMat3(this.array, this.array, m.array);
      return this;
    },

    transformQuat: function(q) {
      vec3.transformQuat(this.array, this.array, q.array);
      return this;
    },

    setX: function(v) {
      this.array[0] = v;
      return this;
    },
    setY: function(v) {
      this.array[1] = v;
      return this;
    },
    setZ: function(v) {
      this.array[2] = v;
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
      },
      "x": {
        set: function(v) {
          this.array[0] = v;
        },
        get: function() {
          return this.array[0];
        },
      },
      "y": {
        set: function(v) {
          this.array[1] = v;
        },
        get: function() {
          return this.array[1];
        },
      },
      "z": {
        set: function(v) {
          this.array[2] = v;
        },
        get: function() {
          return this.array[2];
        },
      },
    }
  });


  glb.Vector3.distance = function(a, b) {
    return vec3.distance(a.array, b.array);
  };
  glb.Vector3.squaredDistance = function(a, b) {
    return vec3.squaredDistance(a.array, b.array);
  };

  glb.Vector3.angle = function(a, b) {
    return vec3.angle(a.array, b.array);
  };

  glb.Vector3.add = function(a, b) {
    var result = glb.Vector3();
    vec3.add(result.array, a.array, b.array);
    return result;
  };

  glb.Vector3.sub = function(a, b) {
    var result = glb.Vector3();
    vec3.sub(result.array, a.array, b.array);
    return result;
  };

  glb.Vector3.mul = function(v, a) {
    var result = glb.Vector3().copy(v);
    return result.mul(a);
  };

  glb.Vector3.distance = function(a, b) {
    return vec3.distance(a.array, b.array);
  };

  glb.Vector3.squaredDistance = function(a, b) {
    return vec3.squaredDistance(a.array, b.array);
  };

  glb.Vector3.negate = function(a) {
    var result = glb.Vector3();
    vec3.negate(glb.Vector3.array, a.array);
    return result;
  };

  glb.Vector3.inverse = function(a) {
    var result = glb.Vector3();
    vec3.inverse(glb.Vector3.array, a.array);
    return result;
  };

  glb.Vector3.normalize = function(a) {
    var result = glb.Vector3();
    vec3.normalize(glb.Vector3.array, a.array);
    return result;
  };

  glb.Vector3.transformMat4 = function(_v, m) {
    var v = glb.Vector3().copy(_v);
    vec3.transformMat4(v.array, v.array, m.array);
    return v;
  };

  glb.Vector3.transformMat3 = function(_v, m) {
    var v = glb.Vector3().copy(_v);
    vec3.transformMat3(v.array, v.array, m.array);
    return v;
  };

  glb.Vector3.transformQuat = function(_v, m) {
    var v = glb.Vector3().copy(_v);
    vec3.transformQuat(v.array, v.array, m.array);
    return v;
  };

  glb.Vector3.X = glb.Vector3(1, 0, 0);
  glb.Vector3.Y = glb.Vector3(0, 1, 0);
  glb.Vector3.Z = glb.Vector3(0, 0, 1);

})();
