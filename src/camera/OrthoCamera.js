phina.define("glb.OrthoCamera", {
  superClass: "glb.Camera",

  init: function(left, right, bottom, top, near, far) {
    this.left = left;
    this.right = right;
    this.bottom = bottom;
    this.top = top;
    this.near = near;
    this.far = far;
    this.superInit();
  },

  _updateProjectionMatrix: function() {
    this.pMatrix.ortho(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  },

});
