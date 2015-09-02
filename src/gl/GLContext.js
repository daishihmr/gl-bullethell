tm.define("glb.GLContext", {
    
    element: null,
    gl: null,
    vpMatrix: null,

    init: function(canvasId) {
        this.element = window.document.querySelector(canvasId);
        this.gl = this.element.getContext("webgl");
        this.mvpMatrix = mat4.create();

        var gl = this.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.activeTexture(gl.TEXTURE0);
    },

    resize: function(width, height) {
        this.element.width = width;
        this.element.height = height;
        this.gl.viewport(0, 0, width, height);
        return this;
    },

    fitWindow: function(everFlag) {
        var _fitFunc = function() {
            everFlag = everFlag === undefined ? true : everFlag;
            var e = this.element;
            var s = e.style;

            s.position = "absolute";
            s.margin = "auto";
            s.left = "0px";
            s.top = "0px";
            s.bottom = "0px";
            s.right = "0px";

            var rateWidth = e.width / window.innerWidth;
            var rateHeight = e.height / window.innerHeight;
            var rate = e.height / e.width;

            if (rateWidth > rateHeight) {
                s.width = (innerWidth).floor() + "px";
                s.height = (innerWidth * rate).floor() + "px";
            } else {
                s.width = (innerHeight / rate).floor() + "px";
                s.height = (innerHeight).floor() + "px";
            }
        }.bind(this);

        // 一度実行しておく
        _fitFunc();
        // リサイズ時のリスナとして登録しておく
        if (everFlag) {
            window.addEventListener("resize", _fitFunc, false);
        }
        
        return this;
    },

    createVbo: function(data) {
        var gl = this.gl;
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    },

    createIbo: function(data) {
        var gl = this.gl;
        var ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        return ibo;
    },
    
    createTexture: function(img) {
        var gl = this.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    },
    
    render: function(scene, camera) {
        var gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.renderObj(scene, camera.calcVpMatrix());
        gl.flush();
    },
    renderObj: function(obj, vpMatrix) {
        if (!obj.isInitialized) {
            obj.initialize && obj.initialize(this);
            obj.isInitialized = true;
        }
        if (obj.render) {
            obj.render(this, vpMatrix);
        }
        obj.children.forEach(function(child) {
            this.renderObj(child, vpMatrix);
        }.bind(this));
    },

});
