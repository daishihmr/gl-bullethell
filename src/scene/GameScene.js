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

        // var axis = glb.Vector3(3, 1, 0).normalize();
        // var rot = glb.Quat().setAxisAngle(axis, 0.02);
        // glb.Mesh(
        //     glb.BoxGeometry(60),
        //     glb.BasicMaterial().setRGBA(0, 0.5, 1, 1)
        // )
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.rotation.mul(rot);
        //     });

        // var axis2 = glb.Vector3(-3, 1, 0).normalize();
        // var rot2 = glb.Quat().setAxisAngle(axis2, 0.03);
        // glb.Mesh(
        //     glb.BoxGeometry(60, 20, 100),
        //     glb.BasicMaterial().setRGBA(1, 0.5, 0, 1)
        // )
        //     .setPosition(-30, 0, 0)
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.rotation.mul(rot2);
        //     });

        // var geo = glb.PlaneGeometry(32, 8, 1);
        // var mat = glb.BasicMaterial(tm.asset.Manager.get("bullet").element);
        // this.on("enterframe", function(e) {
        //     if (e.app.frame % 5 !== 0) return;

        //     var dir = Math.randf(0, Math.PI * 2);
        //     var bullet = glb.Mesh(geo, mat)
        //         .addChildTo(this)
        //         .setRotationZ(dir)
        //         .on("enterframe", function(e) {
        //             this.x += Math.cos(dir) * 2;
        //             this.y += Math.sin(dir) * 2;
        //             this.setScale(1, 0.9 + Math.sin(e.app.frame) * 0.1, 1);

        //             if (this.x < -SCREEN_WIDTH * 0.5 || SCREEN_WIDTH * 0.5 < this.x
        //                 || this.y < -SCREEN_HEIGHT * 0.5 || SCREEN_HEIGHT * 0.5 < this.y) {
        //                 this.remove();
        //             }
        //         });
        //     bullet.uvTranslate.x = Math.rand(0, 7) / 8;
        // });

        var bullets = glb.Bullets(tm.asset.Manager.get("bullets").element).addChildTo(this);
        this.on("enterframe", function(e) {
            var f = e.app.frame;
            if (f % 1 !== 0) return;
            var way = 2;
            Array.range(0, way).forEach(function(i) {
                var d = Math.PI*2 * i/way + e.app.frame * 0.1;
                var s = 1.5;
                bullets.spawn(
                    glb.Vector2().fromAngleLength(f * 0.02, 60),
                    glb.Vector2().fromAngleLength(d, s),
                    0
                );

                bullets.spawn(
                    glb.Vector2().fromAngleLength(f * 0.02 + Math.PI, 60),
                    glb.Vector2().fromAngleLength(d, s),
                    4
                );

                d = Math.PI*2 * i/way - e.app.frame * 0.1;
                s = 1.2;

                bullets.spawn(
                    glb.Vector2().fromAngleLength(f * -0.02 + Math.PI * 0.5, 40),
                    glb.Vector2().fromAngleLength(d, s),
                    8
                );
                bullets.spawn(
                    glb.Vector2().fromAngleLength(f * -0.02 + Math.PI * 1.5, 40),
                    glb.Vector2().fromAngleLength(d, s),
                    10
                );
            });
        });
        
        tm.display.Label("bullet count = 0", 40)
            .setFillStyle("darkgreen")
            .setPosition(200, 30)
            .addChildTo(this)
            .on("enterframe", function() {
                this.text = "bullet count = " + bullets.bullets.length;
            });
    },

    draw: function() {
        this.glContext.render(this, this.camera);
    },
});
