(function() {

    tm.define("glb.MtlAsset", {
        superClass: "tm.event.EventDispatcher",

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
            tm.util.Ajax.load(params);

            return this;
        },

        parse: function(data) {
            var self = this;
            var lines = data.split("\n");
            lines.forEach(function(line) {
            });
        },

    });

    var loadMtlFunc = function(path) {
        return glb.MtlAsset().load(path);
    };

    tm.asset.Loader.register("mtl", loadMtlFunc);

})();
