(function() {

    tm.define("glb.Bullets", {
        superClass: "glb.Object3D",

        geometry: null,
        material: null,

        bullets: null,

        init: function(texture) {
            this.superInit();

            this.geometry = glb.BulletsGeometry();
            this.material = glb.BulletsMaterial(texture);

            this.bullets = [];
        },

        initialize: function(glContext) {
            this.geometry.initialize(glContext);
            this.material.initialize(glContext);
        },

        update: function(app) {
            this.geometry.update();

            var self = this;
            this.bullets = this.bullets.filter(function(b) {
                b.position.add(b.velocity);
                if (b.position.x < SCREEN_WIDTH * -0.2 || SCREEN_WIDTH * 0.2 < b.position.x ||
                    b.position.y < SCREEN_HEIGHT * -0.2 || SCREEN_HEIGHT * 0.2 < b.position.y) {
                    self.despawn(b.index);
                    return false;
                } else {
                    return true;
                }
            });
        },

        render: function(glContext, vpMatrix) {
            var gl = glContext.gl;

            if (this.geometry.vboNeedUpdate) {
                this.geometry.rebind(gl);
                this.geometry.vboNeedUpdate = false;
            }

            this.material.setProgram(glContext);
            this.material.setAttributes(glContext, this.geometry);

            this.material.setUniforms(glContext, this);
            this.material.setUniform(glContext, "time", this.geometry.time);
            this.material.setUniform(glContext, "vpMatrix", vpMatrix);

            this.material.draw(glContext, this.geometry.COUNT);
        },

        spawn: function(pos, vel, type) {
            var index = this.geometry.spawn(pos, vel, type);
            if (index < 0) return;
            this.bullets.push({
                position: pos,
                velocity: vel,
                index: index,
            });
            return index;
        },

        despawn: function(index) {
            this.geometry.despawn(index);
        },

    });

    var VERTEX_SHADER = "";
    var FRAGMENT_SHADER = "";

})();
