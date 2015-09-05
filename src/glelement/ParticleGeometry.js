(function() {

    tm.define("glb.ParticleGeometry", {
        superClass: "glb.Geometry",

        COUNT: 8192,

        bufferUsage: 1,

        initialPositionData: null,
        velocityFromData: null,
        velocityToData: null,
        spawnTimeData: null,
        activeData: null,
        frameIndexData: null,
        ttlData: null,
        sizeFromData: null,
        sizeToData: null,
        colorFromData: null,
        colorToData: null,

        initialPosition: null,
        velocityFrom: null,
        velocityTo: null,
        spawnTime: null,
        active: null,
        frameIndex: null,
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
            this.velocityFromData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());
            this.velocityToData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return [0, 0];
            }).flatten());
            this.spawnTimeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.activeData = new Float32Array(Array.range(0, this.COUNT).map(function() {
                return 0;
            }));
            this.frameIndexData = new Float32Array(Array.range(0, this.COUNT).map(function() {
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

        build: function(glContext) {
            var gl = glContext.gl;

            this.initialPosition = this.createVbo(gl, this.initialPositionData, gl.DYNAMIC_DRAW);
            this.velocityFrom = this.createVbo(gl, this.velocityFromData, gl.DYNAMIC_DRAW);
            this.velocityTo = this.createVbo(gl, this.velocityToData, gl.DYNAMIC_DRAW);
            this.spawnTime = this.createVbo(gl, this.spawnTimeData, gl.DYNAMIC_DRAW);
            this.active = this.createVbo(gl, this.activeData, gl.DYNAMIC_DRAW);
            this.frameIndex = this.createVbo(gl, this.frameIndexData, gl.DYNAMIC_DRAW);
            this.ttl = this.createVbo(gl, this.ttlData, gl.DYNAMIC_DRAW);
            this.sizeFrom = this.createVbo(gl, this.sizeFromData, gl.DYNAMIC_DRAW);
            this.sizeTo = this.createVbo(gl, this.sizeToData, gl.DYNAMIC_DRAW);
            this.colorFrom = this.createVbo(gl, this.colorFromData, gl.DYNAMIC_DRAW);
            this.colorTo = this.createVbo(gl, this.colorToData, gl.DYNAMIC_DRAW);
        },

        rebind: function(gl) {
            this.transfarVbo(gl, this.initialPosition, this.initialPositionData);
            this.transfarVbo(gl, this.velocityFrom, this.velocityFromData);
            this.transfarVbo(gl, this.velocityTo, this.velocityToData);
            this.transfarVbo(gl, this.spawnTime, this.spawnTimeData);
            this.transfarVbo(gl, this.active, this.activeData);
            this.transfarVbo(gl, this.frameIndex, this.frameIndexData);
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
            this.velocityFromData[index * 2 + 0] = param.velocityFrom.x;
            this.velocityFromData[index * 2 + 1] = param.velocityFrom.y;
            this.velocityToData[index * 2 + 0] = param.velocityTo.x;
            this.velocityToData[index * 2 + 1] = param.velocityTo.y;
            this.spawnTimeData[index] = now;
            this.activeData[index] = 1;
            this.frameIndexData[index] = param.frameIndex;
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
