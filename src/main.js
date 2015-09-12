var glb = {};

var SCREEN_WIDTH = W = 640;
var SCREEN_HEIGHT = H = 960;

var BULLET_APPEALANCE = SCREEN_WIDTH * 0.2;
var BULLET_SIZE = 12;

var GL_QUALITY = 0.5;

var GL_PIXEL_WIDTH = ~~(SCREEN_WIDTH * GL_QUALITY);
var GL_PIXEL_HEIGHT = ~~(SCREEN_HEIGHT * GL_QUALITY);

var GL = WebGLRenderingContext;

var ASSETS = {
  image: {
    bullets: "./asset/bullets.png",
    particles: "./asset/particles.png",

    himetex: "./asset/p32.png",

    test: "./asset/test.png",
  },
  "wavefront.obj": {
    hime: {
      url: "./asset/p32.obj",
      originToCenter: true,
    },
  }
};

window.addEventListener("load", function() {
  var application = phina.display.CanvasApp({
    query: "#world",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  application.ticker.fps = 60;
  application
    .enableStats()
    .run();

  application.canvas.context.imageSmoothingEnabled = false;

  // application.replaceScene(glb.GameScene());

  application.replaceScene(glb.LoadingScene({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    assets: ASSETS,
    nextScene: glb.GameScene,
  }));

}, false);

Number.prototype.toFloatString = function() {
  if (this % 1) {
    return "" + this;
  } else {
    return "" + this + ".0";
  }
};

var log = function() {
  console.log.apply(console, arguments);
};
