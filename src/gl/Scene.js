(function() {

  phina.define("glb.Scene", {
    superClass: "phina.app.Scene",

    light: null,

    init: function() {
      this.superInit();
      this.light = {
        lightDirection: glb.Vector3(1.0, 1.0, 1.0).normalize(),
        lightColor: phina.graphics.Color(255, 255, 255, 1.0),
        ambientColor: phina.graphics.Color(50, 50, 50, 1.0),
      };
    },

  });

})();
