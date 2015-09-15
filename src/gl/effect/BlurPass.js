(function() {

  phina.define("glb.BlurPass", {
    superClass: "glb.ShaderPass",

    init: function() {
      this.superInit();

      this.previousFrameScreen = glb.Screen();

      this.rect.mixFactor0 = 0.8;
      this.rect.mixFactor1 = 0.8;

      this.rect.mainMaterial = this.rect.material;
      this.rect.mixMaterial = glb.ScreenTextureMaterial(glb.MixShader());

      this.rect.mixMaterial.setTextures = function(glLayer) {
        var gl = glLayer.gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture0);
        gl.uniform1i(this.uniforms["texture0"].location, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texture1);
        gl.uniform1i(this.uniforms["texture1"].location, 1);
      };

      this.rect.build = function(glLayer) {
        var gl = glLayer.gl;
        var ext = glLayer.ext;

        this.geometry.build(glLayer);

        this.mainMaterial.build(glLayer);
        this.mixMaterial.build(glLayer);
        if (ext !== null) {
          this.mainMaterial.setVao(glLayer);
          this.mainMaterial.setAttributes(glLayer, this.geometry);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
          this.mainMaterial.unsetVao(glLayer);

          this.mixMaterial.setVao(glLayer);
          this.mixMaterial.setAttributes(glLayer, this.geometry);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
          this.mixMaterial.unsetVao(glLayer);
        }
      };
    },

    render: function(glLayer, beforeScreen) {
      if (!this.isBuilt) {
        this.screen.build(glLayer);
        this.previousFrameScreen.build(glLayer);
        this.isBuilt = true;
      }

      // 前のフレームと今回のフレームをミックスしてscreenに描画
      this.rect.material = this.rect.mixMaterial;
      this.rect.material.texture0 = this.previousFrameScreen.texture;
      this.rect.material.texture1 = beforeScreen.texture;
      glLayer.attachScreen(this.screen);
      glLayer.render(this.scene, this.camera);

      // 描画したやつをpreviousFrameScreenに描画（次回使う）
      this.rect.material = this.rect.mainMaterial;
      this.rect.material.texture = this.screen.texture;
      glLayer.attachScreen(this.previousFrameScreen);
      glLayer.render(this.scene, this.camera);

      return this.screen;
    },

  });

})();
