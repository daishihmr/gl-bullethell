(function() {

  phina.define("glb.Camera", {
    superClass: "phina.app.Element",

    position: null,
    target: null,
    up: null,
    vMatrix: null,
    pMatrix: null,
    vpMatrix: null,
    needsUpdate: false,

    init: function() {
      this.superInit();

      this.position = glb.Vector3(0, 0, 10);
      this.target = glb.Vector3();
      this.up = glb.Vector3(0, 1, 0);

      this.vMatrix = glb.Matrix4();
      this.pMatrix = glb.Matrix4();
      this.vpMatrix = glb.Matrix4();

      this.updateMatrix();
    },

    updateMatrix: function() {
      this._updateProjectionMatrix();
      this.up.normalize();
      this.vMatrix.lookAt(this.position, this.target, this.up);
      this.vpMatrix.copy(this.pMatrix).mul(this.vMatrix);
      this.needsUpdate = false;
    },

    _updateProjectionMatrix: function() {},

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

    _accessor: {
      x: {
        set: function(v) {
          this.position.x = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.x;
        },
      },
      y: {
        set: function(v) {
          this.position.y = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.y;
        },
      },
      z: {
        set: function(v) {
          this.position.z = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.position.z;
        },
      },
      targetX: {
        set: function(v) {
          this.target.x = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.target.x;
        },
      },
      targetY: {
        set: function(v) {
          this.target.y = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.target.y;
        },
      },
      targetZ: {
        set: function(v) {
          this.target.z = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.target.z;
        },
      },
      upX: {
        set: function(v) {
          this.up.x = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.up.x;
        },
      },
      upY: {
        set: function(v) {
          this.up.y = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.up.y;
        },
      },
      upZ: {
        set: function(v) {
          this.up.z = v;
          this.needsUpdate = true;
        },
        get: function() {
          return this.up.z;
        },
      },
    },

    setPosition: function(x, y, z) {
      this.position.set(x, y, z);
      this.needsUpdate = true;
    },

  });

})();
