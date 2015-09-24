phina.define("glb.FirstPass", {

  screen: null,
  isBuilt: false,

  init: function() {
    this.screen = glb.Screen();
  },

  render: function(glLayer, scene, camera, light) {
    if (!this.isBuilt) {
      this.screen.build(glLayer);
      this.isBuilt = true;
    }

    glLayer.attachScreen(this.screen);
    glLayer.render(scene, camera, light);
    return this.screen;
  }
});
