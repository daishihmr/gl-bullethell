(function() {

    tm.define("glb.ParticleGeometry", {
        superClass: "glb.Geometry",

        COUNT: 8192,

        bufferUsage: 1,

        initialPositionData: null,
        velocityData: null,
        accelData: null,
        spawnTimeData: null,
        activeData: null,
        typeData: null,
        ttlData: null,
        sizeFromData: null,
        sizeToData: null,
        colorFromData: null,
        colorToData: null,

        initialPosition: null,
        velocity: null,
        accel: null,
        spawnTime: null,
        active: null,
        type: null,
        ttl: null,
        sizeFrom: null,
        sizeTo: null,
        colorFrom: null,
        colorTo: null,

        vboNeedUpdate: false,

        init: function() {
            this.superInit();

            this.initialPositionData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());;
            this.velocityData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());
            this.accelData = new Float32Array(Array.range(0, this.COUNT).map(function() {
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
            this.ttlData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.sizeFromData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.sizeToData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.colorFromData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [1, 1, 1, 1];
            }).flatten());
            this.colorToData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0, 0, 0];
            }).flatten());
        },

        initialize: function(glContext) {
            var gl = glContext.gl;

            this.initialPosition = this.createVbo(gl, this.initialPositionData);
            this.velocity = this.createVbo(gl, this.velocityData);
            this.accel = this.createVbo(gl, this.accelData);
            this.spawnTime = this.createVbo(gl, this.spawnTimeData);
            this.active = this.createVbo(gl, this.activeData);
            this.type = this.createVbo(gl, this.typeData);
            this.ttl = this.createVbo(gl, this.ttlData);
            this.sizeFrom = this.createVbo(gl, this.sizeFromData);
            this.sizeTo = this.createVbo(gl, this.sizeToData);
            this.colorFrom = this.createVbo(gl, this.colorFromData);
            this.colorTo = this.createVbo(gl, this.colorToData);
        },

        rebind: function(gl) {
            this.transfarVbo(gl, this.initialPosition, this.initialPositionData);
            this.transfarVbo(gl, this.velocity, this.velocityData);
            this.transfarVbo(gl, this.accel, this.accelData);
            this.transfarVbo(gl, this.spawnTime, this.spawnTimeData);
            this.transfarVbo(gl, this.active, this.activeData);
            this.transfarVbo(gl, this.type, this.typeData);
            this.transfarVbo(gl, this.ttl, this.ttlData);
            this.transfarVbo(gl, this.sizeFrom, this.sizeFromData);
            this.transfarVbo(gl, this.sizeTo, this.sizeToData);
            this.transfarVbo(gl, this.colorFrom, this.colorFromData);
            this.transfarVbo(gl, this.colorTo, this.colorToData);
        },

        spawn: function(now, param) {
            var index = find(this.activeData, 0);
            if (index < 0) {
                console.warn("パーティクルが足りない");
                return -1;
            }

            this.initialPositionData[index * 2 + 0] = param.position.x;
            this.initialPositionData[index * 2 + 1] = param.position.y;
            this.velocityData[index * 2 + 0] = param.velocity.x;
            this.velocityData[index * 2 + 1] = param.velocity.y;
            this.accelData[index * 2 + 0] = param.accel.x;
            this.accelData[index * 2 + 1] = param.accel.y;
            this.spawnTimeData[index] = now;
            this.activeData[index] = 1;
            this.typeData[index] = param.type;
            this.ttlData[index] = param.ttl;
            this.sizeFromData[index] = param.sizeFrom;
            this.sizeToData[index] = param.sizeTo;
            this.colorFromData[index * 4 + 0] = param.colorFrom.r / 255;
            this.colorFromData[index * 4 + 1] = param.colorFrom.g / 255;
            this.colorFromData[index * 4 + 2] = param.colorFrom.b / 255;
            this.colorFromData[index * 4 + 3] = param.colorFrom.a;
            this.colorToData[index * 4 + 0] = param.colorTo.r / 255;
            this.colorToData[index * 4 + 1] = param.colorTo.g / 255;
            this.colorToData[index * 4 + 2] = param.colorTo.b / 255;
            this.colorToData[index * 4 + 3] = param.colorTo.a;

            this.vboNeedUpdate = true;

            return index;
        },

        despawn: function(index) {
            if (index < this.activeData.length) {
                this.activeData[index] = 0;
                this.vboNeedUpdate = true;
            }
        },

    });

    var find = function(array, value) {
        return Array.prototype.indexOf.call(array, value);
    };

})();
