phina.namespace(function() {

  phina.define("glb.L3pAsset", {
    superClass: "phina.asset.Asset",

    init: function() {
      this.superInit();
      this._meshList = null;
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

            var flows = self._meshList.map(function(mesh) {
              var img = mesh.material.image;
              if (img) {
                return phina.util.Flow(function(ok) {
                  img.src = img._src;
                  delete img._src;
                  img.onload = function() {
                    ok();
                  };
                });
              } else {
                return phina.util.Flow.resolve();
              }
            });
            phina.util.Flow.all(flows).then(function() {
              resolve(self);
            });
          }
        }
      };
      xhr.send(null);
    },

    parse: function(jsonString) {
      var json = JSON.parse(jsonString);
      this._meshList = glb.L3pAsset.create(json.geometries, json.textures);
    },

    get: function() {
      var result = glb.Object3D();
      this._meshList.forEach(function(mesh) {
        result.push(mesh.clone());
      });
      return result;
    },

    _static: {
      create: function(geometries, textures) {
        return geometries.map(function(g) {
          var m = g.texture;

          var geometry = glb.Geometry();
          geometry.positionData = g.vertices;
          geometry.normalData = g.normals;
          geometry.uvData = g.texCoords;
          geometry.indexData = g.indices;

          var amb = m.ambient;
          var dif = m.diffuse;
          var r = (amb[0] + dif[0]) * 255 / 2;
          var g = (amb[1] + dif[1]) * 255 / 2;
          var b = (amb[2] + dif[2]) * 255 / 2;
          var a = (amb[3] + dif[3]) / 2;

          var image = null;
          if (m.src) {
            image = new Image();
            image._src = m.src;
          }

          return glb.Mesh(geometry, glb.PhongMaterial({
            color: phina.util.Color(r, g, b, a),
            image: image,
          }));
        });
      },
    },

  });

});
