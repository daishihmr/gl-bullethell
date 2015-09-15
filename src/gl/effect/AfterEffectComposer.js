(function() {

  phina.define("glb.AfterEffectComposer", {

    glLayer: null,

    passes: null,

    init: function(glLayer) {
      this.glLayer = glLayer;
      this.firstPass = glb.FirstPass();
      this.endPass = glb.EndPass();
      this.passes = [];
    },

    addPass: function(renderPass) {
      this.passes.push(renderPass);
    },

    render: function(scene, camera, light) {
      var self = this;
      var glLayer = this.glLayer;

      if (this.passes.length === 0 || this.passes.filter(isEnabled).length === 0) {
        glLayer.attachScreen(null);
        glLayer.render(scene, camera, light);
      } else {
        var endScreen = this.passes.reduce(function(beforeScreen, pass) {
          if (pass.enabled) {
            return pass.render(glLayer, beforeScreen, light);
          } else {
            return beforeScreen;
          }
        }, this.firstPass.render(glLayer, scene, camera, light));

        this.endPass.render(glLayer, endScreen, light);
      }

    },

  });

  var isEnabled = function(pass) {
    return pass.enabled;
  };

})();
