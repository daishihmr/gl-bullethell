(function() {
  
  var deg = Math.DEG_TO_RAD;

  phina.define("glb.Scene", {
    superClass: "phina.display.CanvasScene",

    light: null,

    init: function() {
      this.superInit({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
      });

      var camera = this.camera = glb.PerspectiveCamera(45 * deg, SCREEN_WIDTH / SCREEN_HEIGHT, 100, 10000);
      var distance = SCREEN_HEIGHT * 0.5 / Math.tan(45 * 0.5 * deg);
      camera.position.y = Math.sin(-0.2) * distance * 1.1;
      camera.position.z = Math.cos(-0.2) * distance * 1.1;
      camera.needsUpdate = true;
      // var camera = this.camera = glb.OrthoCamera(
      //     GL_PIXEL_WIDTH * -0.5,
      //     GL_PIXEL_WIDTH * 0.5,
      //     GL_PIXEL_HEIGHT * -0.5,
      //     GL_PIXEL_HEIGHT * 0.5,
      //     100,
      //     10000
      // );

      this.light = {
        lightDirection: glb.Vector3(0.0, -1.0, 1.0).normalize(),
        lightColor: phina.util.Color(255, 255, 255, 1.0),
        ambientColor: phina.util.Color(50, 50, 50, 1.0),
      };

      this.backgroundLayer = phina.display.CanvasElement().addChildTo(this);
      this.glLayer = glb.GLLayer().addChildTo(this);
    },

    projXY: function(camera, tp) {
      var cp = camera.position;
      var sub = glb.Vector3.sub(tp, cp);
      sub.mul(cp.z / (cp.z - tp.z));
      
      return cp.clone().add(sub);
    },

  });

})();
