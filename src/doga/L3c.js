phina.namespace(function() {

  phina.define("glb.L3c", {
    superClass: "glb.Object3D",

    poses: null,
    motionFrame: null,
    beforePose: null,
    nextPose: null,

    init: function(unit) {
      this.superInit();

      this._rootUnit = unit.clone().addChild(this._rootUnit);

      this.poses = {};
      this._motionFrame = 1.0;
      this._motionTweener = phina.accessory.Tweener().attachTo(this);
    },

    startMotion: function(pose, duration, easing) {
      if (typeof(pose) === "string") {
        pose = this.poses[pose];
      }
      if (!pose) {
        pose = this.poses._initialPose;
      }

      this.beforePose = this.getCurrentPose();
      this.nextPose = pose;
      this.setMotionFrame(0.0);

      this._motionTweener.clear().to({
        motionFrame: 1.0
      }, duration, easing)
    },

    setMotionFrame: function(v) {
      this._motionFrame = v;
      if (this._motionFrame === 1.0 || this.beforePose === this.nextPose) {
        return;
      }

      if (!this.beforePose) {
        this.beforePose = this.poses._initialPose;
      }
      if (!this.nextPose) {
        this.nextPose = this.poses._initialPose;
      }

      glb.L3c._setFrameToUnit(this._rootUnit, this.beforePose, this.nextPose, ratio);

      return this;
    },

    getCurrentPose: function() {
      return glb.L3c._currentPose(this._rootUnit, null);
    },

    setPose: function(pose) {
      if (typeof(pose) === "string") {
        pose = this.poses[pose];
      }
      if (!pose) {
        pose = this.poses._initialPose;
      }

      glb.L3c._setPoseToUnit(this._rootUnit, pose);

      this._motionFrame = 1.0;
      this.beforePose = this.nextPose = pose;

      return this;
    },

    clone: function() {
      return glb.L3c(this._rootUnit.clone());
    },

    _accessor: {
      motionFrame: {
        get: function() {
          return this._motionFrame;
        },
        set: function(v) {
          this.setMotionFrame(v);
        }
      }
    },

    _static: {
      _setFrameToUnit: function(unit, before, next, ratio) {
        before = before || {
          pose: [0, 0, 0, 0, 0, 0],
          quat: [0, 0, 0, 1],
          childUnits: [],
        };
        next = next || {
          pose: [0, 0, 0, 0, 0, 0],
          quat: [0, 0, 0, 1],
          childUnits: [],
        };

        quat.slerp(unit.rotation.array, before.quat, next.quat, ratio);
        unit.position.x = before.pose[3] + (next.pose[3] - before.pose[3]) * ratio + unit.basePosition.x;
        unit.position.y = before.pose[4] + (next.pose[4] - before.pose[4]) * ratio + unit.basePosition.x;
        unit.position.z = before.pose[5] + (next.pose[5] - before.pose[5]) * ratio + unit.basePosition.x;
        unit.needsUpdate = true;

        for (var i = 0, end = unit.childUnits.length; i < end; i++) {
          glb.L3c._setFrameToUnit(unit.childUnits[i], before.childUnits[i], next.childUnits[i], ratio);
        }
      },

      _currentPose: function(unit, parent) {
        var p = {};
        p.pose = [0, 0, 0, unit.position.x - unit.basePosition.x, unit.position.y - unit.basePosition.y, unit.position.z - unit.basePosition.z];
        p.quat = [unit.rotation.x, unit.rotation.y, unit.rotation.z, unit.rotation.w];
        p.childUnits = [];
        for (var i = 0, end = unit.childUnits.length; i < end; i++) {
          p.childUnits[i] = glb.L3c._currentPose(unit.childUnits[i], p);
        }
        return p;
      },

      _setPoseToUnit: function(unit, pose) {
        pose = pose || {
          pose: [0, 0, 0, 0, 0, 0],
          quat: [0, 0, 0, 1],
          childUnits: [],
        };

        unit.rotation.copy(pose.quat);
        unit.position.x = pose.pose[3] + unit.basePosition.x;
        unit.position.y = pose.pose[4] + unit.basePosition.y;
        unit.position.z = pose.pose[5] + unit.basePosition.z;
        unit.needsUpdate = true;

        for (var i = 0, end = unit.childUnits.length; i < end; i++) {
          glb.L3c._setPoseToUnit(unit.childUnits[i], pose.childUnits[i]);
        }
      }
    },
  });

  phina.define("glb.L3cUnit", {
    superClass: "glb.Object3D",

    basePosition: null,
    childUnits: null,

    init: function(mesh, basePosition) {
      this.superInit();

      this._mesh = mesh.addChildTo(this);

      this.basePosition = glb.Vector3(basePosition[0], basePosition[1], basePosition[2]);
      this.childUnits = [];
    },

    addChildUnit: function(childUnit) {
      this.addChild(childUnit);
      this.childUnits[this.childUnits.length] = childUnit;
    },

    clone: function() {
      var clone = glb.L3cUnit(this._mesh.clone(), [
        this.basePosition.x, this.basePosition.y, this.basePosition.z
      ]);
      for (var i = 0, end = this.childUnits.length; i < end; i++) {
        clone.addChildUnit(this.childUnits[i].clone());
      }
      if (this.poses) {
        clone.poses = this.poses;
        clone.setPose(clone.poses._initialPose);
      }
      return clone;
    },

    _accessor: {
      mesh: {
        get: function() {
          return this._mesh;
        }
      }
    },

    _static: {
      create: function(arg) {
        var result = glb.L3cUnit(arg.node, arg.basePosition);
        var child = arg.child;
        if (child instanceof Array) {
          for (var i = 0, end = child.length; i < end; i++) {
            result.addChildUnit(glb.L3cUnit.create(child[i]));
          }
        }
        return result;
      }
    },

  });

});
