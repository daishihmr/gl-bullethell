phina.namespace(function() {
  
  phina.util.Color.prototype.accessor("typedArray", {
    set: function(array) {
      this.r = array[0] * 255;
      this.g = array[1] * 255;
      this.b = array[2] * 255;
      this.a = array[3];
    },
    get: function() {
      if (this._typedArray == null) {
        this._typedArray = new Float32Array(4);
      }
      this._typedArray[0] = this.r / 255;
      this._typedArray[1] = this.g / 255;
      this._typedArray[2] = this.b / 255;
      this._typedArray[3] = this.a;
      return this._typedArray;
    }
  });

});
