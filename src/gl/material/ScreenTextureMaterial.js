(function() {

  phina.define("glb.ScreenTextureMaterial", {
    superClass: "glb.Material",

    texture: null,

    init: function(shader) {
      this.superInit();
      this._vertexShaderSource = shader.vertexShaderSource;
      this._fragmentShaderSource = shader.fragmentShaderSource;
      this._attributeMetaData = shader.attributeMetaData;
      this._uniformMetaData = shader.uniformMetaData;
    },

    _getVertexShaderSource: function() {
      return this._vertexShaderSource;
    },
    _getFragmentShaderSource: function() {
      return this._fragmentShaderSource;
    },
    _getAttributeMetaData: function() {
      return this._attributeMetaData;
    },
    _getUniformMetaData: function() {
      return this._uniformMetaData;
    },

    setTextures: function(glContext) {
      var gl = glContext.gl;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    },

    draw: function(glContext, length) {
      var gl = glContext.gl;
      gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
    },

  });

})();
