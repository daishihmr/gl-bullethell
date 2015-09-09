(function() {

  phina.define("glb.DefaultShader", {
    init: function() {
      this.attributeMetaData = ATTRIBUTE_META_DATA;
      this.uniformMetaData = UNIFORM_META_DATA;
      this.vertexShaderSource = VERTEX_SHADER_SOURCE;
      this.fragmentShaderSource = FRAGMENT_SHADER_SOURCE;
    }
  });

  var ATTRIBUTE_META_DATA = [{
    name: "position",
    size: 3,
  }, {
    name: "uv",
    size: 2,
  }, ];

  var UNIFORM_META_DATA = [{
    name: "mMatrix",
    type: "mat4",
  }, {
    name: "vpMatrix",
    type: "mat4",
  }, {
    name: "texture",
    type: "texture",
  }, ];

  var VERTEX_SHADER_SOURCE = [
    "attribute vec3 position;",
    "attribute vec2 uv;",

    "uniform mat4 mMatrix;",
    "uniform mat4 vpMatrix;",

    "varying vec2 vUv;",

    "void main(void) {",
    "    vUv = vec2(uv.x, 1.0 - uv.y);",
    "    gl_Position = vpMatrix * mMatrix * vec4(position, 1.0);",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "uniform sampler2D texture;",

    "varying vec2 vUv;",

    "void main(void) {",
    "    gl_FragColor = texture2D(texture, vUv);",
    "}",
  ].join("\n");

})();
