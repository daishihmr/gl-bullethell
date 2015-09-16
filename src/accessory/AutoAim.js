phina.namespace(function() {

  phina.define("glb.AutoAim", {
    superClass: "phina.accessory.Accessory",

    maxAngularVelocity: Infinity,
    
    aimTarget: null,

    init: function() {
      this.superInit();
    },

    update: function(app) {
    },

  });

});
