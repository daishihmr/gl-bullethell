(function() {

  phina.define("glb.Face4", {
    init: function() {
      this.setUvA(0, 0);
      this.setUvB(0, 0);
      this.setUvC(0, 0);
      this.setUvD(0, 0);
      this.setFaceColor(1, 1, 1, 1);
    },

    split: function() {
      var a = glb.Face();
      a.positionA = this.positionA;
      a.positionB = this.positionB;
      a.positionC = this.positionC;
      a.normalA = this.normalA;
      a.normalB = this.normalB;
      a.normalC = this.normalC;
      a.uvA = this.uvA;
      a.uvB = this.uvB;
      a.uvC = this.uvC;
      a.vertexColorA = this.vertexColorA;
      a.vertexColorB = this.vertexColorB;
      a.vertexColorC = this.vertexColorC;

      var b = glb.Face();
      b.positionA = this.positionA;
      b.positionB = this.positionC;
      b.positionC = this.positionD;
      b.normalA = this.normalA;
      b.normalB = this.normalC;
      b.normalC = this.normalD;
      b.uvA = this.uvA;
      b.uvB = this.uvC;
      b.uvC = this.uvD;
      b.vertexColorA = this.vertexColorA;
      b.vertexColorB = this.vertexColorC;
      b.vertexColorC = this.vertexColorD;

      return [a, b];
    },

    setMaterialIndex: function(num) {
      this.materialIndex = num;
    },

    setPositionIndex: function(i, x, y, z) {
      switch (i) {
        case 0:
          return this.setPositionA(x, y, z);
        case 1:
          return this.setPositionB(x, y, z);
        case 2:
          return this.setPositionC(x, y, z);
        case 3:
          return this.setPositionD(x, y, z);
      }
    },
    setPositionA: function(x, y, z) {
      this.positionA = [x, y, z];
      return this;
    },
    setPositionB: function(x, y, z) {
      this.positionB = [x, y, z];
      return this;
    },
    setPositionC: function(x, y, z) {
      this.positionC = [x, y, z];
      return this;
    },
    setPositionD: function(x, y, z) {
      this.positionD = [x, y, z];
      return this;
    },

    setNormalIndex: function(i, x, y, z) {
      switch (i) {
        case 0:
          return this.setNormalA(x, y, z);
        case 1:
          return this.setNormalB(x, y, z);
        case 2:
          return this.setNormalC(x, y, z);
        case 3:
          return this.setNormalD(x, y, z);
      }
    },
    setNormalA: function(x, y, z) {
      this.normalA = [x, y, z];
      return this;
    },
    setNormalB: function(x, y, z) {
      this.normalB = [x, y, z];
      return this;
    },
    setNormalC: function(x, y, z) {
      this.normalC = [x, y, z];
      return this;
    },
    setNormalD: function(x, y, z) {
      this.normalD = [x, y, z];
      return this;
    },
    setFaceNormal: function(x, y, z) {
      this.normalA = [x, y, z];
      this.normalB = [x, y, z];
      this.normalC = [x, y, z];
      this.normalD = [x, y, z];
      return this;
    },
    calcFaceNormal: function() {
      var a = vec3.set(v3(), this.positionA[0], this.positionA[1], this.positionA[2]);
      var b = vec3.set(v3(), this.positionB[0], this.positionB[1], this.positionB[2]);
      var c = vec3.set(v3(), this.positionC[0], this.positionC[1], this.positionC[2]);
      var ab = vec3.sub(v3(), a, b);
      var ca = vec3.sub(v3(), c, a);
      var cross = vec3.cross(v3(), ab, ca);
      vec3.normalize(cross, cross);
      this.setFaceNormal(cross[0], cross[1], cross[2]);
      return this;
    },

    setUvIndex: function(i, x, y) {
      switch (i) {
        case 0:
          return this.setUvA(x, y);
        case 1:
          return this.setUvB(x, y);
        case 2:
          return this.setUvC(x, y);
        case 3:
          return this.setUvD(x, y);
      }
    },
    setUvA: function(u, v) {
      this.uvA = [u, v];
      return this;
    },
    setUvB: function(u, v) {
      this.uvB = [u, v];
      return this;
    },
    setUvC: function(u, v) {
      this.uvC = [u, v];
      return this;
    },
    setUvD: function(u, v) {
      this.uvD = [u, v];
      return this;
    },

    setVertexColorIndex: function(i, r, g, b, a) {
      switch (i) {
        case 0:
          return this.setVertexColorA(r, g, b, a);
        case 1:
          return this.setVertexColorB(r, g, b, a);
        case 2:
          return this.setVertexColorC(r, g, b, a);
        case 3:
          return this.setVertexColorD(r, g, b, a);
      }
    },
    setVertexColorA: function(r, g, b, a) {
      this.vertexColorA = [r, g, b, a];
      return this;
    },
    setVertexColorB: function(r, g, b, a) {
      this.vertexColorB = [r, g, b, a];
      return this;
    },
    setVertexColorC: function(r, g, b, a) {
      this.vertexColorC = [r, g, b, a];
      return this;
    },
    setVertexColorD: function(r, g, b, a) {
      this.vertexColorD = [r, g, b, a];
      return this;
    },
    setFaceColor: function(r, g, b, a) {
      this.vertexColorA = [r, g, b, a];
      this.vertexColorB = [r, g, b, a];
      this.vertexColorC = [r, g, b, a];
      this.vertexColorD = [r, g, b, a];
      return this;
    },

    getVertex: function(i) {
      switch (i) {
        case 0:
          return this.getVertexA();
        case 1:
          return this.getVertexB();
        case 2:
          return this.getVertexC();
        case 3:
          return this.getVertexD();
      }
    },
    getVertexA: function() {
      return {
        materialIndex: this.materialIndex,
        position: this.positionA,
        normal: this.normalA,
        uv: this.uvA,
        vertexColor: this.vertexColorA,
      };
    },
    getVertexB: function() {
      return {
        materialIndex: this.materialIndex,
        position: this.positionB,
        normal: this.normalB,
        uv: this.uvB,
        vertexColor: this.vertexColorB,
      };
    },
    getVertexC: function() {
      return {
        materialIndex: this.materialIndex,
        position: this.positionC,
        normal: this.normalC,
        uv: this.uvC,
        vertexColor: this.vertexColorC,
      };
    },
    getVertexD: function() {
      return {
        materialIndex: this.materialIndex,
        position: this.positionD,
        normal: this.normalD,
        uv: this.uvD,
        vertexColor: this.vertexColorD,
      };
    },

    translate: function(v) {
      vec3.add(this.positionA, this.positionA, v);
      vec3.add(this.positionB, this.positionB, v);
      vec3.add(this.positionC, this.positionC, v);
      vec3.add(this.positionD, this.positionD, v);
    },

  });

  var v3 = vec3.create;

})();
