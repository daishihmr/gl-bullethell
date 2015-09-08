(function() {
    
    tm.define("glb.Scene", {
        superClass: "tm.app.Scene",
        
        light: null,
        
        init: function() {
            this.superInit();
            this.light = {
                lightDirection: glb.Vector3(1.0, 1.0, 1.0).normalize(),
                lightColor: tm.graphics.Color(255, 255, 255, 1.0),
                ambientColor: tm.graphics.Color(50, 50, 50, 1.0),
            };
        },

    });
    
})();
