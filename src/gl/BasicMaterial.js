(function() {

    tm.define("glb.BasicMaterial", {

        program: null,

        attributes: null,
        uniforms: null,

        color: null,

        image: null,
        _texture: null,

        init: function(image) {
            this.color = vec4.set(vec4.create(), 1, 1, 1, 1);
            this.image = image;
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

        initialize: function(glContext) {
            this._createProgram(glContext);
            if (this.image) {
                this._createTexture(glContext);
            }
        },

        _createProgram: function(glContext) {
            var gl = glContext.gl;
            var vs = this._createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
            var fs = this._createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
            this.program = gl.createProgram();
            gl.attachShader(this.program, vs);
            gl.attachShader(this.program, fs);
            gl.linkProgram(this.program);
            if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
                throw new Error(gl.getProgramInfoLog(this.program));
            }

            this.attributes = ATTRIBUTES.reduce(function(attributes, attr) {
                attributes[attr.name] = {
                    name: attr.name,
                    size: attr.size,
                    location: gl.getAttribLocation(this.program, attr.name),
                };
                return attributes;
            }.bind(this), {});

            this.uniforms = UNIFORMS.reduce(function(uniforms, uni) {
                uniforms[uni.name] = {
                    name: uni.name,
                    type: uni.type,
                    location: gl.getUniformLocation(this.program, uni.name),
                };
                return uniforms;
            }.bind(this), {});

            return this;
        },
        _createShader: function(gl, type, source) {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source)
            gl.compileShader(shader);
            if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                return shader;
            } else {
                console.error(gl.getShaderInfoLog(shader));
            }
        },

        _createTexture: function(glContext) {
            this._texture = glContext.createTexture(this.image);
        },

        setProgram: function(glContext) {
            var gl = glContext.gl;
            gl.useProgram(this.program);
        },

        setAttributes: function(glContext, attributeValues) {
            var gl = glContext.gl;
            var attributes = this.attributes;

            Object.keys(this.attributes).forEach(function(name) {
                var attr = attributes[name];

                if (attributeValues[name]) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, attributeValues[name]);
                    gl.enableVertexAttribArray(attr.location);
                    gl.vertexAttribPointer(attr.location, attr.size, gl.FLOAT, false, 0, 0);
                }
            });

            if (this.image) {
                gl.bindTexture(gl.TEXTURE_2D, this._texture);
            } else {
                gl.bindTexture(gl.TEXTURE_2D, null);
            }
        },

        setUniforms: function(glContext, uniformValues) {
            var gl = glContext.gl;
            var self = this;
            var uniforms = this.uniforms;

            this.setUniform(glContext, "color", this.color);
            this.setUniform(glContext, "useTexture", this.image ? 1 : 0);

            Object.keys(this.uniforms).forEach(function(name) {
                var attr = uniforms[name];

                if (uniformValues[name]) {
                    self.setUniform(glContext, name, uniformValues[name]);
                }
            });
        },

        setUniform: function(glContext, name, value) {
            var gl = glContext.gl;

            var uni = this.uniforms[name];
            
            if (value.array) {
                value = value.array;
            }

            if (uni) {
                switch (uni.type) {
                    case "float":
                        gl.uniform1f(uni.location, value);
                        break;
                    case "int":
                        gl.uniform1i(uni.location, value);
                        break;
                    case "vec2":
                        gl.uniform2fv(uni.location, value);
                        break;
                    case "vec3":
                        gl.uniform3fv(uni.location, value);
                        break;
                    case "vec4":
                        gl.uniform4fv(uni.location, value);
                        break;
                    case "mat3":
                        gl.uniformMatrix3fv(uni.location, false, value);
                        break;
                    case "mat4":
                        gl.uniformMatrix4fv(uni.location, false, value);
                        break;
                }
            }
        },

        draw: function(glContext, length) {
            var gl = glContext.gl;
            gl.drawElements(gl.TRIANGLES, length, gl.UNSIGNED_SHORT, 0);
        },

    });

    var ATTRIBUTES = [{
        name: "vertex",
        size: 3,
    }, {
        name: "uv",
        size: 2,
    }, ];

    var UNIFORMS = [{
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
