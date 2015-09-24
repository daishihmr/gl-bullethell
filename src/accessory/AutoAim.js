phina.namespace(function() {

  phina.define("glb.AutoAim", {
    superClass: "phina.accessory.Accessory",

    aimTarget: null,

    /** 最大角速度 */
    maxAngleVelocity: 12 * Math.DEG_TO_RAD,

    init: function() {
      this.superInit();

      var self = this;
      this.on("attached", function() {
        this.target.lockOn = function(obj) {
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

      var from = glb.Vector3.Y.clone().transformQuat(self.rotation);
      var to = target.position.clone();
      to = self.worldToLocal(to);
      to = to.sub(self.position).normalize();

      from.z = 0;
      to.z = 0;

      var q = glb.Quat().rotationTo(from, to);
      var angle = q.getAngle();

      if (angle <= this.maxAngleVelocity) {
        self.rotation.mul(q);
        self.needsUpdate = true;
      } else {
        self.rotation.slerp(q, this.maxAngleVelocity / angle);
        self.needsUpdate = true;
      }

    },

  });

});
