(function() {

  phina.define("glb.MixShader", {
    superClass: "glb.DefaultShader",
    init: function() {
      this.superInit();
      this.uniformMetaData = [{
        name: "mMatrix",
        type: "mat4",
      }, {
        name: "vpMatrix",
        type: "mat4",
      }, {
        name: "texture0",
        type: "texture",
      }, {
        name: "texture1",
        type: "texture",
      }, {
        name: "mixFactor0",
        type: "float",
      }, {
        name: "mixFactor1",
        type: "float",
      }, ];
      this.fragmentShaderSource = [
        "precision mediump float;",

        "uniform float mixFactor0;",
        "uniform float mixFactor1;",
        "uniform sampler2D texture0;",
        "uniform sampler2D texture1;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    vec4 c0 = texture2D(texture0, vUv);",
        "    vec4 c1 = texture2D(texture1, vUv);",
        "    gl_FragColor = clamp(c0 * mixFactor0 + c1 * mixFactor1, 0.0, 1.0);",
        "}",
      ].join("\n");
    }
  });

})();
