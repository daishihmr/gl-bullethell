(function() {

  phina.define("glb.Camera", {

    position: null,
    target: null,
    up: null,
    vMatrix: null,
    pMatrix: null,
    vpMatrix: null,
    needsUpdate: false,

    init: function() {
      this.position = glb.Vector3(0, 0, 10);
      this.target = glb.Vector3();
      this.up = glb.Vector3(0, 1, 0);
      this.vMatrix = glb.Matrix4();
      this.pMatrix = this._setupProjectionMatrix();
      this.vpMatrix = glb.Matrix4();

      this.updateMatrix();

      this._defineAccessors();
    },

    _setupProjectionMatrix: function() {
      return glb.Matrix4();
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
    },

    calcVpMatrix: function() {
      this.vpMatrix = glb.Matrix4.mul(this.pMatrix, this.vMatrix);
      return this.vpMatrix;
    },

    updateMatrix: function() {
      this.vMatrix.lookAt(this.position, this.target, this.up);
      this.needsUpdate = false;
    },

    /**
     * 画面上の座標を得る
     * @param  {{x:Number, y:Number, z:Number}}} obj
     * @return {glb.Vector2}
     */
    getScreenCoord: (function() {
      var temp = null;
      return function(obj) {
        if (temp === null) temp = vec4.create();

        vec4.set(temp, obj.x, obj.y, obj.z || 0, 1);
        vec4.transformMat4(temp, temp, this.vpMatrix.array);
        return glb.Vector2(temp[0] / temp[3], temp[1] / temp[3]);
      };
    })(),

  });

})();