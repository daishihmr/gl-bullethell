(function() {

  phina.define("glb.Bullets", {
    superClass: "glb.Element",

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

    build: function(glLayer) {
      var gl = glLayer.gl;
      var ext = glLayer.ext;

      this.geometry.build(glLayer);
      this._mainMaterial.build(glLayer);
      this._collisionMaterial.build(glLayer);

      if (ext !== null) {
        this._mainMaterial.setVao(glLayer);
        this._mainMaterial.setAttributes(glLayer, this.geometry);
        this._mainMaterial.unsetVao(glLayer);

        this._collisionMaterial.setVao(glLayer);
        this._collisionMaterial.setAttributes(glLayer, this.geometry);
        this._collisionMaterial.unsetVao(glLayer);
      }

      this.isBuilt = true;
    },

    update: function(app) {
      this.time += 0.0001;

      var self = this;
      var cam = app.currentScene.camera;
      this.bullets = this.bullets.filter(function(b) {
        b.position.add(b.velocity);

        var coord = cam.getScreenCoord(b.position);
        if (coord.x < -1.1 || 1.1 < coord.x || coord.y < -1.1 || 1.1 < coord.y) {
          self.despawn(b.index);
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
