(function() {

    tm.define("glb.BasicMaterial", {
        superClass: "glb.Material",

        color: null,

        image: null,
        _texture: null,

        init: function(image) {
            this.superInit();

            this.color = vec4.set(vec4.create(), 1, 1, 1, 1);
            this.image = image;
        },

        build: function(glContext) {
            this._createProgram(glContext);
            if (this.image) {
                this._createTexture(glContext);
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

        _createTexture: function(glContext) {
            this._texture = glContext.createTexture(this.image);
        },

        setAttributes: function(glContext, geometry) {
            this.superSetAttributes(glContext, geometry);
        },
        
        setTextures: function(glContext) {
            var gl = glContext.gl;

            if (this.image) {
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        },

        setUniforms: function(glContext, uniformValues) {
            this.superSetUniforms(glContext, uniformValues);
            
            this.setUniform(glContext, "color", this.color);
            this.setUniform(glContext, "useTexture", this.image ? 1 : 0);
        },

        setRGBA: function(r, g, b, a) {
            this.color[0] = r;
            this.color[1] = g;
            this.color[2] = b;
            this.color[3] = a;
            return this;
        },

        setColor: function(color) {
            vec4.copy(this.color, color);
            return this;
        },

        draw: function(glContext, length) {
            var gl = glContext.gl;
            gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
        },

    });

    var ATTRIBUTE_META_DATA = [{
        name: "vertex",
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
    }, {
        name: "uvTranslate",
        type: "vec2",
    }, {
        name: "color",
        type: "vec4",
    }, {
        name: "useTexture",
        type: "int",
    }, ];

    var VERTEX_SHADER_SOURCE = [
        "attribute vec3 vertex;",
        "attribute vec2 uv;",

        "uniform mat4 mMatrix;",
        "uniform mat4 vpMatrix;",
        "uniform vec4 color;",

        "varying vec2 vUv;",
        "varying vec4 vColor;",

        "void main(void) {",
        "    vUv = uv;",
        "    vColor = color;",
        "    gl_Position = vpMatrix * mMatrix * vec4(vertex, 1.0);",
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
