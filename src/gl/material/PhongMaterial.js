(function() {

  phina.define("glb.PhongMaterial", {
    superClass: "glb.BasicMaterial",

    init: function(param) {
      this.superInit(param);
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
  });

  var DEFAULT_PARAM = {
    color: phina.util.Color(255, 255, 255, 1),
    image: null,
  };

  var ATTRIBUTE_META_DATA = [{
    name: "position",
    size: 3,
  }, {
    name: "normal",
    size: 3,
  }, {
    name: "uv",
    size: 2,
  }, {
    name: "vertexColor",
    size: 4,
  }, ];

  var UNIFORM_META_DATA = [{
    name: "worldMatrix",
    type: "mat4",
  }, {
    name: "vpMatrix",
    type: "mat4",
  }, {
    name: "invMatrix",
    type: "mat4",
  }, {
    name: "texture",
    type: "texture",
  }, {
    name: "color",
    type: "color",
  }, {
    name: "useTexture",
    type: "int",
  }, {
    name: "lightDirection",
    type: "vec3",
  }, {
    name: "lightColor",
    type: "color",
  }, {
    name: "ambientColor",
    type: "color",
  }, ];

  var VERTEX_SHADER_SOURCE = [
    "attribute vec3 position;",
    "attribute vec3 normal;",
    "attribute vec2 uv;",
    "attribute vec4 vertexColor;",

    "uniform mat4 worldMatrix;",
    "uniform mat4 vpMatrix;",
    "uniform vec4 color;",
    "uniform mat4 invMatrix;",

    "uniform vec3 lightDirection;",
    "uniform vec4 lightColor;",
    "uniform vec4 ambientColor;",

    "varying vec2 vUv;",
    "varying vec4 vColor;",
    
    "vec3 rgbToHsv(vec3 c) {",
    "    vec4 k = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
    "    vec4 p = mix(vec4(c.bg, k.wz), vec4(c.gb, k.xy), step(c.b, c.g));",
    "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
    
    "    float d = q.x - min(q.w, q.y);",
    "    float e = 1.0e-10;",
    "    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
    "}",
    
    "vec3 hsvToRgb(vec3 c) {",
    "    vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
    "    vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);",
    "    return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);",
    "}",

    "void main(void) {",
    "    vUv = uv;",

    "    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;",
    "    float d = clamp(dot(normal, invLight), 0.1, 1.0);",
    "    vec4 dColor = lightColor * vec4(vec3(d), 1.0);",
    "    vColor = clamp(color * vertexColor * (dColor + ambientColor), 0.0, 1.0);",

    "    gl_Position = vpMatrix * worldMatrix * vec4(position, 1.0);",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "uniform sampler2D texture;",
    "uniform int useTexture;",

    "varying vec2 vUv;",
    "varying vec4 vColor;",

    "void main(void) {",
    "    if (bool(useTexture)) {",
    "        gl_FragColor = clamp(vColor * texture2D(texture, vUv), 0.0, 1.0);",
    "    } else {",
    "        gl_FragColor = clamp(vColor, 0.0, 1.0);",
    "    }",
    "}",
  ].join("\n");

})();
