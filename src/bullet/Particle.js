(function() {

    tm.define("glb.Particle", {
        superClass: "glb.Object3D",

        geometry: null,
        material: null,

        particles: null,
        
        time: 0,

        init: function(texture) {
            this.superInit();

            this.geometry = glb.ParticleGeometry();
            this.material = glb.ParticleMaterial(texture);

            this.particles = [];
            
            this.time = 0;
        },

        initialize: function(glContext) {
            this.geometry.initialize(glContext);
            this.material.initialize(glContext);
        },

        update: function(app) {
            this.time += 0.0001;

            var self = this;
            var time = this.time;
            this.particles = this.particles.filter(function(p) {
                if (p.deathTime <= time) {
                    self.despawn(p.index);
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
            this.material.setUniform(glContext, "time", this.time);
            this.material.setUniform(glContext, "vpMatrix", vpMatrix);

            this.material.draw(glContext, this.geometry.COUNT);
        },

        spawn: function(param) {
            var index = this.geometry.spawn(this.time, {}.$extend(DEFAULT_PARAM, param));
            if (index < 0) return;
            this.particles.push({
                deathTime: this.time + param.ttl,
                index: index,
            });
            return index;
        },

        despawn: function(index) {
            this.geometry.despawn(index);
        },

    });

    var DEFAULT_PARAM = {
        position: { x:0, y:0 },
        velocity: { x:1, y:0 },
        accel: { x:-0.1, y:0 },
        type: 0,
        ttl: 60 * 0.0001,
        sizeFrom: 30,
        sizeTo: 30,
        colorFrom: { r:255, g:255, b:255, a:1 },
        colorTo: { r:255, g:255, b:255, a:0 },
    };

})();
