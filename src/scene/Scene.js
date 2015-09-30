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

      var fov = 30 * deg;
      var posAngleX = -30 * deg;
      var camera = this.camera = glb.PerspectiveCamera(fov, SCREEN_WIDTH / SCREEN_HEIGHT, 100, 20000);
      var distance = SCREEN_HEIGHT * 0.5 / Math.tan(fov * 0.5);
      camera.position.y = Math.sin(posAngleX) * distance * 1.1;
      camera.position.z = Math.cos(posAngleX) * distance * 1.1;
      camera.needsUpdate = true;

      this.light = glb.Light().addChildTo(this);

      this.backgroundLayer = phina.display.CanvasElement().addChildTo(this);
      this.glLayer = glb.GLLayer().addChildTo(this);
    },

    projXY: function(position) {
      var cp = this.camera.position;
      var sub = glb.Vector3.sub(position, cp);
      sub.mul(cp.z / (cp.z - position.z));

      return cp.clone().add(sub);
    },

  });

})();
