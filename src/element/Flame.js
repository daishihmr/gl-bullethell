tm.define("glb.Flame", {
    superClass: "tm.app.Element",

    particleSystem: null,
    position: null,
    emitParFrame: 0,
    param: null,

    init: function(particleSystem, frameIndex) {
        this.superInit();
        
        if (frameIndex === undefined) frameIndex = 2;

        this.particleSystem = particleSystem;
        this.position = glb.Vector2();
        this.emitParFrame = 10;
        
        this.param = {
            ttl: 20 * 0.0001,
            sizeFrom: 80,
            sizeTo: 30,
            frameIndex: frameIndex,
            colorFrom: tm.graphics.Color(255, 255, 255, 0.5),
            colorTo: tm.graphics.Color(255, 255, 255, 0.0),
        };
    },
    update: function() {
        
        var particleSystem = this.particleSystem;
        var param = this.param;
        var p = this.position;

        this.emitParFrame.times(function() {
            param.velocityFrom = glb.Vector2(0, Math.randf(1, 8));
            param.velocityTo = param.velocityFrom;
            param.position = glb.Vector2().random(p.x, p.y, 0, 25);
            particleSystem.spawn(param);
        });
    },
    setPosition: function(x, y) {
        this.position.set(x, y);
        return this;
    },
});
glb.Flame.prototype.accessor("x", {
    set: function(v) {
        this.position.x = x;
    },
    get: function() {
        return this.position.x;
    },
});
glb.Flame.prototype.accessor("y", {
    set: function(v) {
        this.position.y = y;
    },
    get: function() {
        return this.position.y;
    },
});
