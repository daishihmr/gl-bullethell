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

  _setupProjectionMatrix: function() {
    return glb.Matrix4().ortho(
      this.left,
      this.right,
      this.bottom,
      this.top,
      this.near,
      this.far
    );
  },

});
