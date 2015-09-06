(function() {

    tm.define("glb.PhongMaterial", {
        superClass: "glb.Material",

        texture: null,
        color: null,

        _image: null,

        init: function(param) {
            this.superInit();

            param = {}.$extend(DEFAULT_PARAM, param);

            this._image = param.image;
            this.color = param.color;
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
        image: null,
        color: tm.graphics.Color(255, 255, 255, 1),
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
        name: "texture",
        type: "texture",
    }, {
        name: "color",
        type: "color",
    }, {
        name: "useTexture",
        type: "int",
    }, ];

    var VERTEX_SHADER_SOURCE = [
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "attribute vec4 vertexColor;",

        "uniform mat4 mMatrix;",
        "uniform mat4 vpMatrix;",
        "uniform vec4 color;",

        "varying vec2 vUv;",
        "varying vec4 vColor;",

        "void main(void) {",
        "    vUv = uv;",
        "    vColor = color;",
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
        "        gl_FragColor = vColor * texture2D(texture, uvTranslate + vUv);",
        "    } else {",
        "        gl_FragColor = vColor;",
        "    }",
        "}",
    ].join("\n");

})();
