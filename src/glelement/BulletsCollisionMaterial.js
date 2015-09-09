(function() {

  phina.define("glb.BulletsCollisionMaterial", {
    superClass: "glb.Material",

    init: function() {
      this.superInit();
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

    draw: function(glContext, length) {
      var gl = glContext.gl;
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
