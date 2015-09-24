phina.define("glb.BoxGeometry", {
  superClass: "glb.Geometry",

  position: null,
  uv: null,
  index: null,

  init: function(w, h, d) {
    this.superInit();

    w = w || 1;
    h = h || w;
    d = d || w;

    w *= 0.5;
    h *= 0.5;
    d *= 0.5;

    var geometry = glb.GeometryBuilder()
      .addFace(
        glb.Face4()
        .setPositionA(-w, h, -d)
        .setPositionB(-w, -h, -d)
        .setPositionC(-w, -h, d)
        .setPositionD(-w, h, d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .addFace(
        glb.Face4()
        .setPositionA(-w, h, d)
        .setPositionB(-w, -h, d)
        .setPositionC(w, -h, d)
        .setPositionD(w, h, d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .addFace(
        glb.Face4()
        .setPositionA(w, h, d)
        .setPositionB(w, -h, d)
        .setPositionC(w, -h, -d)
        .setPositionD(w, h, -d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .addFace(
        glb.Face4()
        .setPositionA(w, h, -d)
        .setPositionB(w, -h, -d)
        .setPositionC(-w, -h, -d)
        .setPositionD(-w, h, -d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .addFace(
        glb.Face4()
        .setPositionA(-w, h, -d)
        .setPositionB(-w, h, d)
        .setPositionC(w, h, d)
        .setPositionD(w, h, -d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .addFace(
        glb.Face4()
        .setPositionA(-w, -h, d)
        .setPositionB(-w, -h, -d)
        .setPositionC(w, -h, -d)
        .setPositionD(w, -h, d)
        .setUvA(0, 1)
        .setUvB(0, 0)
        .setUvC(1, 0)
        .setUvD(1, 1)
      )
      .calcFaceNormals()
      .build();

    this.$extend(geometry);
  },

  build: function(glLayer) {
    var gl = glLayer.gl;
    this.position = this.createVbo(gl, this.positionData);
    this.normal = this.createVbo(gl, this.normalData);
    this.uv = this.createVbo(gl, this.uvData);
    this.vertexColor = this.createVbo(gl, this.vertexColorData);
    this.index = this.createIbo(gl, this.indexData);
  },

});
