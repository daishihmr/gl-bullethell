phina.namespace(function() {

  phina.define("glb.Light", {
    superClass: "phina.app.Element",

    lightDirection: null,
    lightColor: null,
    ambientColor: null,

    init: function() {
      this.superInit();
      this.lightDirection = glb.Vector3(0.0, -1.0, 1.0).normalize();
      this.lightColor = phina.util.Color(250, 250, 250, 1.0);
      this.ambientColor = phina.util.Color(20, 20, 20, 1.0);
    },

    _accessor: {
      directionX: {
        get: function() {
          return this.lightDirection.x;
        },
        set: function(v) {
          this.lightDirection.x = v;
        }
      },
      directionY: {
        get: function() {
          return this.lightDirection.y;
        },
        set: function(v) {
          this.lightDirection.y = v;
        }
      },
      directionZ: {
        get: function() {
          return this.lightDirection.z;
        },
        set: function(v) {
          this.lightDirection.z = v;
        }
      },
      colorR: {
        get: function() {
          return this.lightColor.r;
        },
        set: function(v) {
          this.lightColor.r = v;
        }
      },
      colorG: {
        get: function() {
          return this.lightColor.g;
        },
        set: function(v) {
          this.lightColor.g = v;
        }
      },
      colorB: {
        get: function() {
          return this.lightColor.b;
        },
        set: function(v) {
          this.lightColor.b = v;
        }
      },
      ambientColorR: {
        get: function() {
          return this.ambientColor.r;
        },
        set: function(v) {
          this.ambientColor.r = v;
        }
      },
      ambientColorG: {
        get: function() {
          return this.ambientColor.g;
        },
        set: function(v) {
          this.ambientColor.g = v;
        }
      },
      ambientColorB: {
        get: function() {
          return this.ambientColor.b;
        },
        set: function(v) {
          this.ambientColor.b = v;
        }
      },
    }
  });

});
