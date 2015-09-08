tm.define("glb.GLContext", {

    element: null,
    gl: null,
    ext: null,

    screen: null,

    init: function(canvasId) {
        this.element = window.document.querySelector(canvasId);
        this.gl = this.element.getContext("webgl", {
            preserveDrawingBuffer: true
        });
        this.ext = this.gl.getExtension("OES_vertex_array_object");
        if (this.ext == null) {
            console.warn("VAOはサポートされてない！");
        }

        var gl = this.gl;
        gl.clearColor(0, 0, 0, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    },
    
    resize: function(width, height) {
        this.width = this.element.width = width;
        this.height = this.element.height = height;
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

    createTexture: function(img, index) {
        index = index || 0;
        var gl = this.gl;

        gl.activeTexture(gl.TEXTURE0 + index);

        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return texture;
    },

    attachScreen: function(screen) {
        var gl = this.gl;
        
        this.screen = screen;

        if (screen) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, screen.frameBuffer);
            gl.viewport(0, 0, screen.width, screen.height);
        } else {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.viewport(0, 0, this.width, this.height);
        }

        return this;
    },
    
    build: function(scene) {
        this.buildObj(scene);
    },
    buildObj: function(obj) {
        var self = this;
        if (!obj.isBuilt) {
            obj.build && obj.build(this);
            obj.isBuilt = true;
        }
        obj.children.forEach(function(child) {
            self.buildObj(child);
        });
    },

    render: function(scene, camera, lightDirection, ambientColor) {
        var gl = this.gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        this.renderObj(scene, camera.calcVpMatrix(), lightDirection, ambientColor);
        gl.flush();
    },
    renderObj: function(obj, vpMatrix, light) {
        var self = this;
        if (!obj.isBuilt) {
            obj.build && obj.build(this);
            obj.isBuilt = true;
        }
        if (obj.render && obj.visible) {
            obj.render(this, vpMatrix, light);
        }
        obj.children.forEach(function(child) {
            self.renderObj(child, vpMatrix, light);
        });
    },

});
