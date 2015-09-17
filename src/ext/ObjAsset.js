(function() {

  phina.define("glb.ObjAsset", {
    superClass: "phina.asset.Asset",

    geometry: null,
    materials: null,

    init: function() {
      this.superInit();

      this.geometry = null;
      this.materials = null;

      this._vertices = [];
      this._faces = [];
      this._normals = [];
      this._texcoords = [];
      this._materialName = null;
    },

    createMesh: function() {
      return glb.Mesh(
        this.geometry,
        glb.PhongMaterial({
          image: phina.asset.AssetManager.get("image", this.src.key).domElement,
        })
      );
    },

    _load: function(parentResolve) {
      var url = this.src.url;
      var key = this.src.key;
      var self = this;

      var objLoadTask = phina.util.Flow(function(resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if ([200, 201, 0].indexOf(xhr.status) !== -1) {
              self.parse(xhr.responseText);
              self.geometry = self.buildGeometry();
              self.materials = self.buildMaterials();
              resolve();
            }
          }
        };
        xhr.send(null);
      });
      
      var imgLoadTask = phina.util.Flow(function(resolve) {
        var imgUrl = url.replace(/\.obj/, ".png");
        phina.asset.Texture().load(imgUrl).then(function(texture) {
          phina.asset.AssetManager.set("image", key, texture);
          resolve();
        })
      });
      
      phina.util.Flow.all([objLoadTask, imgLoadTask]).then(function() {
        parentResolve(self);
      });
    },

    parse: function(data) {
      var self = this;
      var lines = data.split("\n");
      lines.forEach(function(line) {
        self.parseLine(line.trim());
      });
    },
    buildGeometry: function() {
      var builder = glb.GeometryBuilder();

      var vertices = this._vertices;

      this._faces.forEach(function(f) {
        var face;
        if (f.d) {
          face = glb.Face4();
          [f.a, f.b, f.c, f.d].forEach(function(v, i) {
            var vertex = vertices[v.index];
            face
              .setPositionIndex(i, vertex.x, vertex.y, vertex.z)
              .setNormalIndex(i, v.normal.x, v.normal.y, v.normal.z)
              .setUvIndex(i, v.texcoord.x, v.texcoord.y, v.texcoord.z);
          });
        } else {
          face = glb.Face();
          [f.a, f.b, f.c].forEach(function(v, i) {
            var vertex = vertices[v.index];
            face
              .setPositionIndex(i, vertex.x, vertex.y, vertex.z)
              .setNormalIndex(i, v.normal.x, v.normal.y, v.normal.z)
              .setUvIndex(i, v.texcoord.x, v.texcoord.y, v.texcoord.z);
          });
        }
        builder.addFace(face);
      });

      if (this.src.originToCenter) {
        builder.setOriginToCenter();
      }
      if (this.src.transform) {
        builder.setTransform(this.src.transform);
      }

      return builder.build();
    },
    buildMaterials: function() {},

    parseLine: function(line) {
      var m;
      if (line.length === 0 || line[0] === "#") {
        return;
      } else if (m = line.match(/^usemtl (.+)$/)) {
        this._materialName = m[1];
      } else if (m = line.match(/^mtllib (.+)$/)) {
        // var mtlName = m[1];
        // var parent = this.url.substring(0, this.url.lastIndexOf("/"));
        // var mtlUrl = glb.MtlAsset().load(parent + "/" + mtlName);

        // var loader = phina.asset.Loader();
        // var p = {};
        // p[mtlName] = mtlUrl;
        // loader.load(p);
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
        x: -Number(values[0]),
        y: -Number(values[1]),
        z: -Number(values[2]),
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
      this._vertices.push({
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
            index: vi < 0 ? self._vertices.length + vi : vi - 1,
            texcoord: self._texcoords[ti - 1],
            normal: self._normals[ni - 1],
          };
        }
      });

      if (vs.length == 4) {
        this._faces.push({
          a: vs[0],
          b: vs[1],
          c: vs[2],
          d: vs[3],
          materialName: this._materialName,
        });
      } else if (vs.length == 3) {
        this._faces.push({
          a: vs[0],
          b: vs[1],
          c: vs[2],
          materialName: this._materialName,
        });
      }
    },
  });

  phina.asset.AssetLoader.assetLoadFunctions["wavefront.obj"] = function(key, src) {
    if (typeof src == "string") {
      src = {
        key: key,
        url: src,
      };
    } else {
      src.key = key;
    }
    return glb.ObjAsset().load(src);
  };

})();
