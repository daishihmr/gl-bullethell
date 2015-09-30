phina.define("glb.LoadingScene", {
  superClass: "phina.display.CanvasScene",
  init: function(param) {
    this.superInit();
    this.backgroundColor = "black";
    phina.display.Label("loading", {
      color: "white"
    })
      .setPosition(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5)
      .addChildTo(this)
      .on("enterframe", function(e) {
        var c = e.app.ticker.frame;
        this.text = "downloading" + ".".repeat(c % 5);
      });

    var loader = phina.asset.AssetLoader();
    var flow = loader.load(param.assets);
    flow.then(function() {
      this.app.replaceScene(param.nextScene());
    }.bind(this));
  }
});
