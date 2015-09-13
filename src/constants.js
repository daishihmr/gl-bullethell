var glb = {};

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var BULLET_APPEALANCE = SCREEN_WIDTH * 0.1;
var BULLET_SIZE = 12;

var GL_QUALITY = 0.5;

var GL_PIXEL_WIDTH = ~~(SCREEN_WIDTH * GL_QUALITY);
var GL_PIXEL_HEIGHT = ~~(SCREEN_HEIGHT * GL_QUALITY);

var GL = WebGLRenderingContext;

Number.prototype.toFloatString = function() {
  if (this % 1) {
    return "" + this;
  } else {
    return "" + this + ".0";
  }
};
