(function() {

    tm.define("glb.ParticleMaterial", {
        superClass: "glb.Material",

        image: null,
        _texture: null,

        init: function(image) {
            this.superInit();
            this.image = image;
        },

        initialize: function(glContext) {
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

        setAttributes: function(glContext, attributeValues) {
            this.superSetAttributes(glContext, attributeValues);

            var gl = glContext.gl;
            if (this.image) {
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        },

        setUniforms: function(glContext, uniformValues) {
            this.superSetUniforms(glContext, uniformValues);

            this.setUniform(glContext, "useTexture", this.image ? 1 : 0);
        },

        draw: function(glContext, length) {
            var gl = glContext.gl;
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
            gl.drawArrays(gl.POINTS, 0, length);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        },

    });

    var ATTRIBUTE_META_DATA = [{
        name: "initialPosition",
        size: 2,
    }, {
        name: "velocity",
        size: 2,
    }, {
        name: "accel",
        size: 2,
    }, {
        name: "spawnTime",
        size: 1,
    }, {
        name: "active",
        size: 1,
    }, {
        name: "type",
        size: 1,
    }, {
        name: "ttl",
        size: 1,
    }, {
        name: "sizeFrom",
        size: 1,
    }, {
        name: "sizeTo",
        size: 1,
    }, {
        name: "colorFrom",
        size: 4,
    }, {
        name: "colorTo",
        size: 4,
    }, ];

    var UNIFORM_META_DATA = [{
        name: "vpMatrix",
        type: "mat4",
    }, {
        name: "time",
        type: "float",
    }, ];

    var VERTEX_SHADER_SOURCE = [
        "attribute vec2 initialPosition;",
        "attribute vec2 velocity;",
        "attribute vec2 accel;",
        "attribute float spawnTime;",
        "attribute float active;",
        "attribute float type;",

        "attribute float ttl;",

        "attribute float sizeFrom;",
        "attribute float sizeTo;",
        "attribute vec4 colorFrom;",
        "attribute vec4 colorTo;",
        
        "uniform mat4 vpMatrix;",
        "uniform float time;",

        "varying float vAge;",
        "varying float vActive;",
        "varying float vType;",
        "varying float vSize;",
        "varying vec4 vColor;",
        
        "float lerp(float from, float to, float time, float duration) {",
        "    return from + (to - from) * time / duration;",
        "}",
        "vec4 lerp(vec4 from, vec4 to, float time, float duration) {",
        "    return from + (to - from) * time / duration;",
        "}",

        "void main(void) {",
        "    vActive = active;",
        "    vType = type;",
        "    if (active < 0.5) {",
        "        gl_Position = vec4(0.0);",
        "        gl_PointSize = 0.0;",
        "    } else {",
        "        vAge = time - spawnTime;",
        "        vSize = lerp(sizeFrom, sizeTo, vAge, ttl);",
        "        vColor = lerp(colorFrom, colorTo, vAge, ttl);",

        "        float tm = vAge * 10000.0;",
        "        vec2 pos = initialPosition + velocity * tm + accel * (tm * tm * 0.5);",
        "        gl_Position = vpMatrix * vec4(pos, 0.0, 1.0);",
        "        gl_PointSize = vSize * {0};".format(GL_QUALITY),
        "    }",
        "}",
    ].join("\n");

    var FRAGMENT_SHADER_SOURCE = [
        "precision mediump float;",
        
        "uniform sampler2D texture;",

        "varying float vAge;",
        "varying float vActive;",
        "varying float vType;",
        "varying float vSize;",
        "varying vec4 vColor;",

        "void main(void) {",
        "    if (vActive < 0.5) discard;",

        "    vec2 uv = vec2((gl_PointCoord.x + vType) * 0.0625, gl_PointCoord.y);",
        "    gl_FragColor = vColor * texture2D(texture, uv);",
        "}",
    ].join("\n");

})();
