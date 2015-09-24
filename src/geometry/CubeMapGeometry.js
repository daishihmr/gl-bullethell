phina.define("glb.CubeMapGeometry", {
  superClass: "glb.Geometry",

  position: null,
  uv: null,
  index: null,

  init: function(w) {
    this.superInit();

    w = w || 1;
    var h = w;
    var d = w;

    w *= 0.5;
    h *= 0.5;
    d *= 0.5;

    var geometry = glb.GeometryBuilder()
      .addFace(
        // 左
        glb.Face4()
        .setPositionA(-w, +h, -d)
        .setPositionB(-w, -h, -d)
        .setPositionC(-w, -h, +d)
        .setPositionD(-w, +h, +d)
        .setUvA(0 * 0.25, 3 * 0.25)
        .setUvB(0 * 0.25, 2 * 0.25)
        .setUvC(1 * 0.25, 2 * 0.25)
        .setUvD(1 * 0.25, 3 * 0.25)
        .reverse()
      )
      .addFace(
        // 手前
        glb.Face4()
        .setPositionA(-w, +h, +d)
        .setPositionB(-w, -h, +d)
        .setPositionC(+w, -h, +d)
        .setPositionD(+w, +h, +d)
        .setUvA(1 * 0.25, 3 * 0.25)
        .setUvB(1 * 0.25, 2 * 0.25)
        .setUvC(2 * 0.25, 2 * 0.25)
        .setUvD(2 * 0.25, 3 * 0.25)
        .reverse()
      )
      .addFace(
        // 右
        glb.Face4()
        .setPositionA(+w, +h, +d)
        .setPositionB(+w, -h, +d)
        .setPositionC(+w, -h, -d)
        .setPositionD(+w, +h, -d)
        .setUvA(2 * 0.25, 3 * 0.25)
        .setUvB(2 * 0.25, 2 * 0.25)
        .setUvC(3 * 0.25, 2 * 0.25)
        .setUvD(3 * 0.25, 3 * 0.25)
        .reverse()
      )
      .addFace(
        // 奥
        glb.Face4()
        .setPositionA(+w, +h, -d)
        .setPositionB(+w, -h, -d)
        .setPositionC(-w, -h, -d)
        .setPositionD(-w, +h, -d)
        .setUvA(3 * 0.25, 3 * 0.25)
        .setUvB(3 * 0.25, 2 * 0.25)
        .setUvC(4 * 0.25, 2 * 0.25)
        .setUvD(4 * 0.25, 3 * 0.25)
        .reverse()
      )
      .addFace(
        // 上
        glb.Face4()
        .setPositionA(-w, +h, -d)
        .setPositionB(-w, +h, +d)
        .setPositionC(+w, +h, +d)
        .setPositionD(+w, +h, -d)
        .setUvA(1 * 0.25, 4 * 0.25)
        .setUvB(1 * 0.25, 3 * 0.25)
        .setUvC(2 * 0.25, 3 * 0.25)
        .setUvD(2 * 0.25, 4 * 0.25)
        .reverse()
      )
      .addFace(
        // 底
        glb.Face4()
        .setPositionA(-w, -h, +d)
        .setPositionB(-w, -h, -d)
        .setPositionC(+w, -h, -d)
        .setPositionD(+w, -h, +d)
        .setUvA(1 * 0.25, 2 * 0.25)
        .setUvB(1 * 0.25, 1 * 0.25)
        .setUvC(2 * 0.25, 1 * 0.25)
        .setUvD(2 * 0.25, 2 * 0.25)
        .reverse()
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