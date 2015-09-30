var glb = {};

if (window.SCREEN_WIDTH === undefined) window.SCREEN_WIDTH = 640;
if (window.SCREEN_HEIGHT === undefined) window.SCREEN_HEIGHT = 960;

if (window.GL_QUALITY === undefined) window.GL_QUALITY = 0.5;

if (window.GL_PIXEL_WIDTH === undefined) window.GL_PIXEL_WIDTH = ~~(window.SCREEN_WIDTH * window.GL_QUALITY);
if (window.GL_PIXEL_HEIGHT === undefined) window.GL_PIXEL_HEIGHT = ~~(window.SCREEN_HEIGHT * window.GL_QUALITY);

if (window.BULLET_APPEALANCE === undefined) window.BULLET_APPEALANCE = window.GL_PIXEL_WIDTH * 0.1;
if (window.BULLET_SIZE === undefined) window.BULLET_SIZE = 15;

var GL = WebGLRenderingContext;

Number.prototype.toFloatString = function() {
  if (this % 1) {
    return "" + this;
  } else {
    return "" + this + ".0";
  }
};
