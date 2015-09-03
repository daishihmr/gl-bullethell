(function() {

    tm.define("glb.BulletsMaterial", {
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
            gl.drawArrays(gl.POINTS, 0, length);
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
        name: "type",
        size: 1,
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
        "attribute float spawnTime;",
        "attribute float active;",
        "attribute float type;",

        "uniform mat4 vpMatrix;",
        "uniform float time;",

        "varying float vAge;",
        "varying float vActive;",
        "varying float vType;",
        "varying float vAngle;",
        "varying mat3 vUvMat;",

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
        "    vType = type;",
        "    if (active < 0.5) {",
        "        vAngle = 0.0;",
        "        gl_Position = vec4(0.0);",
        "        gl_PointSize = 0.0;",
        "    } else {",
        "        if (type < 8.0) {",
        "            vAngle = atan(velocity.y, velocity.x);",
        "        } else {",
        "            vAngle = time * 3000.0;",
        "        }",
        "        vAge = time - spawnTime;",
        "        vUvMat = translate(0.5, 0.5) * rotate(vAngle) * translate(-0.5, -0.5);",
        "        vec2 pos = initialPosition + velocity * ((time - spawnTime) * 10000.0);",
        "        gl_Position = vpMatrix * vec4(pos, 0.0, 1.0);",
        "        float c = sin(vAge * 5500.0) * 4.0 - 2.0;",
        "        gl_PointSize = 80.0 * 0.5 + c;",
        "    }",
        "}",
    ].join("\n");

    var FRAGMENT_SHADER_SOURCE = [
        "precision mediump float;",
        
        "uniform sampler2D texture;",

        "varying float vAge;",
        "varying float vActive;",
        "varying float vType;",
        "varying float vAngle;",
        "varying mat3 vUvMat;",

        "void main(void) {",
        "    if (vActive < 0.5) discard;",

        "    vec3 buv = vec3(gl_PointCoord.x, gl_PointCoord.y, 1.0);",
        "    vec3 uv = vUvMat * buv;",
        "    float c = sin(vAge * 6200.0) * 0.12;",
        "    vec4 light = vec4(0.0, c, 0.0, 0.0);",
        "    gl_FragColor = light + texture2D(texture, vec2((uv.x + vType) * 0.0625, uv.y));",
        "}",
    ].join("\n");

})();