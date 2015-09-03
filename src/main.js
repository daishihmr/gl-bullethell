var glb = {};

var SCREEN_WIDTH = 640;
var SCREEN_HEIGHT = 960;

var GL_QUALITY = 0.5;

var ASSETS = {
    bullets: "./asset/bullets.png",
    
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
