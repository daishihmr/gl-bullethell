(function() {

    tm.define("glb.PhongMaterial", {
        superClass: "glb.BasicMaterial",

        init: function(param) {
            this.superInit(param);
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
    });

    var DEFAULT_PARAM = {
        color: tm.graphics.Color(255, 255, 255, 1),
        image: null,
    };

    var ATTRIBUTE_META_DATA = [{
        name: "position",
        size: 3,
    }, {
        name: "normal",
        size: 3,
    }, {
        name: "uv",
        size: 2,
    }, {
        name: "vertexColor",
        size: 4,
    }, ];

    var UNIFORM_META_DATA = [{
        name: "mMatrix",
        type: "mat4",
    }, {
        name: "vpMatrix",
        type: "mat4",
    }, {
        name: "invMatrix",
        type: "mat4",
    }, {
        name: "texture",
        type: "texture",
    }, {
        name: "color",
        type: "color",
    }, {
        name: "useTexture",
        type: "int",
    }, {
        name: "lightDirection",
        type: "vec3",
    }, {
        name: "lightColor",
        type: "color",
    }, {
        name: "ambientColor",
        type: "color",
    }, ];

    var VERTEX_SHADER_SOURCE = [
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "attribute vec4 vertexColor;",

        "uniform mat4 mMatrix;",
        "uniform mat4 vpMatrix;",
        "uniform vec4 color;",
        "uniform mat4 invMatrix;",

        "uniform vec3 lightDirection;",
        "uniform vec4 lightColor;",
        "uniform vec4 ambientColor;",

        "varying vec2 vUv;",
        "varying vec4 vColor;",

        "void main(void) {",
        "    vUv = uv;",

        "    vec3 invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;",
        "    float d = clamp(dot(normal, invLight), 0.1, 1.0);",
        "    vec4 dColor = lightColor * vec4(vec3(d), 1.0);",
        "    vColor = clamp(color * vertexColor * (dColor + ambientColor), 0.0, 1.0);",

        "    gl_Position = vpMatrix * mMatrix * vec4(position, 1.0);",
        "}",
    ].join("\n");

    var FRAGMENT_SHADER_SOURCE = [
        "precision mediump float;",

        "uniform sampler2D texture;",
        "uniform int useTexture;",

        "varying vec2 vUv;",
        "varying vec4 vColor;",

        "void main(void) {",
        "    if (bool(useTexture)) {",
        "        gl_FragColor = vColor * texture2D(texture, vUv);",
        "    } else {",
        "        gl_FragColor = vColor;",
        "    }",
        "}",
    ].join("\n");

})();
