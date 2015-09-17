phina.namespace(function() {

  phina.define("glb.AutoAim", {
    superClass: "phina.accessory.Accessory",

    maxAngularVelocity: 0,

    aimTarget: null,

    init: function(maxAngularVelocity) {
      this.superInit();

      this.maxAngularVelocity = maxAngularVelocity || Infinity;

      var self = this;
      this.on("attached", function() {
        this.target.lockOnTo = function(obj) {
          self.aimTarget = obj;
        };
      });
    },

    update: function(app) {
      if (this.aimTarget == null) return;

      var self = this.target;
      var target = this.aimTarget;

      if (self.needsUpdate) {
        self.updateMatrix();
      }
      if (target.needsUpdate) {
        target.updateMatrix();
      }

      var to = target.position.clone();
      to = self.worldToLocal(to);
      to = to.sub(self.position);

      self.setRotationZ(Math.atan2(to.y, to.x) - 90 * Math.DEG_TO_RAD);

      self.needsUpdate = true;
    },

  });

});
