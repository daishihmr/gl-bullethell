phina.define("glb.PerspectiveCamera", {
  superClass: "glb.Camera",

  init: function(fovy, aspect, near, far) {
    this.fovy = fovy;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.superInit();
  },

  _updateProjectionMatrix: function() {
    this.pMatrix.perspective(
      this.fovy,
      this.aspect,
      this.near,
      this.far
    );
  },
  
});