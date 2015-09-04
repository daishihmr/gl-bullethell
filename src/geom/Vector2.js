(function() {

    tm.define("glb.Vector2", {

        init: function(x, y) {
            this.array = vec2.create();
            this.set(x || 0, y || 0);
        },

        clone: function() {
            return glb.Vector2(this.x, this.y);
        },
        
        copy: function(v) {
            return this.set(v.x, v.y);
        },

        set: function(x, y) {
            vec2.set(this.array, x, y);
            return this;
        },

        add: function(v) {
            vec2.add(this.array, this.array, v.array);
            return this;
        },

        sub: function(v) {
            vec2.sub(this.array, this.array, v.array);
            return this;
        },

        mul: function(v) {
            vec2.scale(this.array, this.array, v);
            return this;
        },

        length: function() {
            return vec2.length(this.array);
        },

        squaredLength: function() {
            return vec2.squaredLength(this.array);
        },

        negate: function() {
            vec2.negate(this.array, this.array);
            return this;
        },

        inverse: function() {
            vec2.inverse(this.array, this.array);
            return this;
        },

        normalize: function() {
            vec2.normalize(this.array, this.array);
            return this;
        },

        dot: function(v) {
            return vec2.dot(this.array, v.array);
        },

        cross: function(v) {
            var result = glb.Vector3();
            vec2.cross(result.array, this.array, v.array);
            return result;
        },
        
        fromAngleLength: function(rad, len) {
            return this.set(Math.cos(rad) * len, Math.sin(rad) * len);
        },
        
        random: function(cx, cy, radiusMin, radiusMax) {
            var angle = Math.random() * Math.PI;
            var radius = Math.randf(radiusMin, radiusMax);
            return this.set(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        },

    });

    glb.Vector2.prototype.accessor("x", {
        set: function(v) {
            this.array[0] = v;
        },
        get: function() {
            return this.array[0];
        },
    });
    glb.Vector2.prototype.accessor("y", {
        set: function(v) {
            this.array[1] = v;
        },
        get: function() {
            return this.array[1];
        },
    });

    glb.Vector2.distance = function(a, b) {
        return vec2.distance(a.array, b.array);
    };
    glb.Vector2.squaredDistance = function(a, b) {
        return vec2.squaredDistance(a.array, b.array);
    };

})();
