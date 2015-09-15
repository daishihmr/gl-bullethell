(function() {

  phina.define("glb.BulletsGeometry", {
    superClass: "glb.Geometry",

    COUNT: 8192,

    bufferUsage: 1,

    initialPositionData: null,
    velocityData: null,
    spawnTimeData: null,
    activeData: null,
    frameIndexData: null,

    initialPosition: null,
    velocity: null,
    spawnTime: null,
    active: null,
    frameIndex: null,

    vboNeedUpdate: false,

    init: function() {
      this.superInit();

      this.initialPositionData = new Float32Array(Array.range(0, this.COUNT).map(function() {
        return [0, 0];
      }).flatten());;
      this.velocityData = new Float32Array(Array.range(0, this.COUNT).map(function() {
        return [0, 0];
      }).flatten());
      this.spawnTimeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
        return 0;
      }));
      this.activeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
        return 0;
      }));
      this.frameIndexData = new Float32Array(Array.range(0, this.COUNT).map(function() {
        return 0;
      }));
    },

    build: function(glLayer) {
      var gl = glLayer.gl;

      this.initialPosition = this.createVbo(gl, this.initialPositionData, gl.DYNAMIC_DRAW);
      this.velocity = this.createVbo(gl, this.velocityData, gl.DYNAMIC_DRAW);
      this.spawnTime = this.createVbo(gl, this.spawnTimeData, gl.DYNAMIC_DRAW);
      this.active = this.createVbo(gl, this.activeData, gl.DYNAMIC_DRAW);
      this.frameIndex = this.createVbo(gl, this.frameIndexData, gl.DYNAMIC_DRAW);
    },

    rebind: function(gl) {
      this.transfarVbo(gl, this.initialPosition, this.initialPositionData);
      this.transfarVbo(gl, this.velocity, this.velocityData);
      this.transfarVbo(gl, this.spawnTime, this.spawnTimeData);
      this.transfarVbo(gl, this.active, this.activeData);
      this.transfarVbo(gl, this.frameIndex, this.frameIndexData);
    },

    spawn: function(now, pos, vel, frameIndex) {
      var index = find(this.activeData, 0);
      if (index < 0) {
        console.warn("弾が足りない");
        return -1;
      }

      this.initialPositionData[index * 2 + 0] = pos.x;
      this.initialPositionData[index * 2 + 1] = pos.y;
      this.velocityData[index * 2 + 0] = vel.x;
      this.velocityData[index * 2 + 1] = vel.y;
      this.spawnTimeData[index] = now;
      this.activeData[index] = 1;
      this.frameIndexData[index] = frameIndex;

      this.vboNeedUpdate = true;

      return index;
    },

    despawn: function(index) {
      if (index < this.activeData.length) {
        this.activeData[index] = 0;
        this.vboNeedUpdate = true;
      }
    },

  });

  var cursor = 0;
  var find = function(array, value) {
    var before = cursor;
    var len = array.length;
    for (; cursor < len; cursor++) {
      if (array[cursor] === value) return cursor;
    }
    for (cursor = 0; cursor < before; cursor++) {
      if (array[cursor] === value) return cursor;
    }
    cursor = 0;
    return -1;
  };

})();
