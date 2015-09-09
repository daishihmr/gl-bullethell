(function() {

  phina.define("glb.MtlAsset", {
    superClass: "phina.util.EventDispatcher",

    init: function() {
      this.superInit();
    },

    load: function(url) {
      this.url = url;

      var self = this;
      var params = {
        url: url,
        success: function(data) {
          self.parse(data);
          self.flare("load");
        }
      };
      phina.util.Ajax.load(params);

      return this;
    },

    parse: function(data) {
      var self = this;
      var lines = data.split("\n");
      lines.forEach(function(line) {});
    },

  });

  var loadMtlFunc = function(path) {
    return glb.MtlAsset().load(path);
  };

  // phina.asset.Loader.register("mtl", loadMtlFunc);

})();
