phina.define("glb.LoadingScene", {
  superClass: "phina.display.CanvasScene",
  init: function(param) {
    this.superInit();
    phina.display.Label("loading", {
      color: "black"
    })
      .setPosition(SCREEN_WIDTH * 0.5, SCREEN_HEIGHT * 0.5)
      .addChildTo(this);

    var loader = phina.asset.AssetLoader();
    var flow = loader.load(param.assets);
    flow.then(function() {
      this.app.replaceScene(param.nextScene());
    }.bind(this));
  }
});
