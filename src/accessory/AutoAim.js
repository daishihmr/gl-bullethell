phina.namespace(function() {

  phina.define("glb.AutoAim", {
    superClass: "phina.accessory.Accessory",
    
    enabled: true,

    maxAngularVelocity: Infinity,

    aimTarget: null,

    init: function() {
      this.superInit();
    },

    update: function(app) {
      var self = this.target;
      if (self.updateMatrix && self.needsUpdate) {
        self.updateMatrix();
      }
      if (this.aimTarget.updateMatrix && this.aimTarget.needsUpdate) {
        this.aimTarget.updateMatrix();
      }
      
      
    },

  });

});
