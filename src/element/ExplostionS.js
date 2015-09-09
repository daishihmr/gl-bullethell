phina.define("glb.ExplosionS", {
  superClass: "phina.app.Element",

  particleSystem: null,
  position: null,
  emitParFrame: 0,
  param: null,

  init: function(particleSystem, frameIndex) {
    this.superInit();
    if (frameIndex === undefined) frameIndex = 2;

    this.particleSystem = particleSystem;
    this.position = glb.Vector2();
    this.emitParFrame = 20;

    this.param = {
      ttl: 20 * 0.0001,
      sizeFrom: 100,
      sizeTo: 130,
      frameIndex: 2,
      colorFrom: phina.graphics.Color(255, 255, 255, 0.2),
      colorTo: phina.graphics.Color(255, 255, 255, 0.0),
    };

    phina.app.Element().addChildTo(this).tweener
      .to({
        emitParFrame: 0
      }, 30, "easeOutQuad")
      .call(function() {
        this.remove();
      }.bind(this));
  },
  update: function() {

    var particleSystem = this.particleSystem;
    var param = this.param;
    var p = this.position;

    this.emitParFrame.times(function() {
      param.velocityFrom = glb.Vector2().fromAngleLength(Math.randf(0, Math.PI * 2), Math.randf(0.5, 6));
      param.velocityTo = param.velocityFrom.clone().mul(0.01);
      param.position = p.clone().add(param.velocityFrom);
      particleSystem.spawn(param);
    });
  },
  setPosition: function(x, y) {
    this.position.set(x, y);
    return this;
  },
  setPositionVector: function(v) {
    this.position = v;
    return this;
  },
});
glb.ExplosionS.prototype.accessor("x", {
  set: function(v) {
    this.position.x = x;
  },
  get: function() {
    return this.position.x;
  },
});
glb.ExplosionS.prototype.accessor("y", {
  set: function(v) {
    this.position.y = y;
  },
  get: function() {
    return this.position.y;
  },
});
