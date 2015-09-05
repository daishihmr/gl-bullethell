(function() {

    tm.define("glb.ReverseShader", {
        superClass: "glb.DefaultShader",
        init: function() {
            this.superInit();
            this.fragmentShaderSource = [
                "precision mediump float;",

                "uniform sampler2D texture;",

                "varying vec2 vUv;",

                "void main(void) {",
                "    vec4 c = texture2D(texture, vUv);",
                "    gl_FragColor = vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a);",
                "}",
            ].join("\n");
        }
    });

})();
