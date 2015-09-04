var glb = {};

var SCREEN_WIDTH = W = 640;
var SCREEN_HEIGHT = H = 960;

var BULLET_APPEALANCE = SCREEN_WIDTH * 0.2;
var GL_QUALITY = 0.5;

var ASSETS = {
    bullets: "./asset/bullets.png",
    particles: "./asset/particles.png",
    
    hime: "./asset/p32.obj",
    
    test: "./asset/test.png",
};

tm.main(function() {
    var application = tm.display.CanvasApp("#c2");
    application.fps = 60;
    application
        .resize(SCREEN_WIDTH, SCREEN_HEIGHT)
        .fitWindow()
        .run();
        
    application.glContext = glb.GLContext("#c3")
        .resize(SCREEN_WIDTH * GL_QUALITY, SCREEN_HEIGHT * GL_QUALITY)
        .fitWindow();

    application.replaceScene(tm.game.LoadingScene({
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        assets: ASSETS,
        nextScene: glb.GameScene,
    }));
    
    tm.asset.Script.loadStats().onload = function() {
        application.enableStats();
    };
});

Number.prototype.toFloatString = function() {
    if (this % 1) {
        return "" + this;
    } else {
        return "" + this + ".0";
    }
};
