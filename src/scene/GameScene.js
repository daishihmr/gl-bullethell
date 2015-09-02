tm.define("glb.GameScene", {
    superClass: "tm.app.Scene",
    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                hud: {
                    type: "glb.Hud",
                    x: 0,
                    y: 0,
                }
            }
        });

        this._renderable = true;
        this.glContext = null;

        this.camera = glb.Camera();

        this.on("enter", function(e) {
            e.app.background = "transparent";
            this.glContext = e.app.glContext;
        });

        var geo = glb.SpriteGeometry(32, 8, 1);
        var mat = glb.BasicMaterial();
        mat.image = tm.asset.Manager.get("bullet").element;
        
        this.on("enterframe", function(e) {
            if (e.app.frame % 5 !== 0) return;
            
            var dir = Math.randf(0, Math.PI * 2);
            var bullet = glb.Mesh(geo, mat)
                .addChildTo(this)
                .setRotationZ(dir)
                .on("enterframe", function(e) {
                    this.x += Math.cos(dir) * 2;
                    this.y += Math.sin(dir) * 2;
                    this.setScale(1, 0.9 + Math.sin(e.app.frame) * 0.1, 1);
                    
                    if (this.x < -SCREEN_WIDTH * 0.5 || SCREEN_WIDTH * 0.5 < this.x
                        || this.y < -SCREEN_HEIGHT * 0.5 || SCREEN_HEIGHT * 0.5 < this.y) {
                        this.remove();
                    }
                });
            bullet.uvTranslate[0] = Math.rand(0, 7) / 8;
        });
    },

    draw: function() {
        this.glContext.render(this, this.camera);
    },
});
