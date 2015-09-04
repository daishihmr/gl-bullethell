(function() {

    tm.define("glb.Bullets", {
        superClass: "glb.Object3D",

        geometry: null,
        material: null,

        time: 0,

        bullets: null,

        init: function(texture) {
            this.superInit();

            this.geometry = glb.BulletsGeometry();
            this.material = glb.BulletsMaterial(texture);
            this.collisionMaterial = glb.BulletsCollisionMaterial();

            this.bullets = [];
        },

        build: function(glContext) {
            var gl = glContext.gl;
            var ext = glContext.ext;

            this.geometry.build(glContext);
            this.material.build(glContext);

            if (ext !== null) {
                this.material.setVao(glContext);
                this.material.setAttributes(glContext, this.geometry);
                this.material.unsetVao(glContext);
            }
        },

        update: function(app) {
            this.time += 0.0001;

            var self = this;
            this.bullets = this.bullets.filter(function(b) {
                b.position.add(b.velocity);
                if (b.position.x < (SCREEN_WIDTH + 128) * -0.5 || (SCREEN_WIDTH + 128) * 0.5 < b.position.x ||
                    b.position.y < (SCREEN_HEIGHT + 128) * -0.5 || (SCREEN_HEIGHT + 128) * 0.5 < b.position.y) {
                    self.despawn(b.index);
                    return false;
                } else {
                    return true;
                }
            });
        },

        render: function(glContext, vpMatrix) {
            var gl = glContext.gl;
            var ext = glContext.ext;

            if (this.geometry.vboNeedUpdate) {
                this.geometry.rebind(gl);
                this.geometry.vboNeedUpdate = false;
            }

            this.material.setProgram(glContext);

            if (ext !== null) {
                this.material.setVao(glContext);
            } else {
                this.material.setAttributes(glContext, this.geometry);
            }
            this.material.setTextures(glContext);

            this.material.setUniforms(glContext, this);
            this.material.setUniform(glContext, "time", this.time);
            this.material.setUniform(glContext, "vpMatrix", vpMatrix);

            this.material.draw(glContext, this.geometry.COUNT);

            if (ext !== null) this.material.unsetVao(glContext);
        },

        spawn: function(pos, vel, frameIndex) {
            var index = this.geometry.spawn(this.time, pos, vel, frameIndex);
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

})();
