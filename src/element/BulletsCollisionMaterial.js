(function() {

  phina.define("glb.BulletsCollisionMaterial", {
    superClass: "glb.Material",
    
    vpMatrix: null,

    init: function() {
      this.superInit();
      this.vpMatrix = glb.Matrix4();
      
      var v = mat4.create();
      mat4.lookAt(v, [0, 0, SCREEN_HEIGHT * 0.5 / Math.tan(45 * Math.DEG_TO_RAD * 0.5)], [0, 0, 0], [0, 1, 0]);
      var p = mat4.create();
      mat4.ortho(p, -SCREEN_WIDTH * 0.5, SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * -0.5, SCREEN_HEIGHT * 0.5, 10, 10000);
      
      mat4.mul(this.vpMatrix.array, p, v);
    },

    _getVertexShaderSource: function() {
      return VERTEX_SHADER_SOURCE;
    },
    _getFragmentShaderSource: function() {
      return FRAGMENT_SHADER_SOURCE;
    },
    _getAttributeMetaData: function() {
      return ATTRIBUTE_META_DATA;
    },
    _getUniformMetaData: function() {
      return UNIFORM_META_DATA;
    },

    setUniforms: function(glLayer, uniformValues) {
      this.superSetUniforms(glLayer, uniformValues);

      this.setUniform(glLayer, "vpMatrix", this.vpMatrix);
    },

    draw: function(glLayer, length) {
      var gl = glLayer.gl;
      gl.drawArrays(gl.POINTS, 0, length);
    },

  });

  var ATTRIBUTE_META_DATA = [{
    name: "initialPosition",
    size: 2,
  }, {
    name: "velocity",
    size: 2,
  }, {
    name: "spawnTime",
    size: 1,
  }, {
    name: "active",
    size: 1,
  }, ];

  var UNIFORM_META_DATA = [{
    name: "vpMatrix",
    type: "mat4",
  }, {
    name: "time",
    type: "float",
  }, ];

  var VERTEX_SHADER_SOURCE = [
    "attribute vec2 initialPosition;",
    "attribute vec2 velocity;",
    "attribute float spawnTime;",
    "attribute float active;",

    "uniform mat4 vpMatrix;",
    "uniform float time;",

    "varying float vActive;",

    "void main(void) {",
    "    vActive = active;",
    "    if (active < 0.5) {",
    "        gl_Position = vec4(0.0);",
    "        gl_PointSize = 0.0;",
    "    } else {",
    "        float age = time - spawnTime;",
    "        vec2 pos = initialPosition + velocity * age * 10000.0;",
    "        gl_Position = vpMatrix * vec4(pos, 0.0, 1.0);",
    "        gl_PointSize = {0};".format(BULLET_SIZE.toFloatString()),
    "    }",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "varying float vActive;",

    "void main(void) {",
    "    if (vActive < 0.5) discard;",
    "    if (0.2 < length(gl_PointCoord - vec2(0.5, 0.5))) discard;",
    "    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);",
    "}",
  ].join("\n");

})();
