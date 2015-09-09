phina.define("glb.FirstPass", {

  screen: null,
  isBuilt: false,

  init: function() {
    this.screen = glb.Screen();
  },

  render: function(glContext, scene, camera, light) {
    if (!this.isBuilt) {
      this.screen.build(glContext);
      this.isBuilt = true;
    }

    glContext.attachScreen(this.screen);
    glContext.render(scene, camera, light);
    return this.screen;
  }
});
