(function() {

  phina.define("glb.GeometryBuilder", {

    init: function() {
      this.faces = [];
      this.transform = glb.Matrix4();
    },

    addFace: function(face) {
      this.faces.push(face);
      return this;
    },

    calcFaceNormals: function() {
      this.faces.forEach(function(face) {
        face.calcFaceNormal();
      });
      return this;
    },
    
    setOriginToCenter: function() {
      var sum = vec3.create();
      var count = 0;

      var faces = this.faces.map(function(f) {
        if (f instanceof glb.Face) return f;
        else return f.split();
      }).flatten();
      
      faces.forEach(function(face, fi) {
        if (face.positionA == null || face.positionB == null || face.positionC == null) {
          console.error(face);
          throw new Error("faceの頂点が欠けてる(" + fi + ")");
        }
        (3).times(function(i) {
          var v = face.getVertex(i);
          vec3.add(sum, sum, v.position);
          count += 1;
        });
      });
      
      if (count == 0) return;
      
      vec3.scale(sum, sum, 1 / count);
      vec3.scale(sum, sum, -1);
      this.faces.forEach(function(face) {
        face.translate(sum);
      });
    },
    
    setTransform: function(transform) {
      this.transform = transform;
    },

    build: function() {
      var self = this;
      var geo = glb.Geometry();

      var vertices = [];
      var hashList = [];
      var indices = [];

      var faces = this.faces.map(function(f) {
        if (f instanceof glb.Face) return f;
        else return f.split();
      }).flatten();

      faces.forEach(function(face, fi) {
        if (face.positionA == null || face.positionB == null || face.positionC == null) {
          console.error(face);
          throw new Error("faceの頂点が欠けてる(" + fi + ")");
        }
        (3).times(function(i) {
          var v = face.getVertex(i);
          var h = hash(v);

          var index = hashList.indexOf(h);
          if (index < 0) {
            index = vertices.length;
            vertices.push(v);
            hashList.push(h);
          }

          indices.push(index);
        });
      });

      geo.materialIndexData = new Float32Array(
        vertices.map(function(v) {
          return v.materialIndex;
        }).flatten()
      );
      geo.positionData = new Float32Array(
        vertices.map(function(v) {
          vec3.transformMat4(v.position, v.position, self.transform.array);
          return v.position;
        }).flatten()
      );
      geo.normalData = new Float32Array(
        vertices.map(function(v) {
          return v.normal;
        }).flatten()
      );
      geo.uvData = new Float32Array(
        vertices.map(function(v) {
          return v.uv;
        }).flatten()
      );
      geo.vertexColorData = new Float32Array(
        vertices.map(function(v) {
          return v.vertexColor;
        }).flatten()
      );
      geo.indexData = new Int16Array(indices);

      return geo;
    },

  });

  var hash = function(vertex) {
    var result = 1;
    var prime = 31;
    result = prime * ~~result + vertex.materialIndex;
    result = prime * ~~result + (vertex.position[0] * 1000);
    result = prime * ~~result + (vertex.position[1] * 1000);
    result = prime * ~~result + (vertex.position[2] * 1000);
    result = prime * ~~result + (vertex.normal[0] * 1000);
    result = prime * ~~result + (vertex.normal[1] * 1000);
    result = prime * ~~result + (vertex.normal[2] * 1000);
    result = prime * ~~result + (vertex.uv[0] * 1000);
    result = prime * ~~result + (vertex.uv[1] * 1000);
    result = prime * ~~result + (vertex.vertexColor[0] * 1000);
    result = prime * ~~result + (vertex.vertexColor[1] * 1000);
    result = prime * ~~result + (vertex.vertexColor[2] * 1000);
    result = prime * ~~result + (vertex.vertexColor[3] * 1000);
    return "" + result;
  };

})();
