tm.define("glb.GameScene", {
    superClass: "tm.app.Scene",
    init: function() {
        this.superInit();

        console.log(tm.asset.Manager.get("hime"));
        console.log(tm.asset.Manager.get("p32.mtl"));

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
        
        var screen = glb.Screen();

        // this.camera = glb.Camera();
        this.camera = glb.OrthoCamera();

        this.on("enter", function(e) {
            e.app.background = "transparent";
            this.glContext = e.app.glContext;

            screen.build(this.glContext);
        });

        // var axis = glb.Vector3(3, 1, 0).normalize();
        // var rot = glb.Quat().setAxisAngle(axis, 0.02);
        // glb.Mesh(
        //         glb.BoxGeometry(180),
        //         glb.BasicMaterial().setRGBA(0, 0.5, 1, 1)
        //     )
        //     .setPosition(10, 380, 0)
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.rotation.mul(rot);
        //     });

        // var axis2 = glb.Vector3(-3, 1, 0).normalize();
        // var rot2 = glb.Quat().setAxisAngle(axis2, 0.03);
        // glb.Mesh(
        //         glb.BoxGeometry(180, 60, 300),
        //         glb.BasicMaterial().setRGBA(1, 0.5, 0, 1)
        //     )
        //     .setPosition(-60, 380, 0)
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.rotation.mul(rot2);
        //     });

        // var player = glb.Mesh(
        //         glb.PlaneGeometry(4),
        //         glb.BasicMaterial().setRGBA(0, 128, 255, 1.0)
        //     )
        //     .setPosition(200, 200, 0)
        //     .addChildTo(this);

        var bullets = glb.Bullets(tm.asset.Manager.get("bullets").element).addChildTo(this);
        tm.display.Label("bullet count = 0", 40)
            .setAlign("left")
            .setFillStyle("darkgreen")
            .setPosition(10, 30)
            .addChildTo(this)
            .on("enterframe", function() {
                this.text = "bullet count = " + bullets.bullets.length;
            });

        this.on("enterframe", function(e) {
            if (e.app.frame % 3 !== 0) return;
            var w = 8;
            (w).times(function(i) {

                bullets.spawn(
                    glb.Vector2(Math.cos(e.app.frame * 0.02) * 200, Math.sin(e.app.frame * 0.02) * 200),
                    glb.Vector2().fromAngleLength(e.app.frame * 0.06 + Math.PI * 2 * i / w, 3),
                    2
                );
                bullets.spawn(
                    glb.Vector2(Math.cos(e.app.frame * 0.02) * 200, Math.sin(e.app.frame * 0.02) * 200),
                    glb.Vector2().fromAngleLength(e.app.frame * -0.06 + Math.PI * 2 * i / w, 3.5),
                    6
                );

            });
        });
        
        var player = glb.Mesh(
                glb.BoxGeometry(10),
                glb.BasicMaterial().setRGBA(0, 0, 0, 0)
            )
            .setPosition(230, 40, 0)
            .addChildTo(this);
        var axis2 = glb.Vector3(-3, 1, 0).normalize();
        var rot2 = glb.Quat().setAxisAngle(axis2, 0.2);
        player.on("enterframe", function() {
            this.rotation.mul(rot2);
        });

        var camera = this.camera;
        var pixels = new Uint8Array(1 * 1 * 4);
        this.on("enterframe", function(e) {
            var gl = this.glContext.gl;
            var sc = camera.getScreenCoord(player);
            marker.setPosition(sc.x / GL_QUALITY, H - sc.y / GL_QUALITY);
            gl.readPixels(sc.x | 0, sc.y | 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
            if (pixels[0] && pixels[3]) {
                marker.setScale(5);
            } else {
                marker.setScale(1);
            }
        });

        var pixels2 = new Uint8Array(GL_PIXEL_WIDTH * GL_PIXEL_HEIGHT * 4);
        this.on("enterframe", function() {
            var gl = this.glContext.gl;
            gl.readPixels(0, 0, GL_PIXEL_WIDTH, GL_PIXEL_HEIGHT, gl.RGBA, gl.UNSIGNED_BYTE, pixels2);
        });

        var marker = tm.display.RectangleShape({
            width: 10,
            height: 10,
            fillStyle: "rgba(255,0,0,0.8)",
            strokeStyle: "transparent"
        }).addChildTo(this);

        var hit = function(pixels2, rect, colorIndex) {
            var xMin = rect.x - rect.w * 0.5;
            var xMax = rect.x + rect.w * 0.5;
            var yMin = rect.y - rect.h * 0.5;
            var yMax = rect.y + rect.h * 0.5;
            for (var y = yMin; y < yMax; y += 5) {
                for (var x = xMin; x < xMax; x += 5) {
                    if (pixels2[(x + y * GL_PIXEL_WIDTH) * 4 + colorIndex]) {
                        return true;
                    }
                }
            }
            return false;
        };

        // var particleSystem = glb.ParticleSystem(tm.asset.Manager.get("particles").element).addChildTo(this);
        // tm.display.Label("particle count = 0", 40)
        //     .setAlign("left")
        //     .setFillStyle("darkgreen")
        //     .setPosition(10, 60)
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.text = "particle count = " + particleSystem.particles.length;
        //     });

        // this.on("enterframe", function(e) {
        //     if (e.app.frame % 60 !== 0) return;
        //     (1).times(function() {
        //         glb.ExplosionS(particleSystem)
        //             .addChildTo(this)
        //             .position.random(0, 0, 0, W * 0.5);
        //     }.bind(this));
        // });

        // this.on("enterframe", function(e) {
        //     if (e.app.frame % 180 !== 0) return;

        //     var flame = glb.Flame(particleSystem)
        //         .addChildTo(this);
        //     flame.position.random(0, 0, 0, W * 0.5);
        //     flame.tweener.wait(5000).call(function() {
        //         flame.remove();
        //     });

        // });

    },

    draw: function() {
        this.glContext.render(this, this.camera);
    },
});
