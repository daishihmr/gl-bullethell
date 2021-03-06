(function() {

  phina.define("glb.Material", {

    program: null,

    vao: null,
    attributes: null,
    uniforms: null,
    
    isBuild: false,

    init: function() {},

    build: function(glLayer) {
      if (this.isBuild) return;

      this._createProgram(glLayer);
      
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

    _createProgram: function(glLayer) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;
      var vs = this._createShader(gl, gl.VERTEX_SHADER, this._getVertexShaderSource());
      var fs = this._createShader(gl, gl.FRAGMENT_SHADER, this._getFragmentShaderSource());
      this.program = gl.createProgram();
      gl.attachShader(this.program, vs);
      gl.attachShader(this.program, fs);
      gl.linkProgram(this.program);
      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(this.program));
      }

      if (ext !== null) {
        this.vao = ext.createVertexArrayOES();
      }

      this.attributes = this._getAttributeMetaData().reduce(function(attributes, attr) {
        attributes[attr.name] = {
          name: attr.name,
          size: attr.size,
          location: gl.getAttribLocation(this.program, attr.name),
        };
        // log(attr.name + " : " + attributes[attr.name].location);
        return attributes;
      }.bind(this), {});

      this.uniforms = this._getUniformMetaData().reduce(function(uniforms, uni) {
        uniforms[uni.name] = {
          name: uni.name,
          type: uni.type,
          location: gl.getUniformLocation(this.program, uni.name),
        };
        // log(uni.name + " : " + uniforms[uni.name].location);
        return uniforms;
      }.bind(this), {});

      return this;
    },
    _createShader: function(gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        return shader;
      } else {
        throw new Error(gl.getShaderInfoLog(shader));
      }
    },

    setProgram: function(glLayer) {
      var gl = glLayer.gl;
      gl.useProgram(this.program);
    },

    setVao: function(glLayer) {
      var ext = glLayer.ext;
      if (ext !== null) ext.bindVertexArrayOES(this.vao);
    },
    unsetVao: function(glLayer) {
      var ext = glLayer.ext;
      if (ext !== null) ext.bindVertexArrayOES(null);
    },

    setAttributes: function(glLayer, geometry) {
      var gl = glLayer.gl;
      var attributes = this.attributes;

      Object.keys(this.attributes).forEach(function(name) {
        var attr = attributes[name];

        if (geometry[name]) {
          gl.bindBuffer(gl.ARRAY_BUFFER, geometry[name]);
          gl.enableVertexAttribArray(attr.location);
          gl.vertexAttribPointer(attr.location, attr.size, gl.FLOAT, false, 0, 0);
        }
      });
    },

    setTextures: function(glLayer) {},

    setUniforms: function(glLayer, uniformValues) {
      var gl = glLayer.gl;
      var self = this;
      var uniforms = this.uniforms;

      Object.keys(this.uniforms).forEach(function(name) {
        var attr = uniforms[name];

        if (uniformValues[name]) {
          self.setUniform(glLayer, name, uniformValues[name]);
        }
      });
    },

    setUniform: function(glLayer, name, value) {
      var gl = glLayer.gl;

      var uni = this.uniforms[name];

      if (value.typedArray) {
        value = value.typedArray;
      }

      if (uni) {
        switch (uni.type) {
          case "float":
            gl.uniform1f(uni.location, value);
            break;
          case "int":
          case "texture":
            gl.uniform1i(uni.location, value);
            break;
          case "vec2":
            gl.uniform2fv(uni.location, value);
            break;
          case "vec3":
            gl.uniform3fv(uni.location, value);
            break;
          case "vec4":
          case "color":
            gl.uniform4fv(uni.location, value);
            break;
          case "mat3":
            gl.uniformMatrix3fv(uni.location, false, value);
            break;
          case "mat4":
            gl.uniformMatrix4fv(uni.location, false, value);
            break;
        }
      }
    },

    draw: function(glLayer, length) {},
  });

  glb.Material.prototype.superSetAttributes = glb.Material.prototype.setAttributes;
  glb.Material.prototype.superSetUniforms = glb.Material.prototype.setUniforms;

  var ATTRIBUTE_META_DATA = [];

  var UNIFORM_META_DATA = [];

  var VERTEX_SHADER_SOURCE = [
    "void main(void) {",
    "    gl_Position = vec4(1.0);",
    "}",
  ].join("\n");

  var FRAGMENT_SHADER_SOURCE = [
    "precision mediump float;",

    "void main(void) {",
    "    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);",
    "}",
  ].join("\n");

})();
