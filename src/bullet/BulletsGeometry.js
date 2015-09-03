(function() {

    tm.define("glb.BulletsGeometry", {
        superClass: "glb.Geometry",

        COUNT: 8192,

        bufferUsage: 1,

        initialPositionData: null,
        velocityData: null,
        spawnTimeData: null,
        activeData: null,
        typeData: null,

        initialPosition: null,
        velocity: null,
        spawnTime: null,
        active: null,
        type: null,

        time: 0,

        vboNeedUpdate: false,

        init: function() {
            this.superInit();

            this.initialPositionData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());;
            this.velocityData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());
            this.spawnTimeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.activeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.typeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
        },

        initialize: function(glContext) {
            var gl = glContext.gl;

            this.initialPosition = this.createVbo(gl, this.initialPositionData);
            this.velocity = this.createVbo(gl, this.velocityData);
            this.spawnTime = this.createVbo(gl, this.spawnTimeData);
            this.active = this.createVbo(gl, this.activeData);
            this.type = this.createVbo(gl, this.typeData);
        },

        rebind: function(gl) {
            this.transfarVbo(gl, this.initialPosition, this.initialPositionData);
            this.transfarVbo(gl, this.velocity, this.velocityData);
            this.transfarVbo(gl, this.spawnTime, this.spawnTimeData);
            this.transfarVbo(gl, this.active, this.activeData);
            this.transfarVbo(gl, this.type, this.typeData);
        },

        spawn: function(pos, vel, type) {
            var index = find(this.activeData, 0);
            if (index < 0) {
                console.warn("弾が足りない");
                return -1;
            }

            this.initialPositionData[index * 2 + 0] = pos.x;
            this.initialPositionData[index * 2 + 1] = pos.y;
            this.velocityData[index * 2 + 0] = vel.x;
            this.velocityData[index * 2 + 1] = vel.y;
            this.spawnTimeData[index] = this.time;
            this.activeData[index] = 1;
            this.typeData[index] = type;

            this.vboNeedUpdate = true;

            return index;
        },

        despawn: function(index) {
            if (index < this.activeData.length) {
                this.activeData[index] = 0;
                this.vboNeedUpdate = true;
            }
        },

        update: function() {
            this.time += 0.0001;
        },

    });

    var find = function(array, value) {
        return Array.prototype.indexOf.call(array, value);
    };

})();
