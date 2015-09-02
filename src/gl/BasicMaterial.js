(function() {

    tm.define("glb.BasicMaterial", {

        program: null,

        attributes: null,
        uniforms: null,
        
        image: null,
        _texture: null,

        init: function(image) {
            this.image = image;
        },
        
        initialize: function(glContext) {
            this.createProgram(glContext);
            this.createTexture(glContext);
        },

        createProgram: function(glContext) {
            var gl = glContext.gl;
            var vs = this._createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
            var fs = this._createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
            this.program = this._createProgram(gl, vs, fs);

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
        _createProgram: function(gl, vs, fs) {
            var program = gl.createProgram();
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                gl.useProgram(program);
                return program;
            } else {
                console.error(gl.getProgramInfoLog(program));
            }
        },
        
        createTexture: function(glContext) {
            this._texture = glContext.createTexture(this.image);
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

            gl.bindTexture(gl.TEXTURE_2D, this._texture);
        },
        
        setUniforms: function(glContext, uniformValues) {
            var gl = glContext.gl;
            var self = this;
            var uniforms = this.uniforms;
            
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

            if (uni) {
                switch (uni.type) {
                    case "float":
                        gl.uniform1f(uni.location, value);
                        break;
                    case "int":
                    case "texture":
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
    }, ];

    var VERTEX_SHADER_SOURCE = [
        "attribute vec3 vertex;",
        "attribute vec2 uv;",
        "uniform mat4 mMatrix;",
        "uniform mat4 vpMatrix;",
        "varying vec2 vUv;",

        "void main(void) {",
        "    vUv = uv;",
        "    gl_Position = vpMatrix * mMatrix * vec4(vertex, 1.0);",
        "}",
    ].join("\n");

    var FRAGMENT_SHADER_SOURCE = [
        "precision mediump float;",
        "uniform sampler2D texture;",
        "uniform vec2 uvTranslate;",
        "varying vec2 vUv;",
        "void main(void) {",
        "    gl_FragColor = texture2D(texture, uvTranslate + vUv);",
        "}",
    ].join("\n");

})();
