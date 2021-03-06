(function() {

  phina.define("glb.BasicMaterial", {
    superClass: "glb.Material",

    color: null,

    _image: null,
    texture: null,
    
    isBuild: false,

    init: function(param) {
      this.superInit();

      param = {}.$extend(DEFAULT_PARAM, param);

      this.color = param.color;
      this._image = param.image;
    },

    setColor: function(color) {
      this.color = color;
      return this;
    },

    build: function(glLayer) {
      if (this.isBuild) return;

      this._createProgram(glLayer);
      if (this._image) {
        this.texture = glLayer.createTexture(this._image);
      }
      
      this.isBuild = true;
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

    setAttributes: function(glLayer, geometry) {
      this.superSetAttributes(glLayer, geometry);
    },

    setTextures: function(glLayer) {
      var gl = glLayer.gl;

      if (this.texture) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      } else {
        gl.bindTexture(gl.TEXTURE_2D, null);
      }
    },

    setUniforms: function(glLayer, uniformValues) {
      this.superSetUniforms(glLayer, uniformValues);

      this.setUniform(glLayer, "color", this.color);
      this.setUniform(glLayer, "useTexture", this.texture ? 1 : 0);
    },

    draw: function(glLayer, length) {
      var gl = glLayer.gl;
      gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
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
    name: "uv",
    size: 2,
  }, ];

  var UNIFORM_META_DATA = [{
    name: "worldMatrix",
    type: "mat4",
  }, {
    name: "vpMatrix",
    type: "mat4",
  }, {
    name: "texture",
    type: "texture",
  }, {
    name: "uvTranslate",
    type: "vec2",
  }, {
    name: "color",
    type: "color",
  }, {
    name: "useTexture",
    type: "int",
  }, ];

  var VERTEX_SHADER_SOURCE = [
    "attribute vec3 position;",
    "attribute vec2 uv;",

    "uniform mat4 worldMatrix;",
    "uniform mat4 vpMatrix;",
    "uniform vec4 color;",

    "varying vec2 vUv;",
    "varying vec4 vColor;",

    "void main(void) {",
    "    vUv = uv;",
    "    vColor = color;",
    "    gl_Position = vpMatrix * worldMatrix * vec4(position, 1.0);",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "uniform sampler2D texture;",
    "uniform vec2 uvTranslate;",
    "uniform int useTexture;",

    "varying vec2 vUv;",
    "varying vec4 vColor;",

    "void main(void) {",
    "    if (bool(useTexture)) {",
    "        gl_FragColor = vColor * texture2D(texture, uvTranslate + vUv);",
    "    } else {",
    "        gl_FragColor = vColor;",
    "    }",
    "}",
  ].join("\n");

})();
