(function() {

  phina.define("glb.ParticleSystem", {
    superClass: "glb.Object3D",

    geometry: null,
    material: null,

    particles: null,

    time: 0,

    visible: true,

    init: function(texture) {
      this.superInit();

      this.geometry = glb.ParticleGeometry();
      this.material = glb.ParticleMaterial(texture);

      this.particles = [];

      this.time = 0;
    },

    build: function(glLayer) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      this.geometry.build(glLayer);
      this.material.build(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
        this.material.setAttributes(glLayer, this.geometry);
        this.material.unsetVao(glLayer);
      }
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

    render: function(glLayer, vpMatrix) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      if (this.geometry.vboNeedUpdate) {
        this.geometry.rebind(gl);
        this.geometry.vboNeedUpdate = false;
      }

      this.material.setProgram(glLayer);

      if (ext !== null) {
        this.material.setVao(glLayer);
      } else {
        this.material.setAttributes(glLayer, this.geometry);
      }
      this.material.setTextures(glLayer);

      this.material.setUniforms(glLayer, this);
      this.material.setUniform(glLayer, "time", this.time);
      this.material.setUniform(glLayer, "vpMatrix", vpMatrix);

      this.material.draw(glLayer, this.geometry.COUNT);

      if (ext !== null) this.material.unsetVao(glLayer);
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
    position: {
      x: 0,
      y: 0
    },
    frameIndex: 0,
    ttl: 60 * 0.0001,
    velocityFrom: {
      x: 1,
      y: 0
    },
    velocityTo: {
      x: 0,
      y: 0
    },
    sizeFrom: 30,
    sizeTo: 30,
    colorFrom: {
      r: 255,
      g: 255,
      b: 255,
      a: 1
    },
    colorTo: {
      r: 255,
      g: 255,
      b: 255,
      a: 0
    },
  };

})();
