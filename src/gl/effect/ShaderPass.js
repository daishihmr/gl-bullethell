(function() {

  phina.define("glb.ShaderPass", {

    isBuilt: false,

    screen: null,
    scene: null,
    camera: null,

    rect: null,

    enabled: true,

    init: function(shader) {
      shader = shader || glb.DefaultShader();

      this.screen = glb.Screen();

      this.scene = phina.app.Scene();
      this.camera = glb.OrthoCamera(-0.5, 0.5, -0.5, 0.5, 1, 20);

      this.rect = glb.Mesh(
        glb.PlaneGeometry(1),
        glb.ScreenTextureMaterial(shader)
      ).addChildTo(this.scene);
    },

    render: function(glContext, beforeScreen) {
      if (!this.isBuilt && this.screen) {
        this.screen.build(glContext);
        this.isBuilt = true;
      }

      this.rect.material.texture = beforeScreen.texture;
      glContext.attachScreen(this.screen);
      glContext.render(this.scene, this.camera);
      return this.screen;
    },

  });
})();
