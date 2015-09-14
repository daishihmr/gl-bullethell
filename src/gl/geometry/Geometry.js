phina.define("glb.Geometry", {

  /**
   * @type {Float32Array}
   */
  materialIndexData: null,
  /**
   * @type {Float32Array}
   */
  positionData: null,
  /**
   * @type {Float32Array}
   */
  normalData: null,
  /**
   * @type {Float32Array}
   */
  uvData: null,
  /**
   * @type {Float32Array}
   */
  vertexColorData: null,
  /**
   * @type {Int16Array}
   */
  indexData: null,

  /**
   * VBO
   * @type {WebGLBuffer}
   */
  materialIndex: null,
  /**
   * VBO
   * @type {WebGLBuffer}
   */
  position: null,
  /**
   * VBO
   * @type {WebGLBuffer}
   */
  normal: null,
  /**
   * VBO
   * @type {WebGLBuffer}
   */
  uvData: null,
  /**
   * VBO
   * @type {WebGLBuffer}
   */
  vertexColor: null,
  /**
   * IBO
   * @type {WebGLBuffer}
   */
  index: null,

  init: function() {
    // this.positionData = new Float32Array();
    // this.normalData = new Float32Array();
    // this.uvData = new Float32Array();
    // this.vertexColorData = new Float32Array();
    // this.indexData = new Int16Array();
  },

  build: function(glLayer) {
    var gl = glLayer.gl;
    this.materialIndex = this.createVbo(gl, this.materialIndexData);
    this.position = this.createVbo(gl, this.positionData);
    this.normal = this.createVbo(gl, this.normalData);
    this.uv = this.createVbo(gl, this.uvData);
    this.vertexColor = this.createVbo(gl, this.vertexColorData);
    this.index = this.createIbo(gl, this.indexData);
  },

  createVbo: function(gl, data, usage) {
    usage = usage || GL.STATIC_DRAW;

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  },

  transfarVbo: function(gl, vbo, data, offset, usage) {
    offset = offset || 0;
    usage = usage || GL.STATIC_DRAW;

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    return vbo;
  },

  createIbo: function(gl, data, usage) {
    usage = usage || GL.STATIC_DRAW;

    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, usage);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    return ibo;
  },
});
