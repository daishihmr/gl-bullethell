phina.namespace(function() {

  phina.define("glb.L3cAsset", {
    superClass: "phina.asset.Asset",

    init: function() {
      this.superInit();
      this._orig = null;
    },

    _load: function(resolve) {
      var self = this;
      var url = this.src;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          if ([200, 201, 0].indexOf(xhr.status) !== -1) {
            self.parse(xhr.responseText);
            resolve(self);
          }
        }
      };
      xhr.send(null);
    },

    parse: function(jsonString) {
      var json = JSON.parse(jsonString);
      var obj = glb.L3cAsset.create(json.geometries, json.textures);
    },

    get: function() {
      return this._orig.clone();
    },

    _static: {
      create: function(geometries, textures) {
      }
    },

  });

});
