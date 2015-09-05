(function() {

    tm.define("glb.BlurPass", {
        superClass: "glb.ShaderPass",

        init: function() {
            this.superInit();

            this.previousFrameScreen = glb.Screen();

            this.rect.mixFactor0 = 0.8;
            this.rect.mixFactor1 = 0.8;

            this.rect.mainMaterial = this.rect.material;
            this.rect.mixMaterial = glb.ScreenTextureMaterial(glb.MixShader());

            this.rect.mixMaterial.setTextures = function(glContext) {
                var gl = glContext.gl;

                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, this.texture0);
                gl.uniform1i(this.uniforms["texture0"].location, 0);

                gl.activeTexture(gl.TEXTURE1);
                gl.bindTexture(gl.TEXTURE_2D, this.texture1);
                gl.uniform1i(this.uniforms["texture1"].location, 1);
            };

            this.rect.build = function(glContext) {
                var gl = glContext.gl;
                var ext = glContext.ext;

                this.geometry.build(glContext);

                this.mainMaterial.build(glContext);
                this.mixMaterial.build(glContext);
                if (ext !== null) {
                    this.mainMaterial.setVao(glContext);
                    this.mainMaterial.setAttributes(glContext, this.geometry);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
                    this.mainMaterial.unsetVao(glContext);

                    this.mixMaterial.setVao(glContext);
                    this.mixMaterial.setAttributes(glContext, this.geometry);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.geometry.index);
                    this.mixMaterial.unsetVao(glContext);
                }
            };
        },

        render: function(glContext, beforeScreen) {
            if (!this.isBuilt) {
                this.screen.build(glContext);
                this.previousFrameScreen.build(glContext);
                this.isBuilt = true;
            }

            // 前のフレームと今回のフレームをミックスしてscreenに描画
            this.rect.material = this.rect.mixMaterial;
            this.rect.material.texture0 = this.previousFrameScreen.texture;
            this.rect.material.texture1 = beforeScreen.texture;
            glContext.attachScreen(this.screen);
            glContext.render(this.scene, this.camera);

            // 描画したやつをpreviousFrameScreenに描画（次回使う）
            this.rect.material = this.rect.mainMaterial;
            this.rect.material.texture = this.screen.texture;
            glContext.attachScreen(this.previousFrameScreen);
            glContext.render(this.scene, this.camera);

            return this.screen;
        },

    });

})();
