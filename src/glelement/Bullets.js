(function() {

    tm.define("glb.Bullets", {
        superClass: "glb.Object3D",

        geometry: null,
        material: null,

        // メイン表示用
        _mainMaterial: null,
        // 当たり判定用
        _collisionMaterial: null,

        time: 0,

        bullets: null,

        visible: true,

        init: function(texture) {
            this.superInit();

            this.geometry = glb.BulletsGeometry();
            this._mainMaterial = glb.BulletsMaterial(texture);
            this._collisionMaterial = glb.BulletsCollisionMaterial();
            this.switchMaterial(true);

            this.bullets = [];
        },

        switchMaterial: function(toMain) {
            this.material = toMain ? this._mainMaterial : this._collisionMaterial;
        },

        build: function(glContext) {
            var gl = glContext.gl;
            var ext = glContext.ext;

            this.geometry.build(glContext);
            this._mainMaterial.build(glContext);
            this._collisionMaterial.build(glContext);

            if (ext !== null) {
                this._mainMaterial.setVao(glContext);
                this._mainMaterial.setAttributes(glContext, this.geometry);
                this._mainMaterial.unsetVao(glContext);

                this._collisionMaterial.setVao(glContext);
                this._collisionMaterial.setAttributes(glContext, this.geometry);
                this._collisionMaterial.unsetVao(glContext);
            }

            this.isBuilt = true;
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
