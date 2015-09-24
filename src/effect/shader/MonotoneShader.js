(function() {

  phina.define("glb.MonotoneShader", {
    superClass: "glb.DefaultShader",
    init: function() {
      this.superInit();
      this.fragmentShaderSource = [
        "precision mediump float;",

        "uniform sampler2D texture;",

        "varying vec2 vUv;",

        "void main(void) {",
        "    vec4 color = texture2D(texture, vUv);",
        "    float c = (color.r + color.g + color.b) / 3.0;",
        "    gl_FragColor = vec4(c, c, c, color.a);",
        "}",
      ].join("\n");
    }
  });

})();
