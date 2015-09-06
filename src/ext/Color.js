(function() {
    
    tm.graphics.Color.prototype.accessor("array", {
        set: function(v) {
            this._array = v;
            this.r = ~~(v[0] * 255);
            this.g = ~~(v[1] * 255);
            this.b = ~~(v[2] * 255);
            this.a = v[3];
        },
        get: function() {
            if(this._array == null) this._array = new Float32Array(4);
            var a = this._array;
            a[0] = this.r / 255;
            a[1] = this.g / 255;
            a[2] = this.b / 255;
            a[3] = this.a / 255;
            return a;
        },
    });
    
})();
