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

      var from = glb.Vector3.Y; //.clone().transformQuat(self.rotation);
      var to = glb.Vector3.sub(target.position, self.position).normalize();
      var rot = glb.Quat().rotationTo(from, to);
      
      if (this.maxAngularVelocity != Infinity) {
        var angle = self.rotation.dot(rot);
        var t = Math.abs(this.maxAngularVelocity / angle);
        if (t > 1) {
          self.rotation.copy(rot);
        } else {
          self.rotation.slerp(rot, t);
        }
      } else {
        self.rotation.copy(rot);
      }
      self.needsUpdate = true;
    },

  });

});
