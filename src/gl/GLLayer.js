(function() {

  phina.define("glb.GLLayer", {
    superClass: "phina.display.CanvasElement",

    domElement: null,
    gl: null,
    ext: null,

    screen: null,

    init: function() {
      this.superInit();

      this.domElement = window.document.createElement("canvas");
      this.gl = this.domElement.getContext("webgl", {
        preserveDrawingBuffer: true
      });
      this.ext = this.gl.getExtension("OES_vertex_array_object");
      if (this.ext == null) {
        console.warn("VAOはサポートされてない！");
      }

      var gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clearDepth(1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.CULL_FACE);

      this.setSize(GL_PIXEL_WIDTH, GL_PIXEL_HEIGHT);
    },

    createTexture: function(img, index) {
      index = index || 0;
      var gl = this.gl;

      gl.activeTexture(gl.TEXTURE0 + index);

      var texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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

    render: function(camera, light) {
      var self = this;
      var gl = this.gl;

      if (camera.needsUpdate) {
        camera.updateMatrix();
      }

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      this.children.forEach(function(child) {
        self.renderObj(child, camera.calcVpMatrix(), light, glb.Matrix4());
      });
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

    draw: function(canvas) {
      canvas.context.drawImage(this.domElement, 0, 0, canvas.width, canvas.height);
    },

    setSize: function(width, height) {
      this.width = this.domElement.width = width;
      this.height = this.domElement.height = height;
      this.gl.viewport(0, 0, width, height);
      return this;
    },

    fitScreen: function(isEver) {
      isEver = isEver === undefined ? true : isEver;

      var _fitFunc = function() {
        var e = this.domElement;
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
          s.width = Math.floor(innerWidth) + "px";
          s.height = Math.floor(innerWidth * rate) + "px";
        } else {
          s.width = Math.floor(innerHeight / rate) + "px";
          s.height = Math.floor(innerHeight) + "px";
        }
      }.bind(this);

      // 一度実行しておく
      _fitFunc();

      // リサイズ時のリスナとして登録しておく
      if (isEver) {
        window.addEventListener("resize", _fitFunc, false);
      }

      return this;
    },

  });

})();
