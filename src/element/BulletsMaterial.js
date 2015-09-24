(function() {

  phina.define("glb.BulletsMaterial", {
    superClass: "glb.Material",

    _image: null,
    texture: null,

    init: function(image) {
      this.superInit();
      this._image = image;
    },

    build: function(glLayer) {
      this._createProgram(glLayer);
      if (this._image) {
        this.texture = glLayer.createTexture(this._image);
      }
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

    setTextures: function(glLayer) {
      var gl = glLayer.gl;
      if (this.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    },

    setUniforms: function(glLayer, uniformValues) {
      this.superSetUniforms(glLayer, uniformValues);

      this.setUniform(glLayer, "useTexture", this.texture ? 1 : 0);
    },

    draw: function(glLayer, length) {
      var gl = glLayer.gl;

      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.CULL_FACE);
      gl.enable(gl.BLEND);

      this.setUniform(glLayer, "aura", 0);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.drawArrays(gl.POINTS, 0, length);

      this.setUniform(glLayer, "aura", 1);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
      gl.drawArrays(gl.POINTS, 0, length);

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.disable(gl.BLEND);
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
  }, {
    name: "frameIndex",
    size: 1,
  }, ];

  var UNIFORM_META_DATA = [{
    name: "vpMatrix",
    type: "mat4",
  }, {
    name: "time",
    type: "float",
  }, {
    name: "aura",
    type: "float",
  }, ];

  var VERTEX_SHADER_SOURCE = [
    "attribute vec2 initialPosition;",
    "attribute vec2 velocity;",
    "attribute float spawnTime;",
    "attribute float active;",
    "attribute float frameIndex;",

    "uniform mat4 vpMatrix;",
    "uniform float time;",
    "uniform float aura;",

    "varying float vAge;",
    "varying float vActive;",
    "varying float vFrameIndex;",
    "varying float vAngle;",
    "varying mat3 vUvMat;",
    "varying float vAura;",

    "mat3 translate(float x, float y) {",
    "    return mat3(",
    "        1.0, 0.0, 0.0,",
    "        0.0, 1.0, 0.0,",
    "          x,   y, 1.0",
    "    );",
    "}",

    "mat3 rotate(float rad) {",
    "    float s = sin(rad);",
    "    float c = cos(rad);",
    "    return mat3(",
    "        c, s, 0,",
    "       -s, c, 0,",
    "        0, 0, 1",
    "    );",
    "}",

    "void main(void) {",
    "    vActive = active;",
    "    vAura = aura;",
    "    vFrameIndex = frameIndex + mod(floor((time - spawnTime) * 7500.0), 8.0);",
    "    if (active < 0.5) {",
    "        vAngle = 0.0;",
    "        gl_Position = vec4(0.0);",
    "        gl_PointSize = 0.0;",
    "    } else {",
    "        if (frameIndex < 8.0) {",
    "            vAngle = atan(velocity.y, velocity.x);",
    "        } else {",
    "            vAngle = time * 3000.0;",
    "        }",
    "        vAge = time - spawnTime;",
    "        vUvMat = translate(0.5, 0.5) * rotate(vAngle) * translate(-0.5, -0.5);",
    "        vec2 pos = initialPosition + velocity * ((time - spawnTime) * 10000.0);",
    "        gl_Position = vpMatrix * vec4(pos, 0.0, 1.0);",
    "        float c = sin(vAge * 5500.0) * 4.0 - 2.0;",
    "        gl_PointSize = ({0} + c) * {1} * (1.0 + aura * 0.5);".format(BULLET_APPEALANCE.toFloatString(), GL_QUALITY.toFloatString()),
    "    }",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "uniform sampler2D texture;",

    "varying float vAge;",
    "varying float vActive;",
    "varying float vFrameIndex;",
    "varying float vAngle;",
    "varying mat3 vUvMat;",
    "varying float vAura;",

    "void main(void) {",
    "    if (vActive < 0.5) discard;",

    "    vec3 buv = vec3(gl_PointCoord.x, gl_PointCoord.y, 1.0);",
    "    vec3 ruv = vUvMat * buv;",
    "    vec2 uv = vec2((ruv.x + vFrameIndex) * 0.0625, ruv.y);",

    "    float c = sin(vAge * 6200.0) * 0.12;",
    "    vec4 light = vec4(0.0, c, 0.0, 0.0);",

    "    vec4 result = light + texture2D(texture, uv);",
    "    if (vAura < 0.5) {",
    "        if (0.58 < length(gl_PointCoord - vec2(0.5, 0.5))) discard;",
    "        if (result.a < 0.9) discard;",
    "        gl_FragColor = result;",
    "    } else {",
    "        float c = 0.4 - length(gl_PointCoord - vec2(0.5, 0.5));",
    "        if (c < 0.0) discard;",
    "        gl_FragColor = vec4(0.5, 0.5, 1.0, c * 0.8);",
    "    }",
    "}",
  ].join("\n");

})();
