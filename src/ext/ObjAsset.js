(function() {

    tm.define("glb.ObjAsset", {
        superClass: "tm.event.EventDispatcher",

        init: function() {
            this.superInit();
            
            this.vertices = [];
            this.faces = [];

            this._normals = [];
            this._texcoords = [];
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
                self.parseLine(line.trim());
            });
        },
        
        parseLine: function(line) {
            var m;
            if (line.length === 0 || line[0] === "#") {
                return;
            } else if (m = line.match(/^mtllib (.+)$/)) {
                var mtlName = m[1];
                var parent = this.url.substring(0, this.url.lastIndexOf("/"));
                var mtlUrl = glb.MtlAsset().load(parent + "/" + mtlName);

                var loader = tm.asset.Loader();
                var p = {};
                p[mtlName] = mtlUrl;
                loader.load(p);
            } else {
                var type = line.substring(0, 2);
                switch (type.trim()) {
                    case "vn":
                        this.parseVn(line.substring(3));
                        return;
                    case "vt":
                        this.parseVt(line.substring(3));
                        return;
                    case "v":
                        this.parseV(line.substring(2));
                        return;
                    case "f":
                        this.parseF(line.substring(2));
                        return;
                }
            }
        },
        
        parseVn: function(data) {
            var values = data.split(" ");
            this._normals.push({
                x: Number(values[0]),
                y: Number(values[1]),
                z: Number(values[2]),
            });
        },

        parseVt: function(data) {
            var values = data.split(" ");
            this._texcoords.push({
                x: Number(values[0]),
                y: Number(values[1]),
            });
        },
        parseV: function(data) {
            var values = data.split(" ");
            this.vertices.push({
                x: Number(values[0]),
                y: Number(values[1]),
                z: Number(values[2]),
            });
        },
        parseF: function(data) {
            var self = this;
            var pattern0 = /^(-?\d+)\/(\d+)\/(\d+)$/;
            var vs = data.split(" ").map(function(v) {
                var m;
                if (m = v.trim().match(pattern0)) {
                    var vi = Number(m[1]);
                    var ti = Number(m[2]);
                    var ni = Number(m[3]);
                    
                    return {
                        index: vi<0 ? self.vertices.length + vi : vi - 1,
                        texcoord: self._texcoords[ti - 1],
                        normal: self._normals[ni - 1],
                    };
                }
            });
            
            this.faces.push({
                a: vs[0],
                b: vs[1],
                c: vs[2],
            });
        },
    });

    var loadObjFunc = function(path) {
        return glb.ObjAsset().load(path);
    };

    tm.asset.Loader.register("obj", loadObjFunc);

})();
