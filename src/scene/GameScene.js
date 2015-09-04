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

        this.camera = glb.Camera();
        // this.camera = glb.OrthoCamera();

        this.on("enter", function(e) {
            e.app.background = "transparent";
            this.glContext = e.app.glContext;
        });

        return;

        var axis = glb.Vector3(3, 1, 0).normalize();
        var rot = glb.Quat().setAxisAngle(axis, 0.02);
        glb.Mesh(
                glb.BoxGeometry(180),
                glb.BasicMaterial().setRGBA(0, 0.5, 1, 1)
            )
            .setPosition(10, 380, 0)
            .addChildTo(this)
            .on("enterframe", function() {
                this.rotation.mul(rot);
            });

        var axis2 = glb.Vector3(-3, 1, 0).normalize();
        var rot2 = glb.Quat().setAxisAngle(axis2, 0.03);
        glb.Mesh(
                glb.BoxGeometry(180, 60, 300),
                glb.BasicMaterial().setRGBA(1, 0.5, 0, 1)
            )
            .setPosition(-60, 380, 0)
            .addChildTo(this)
            .on("enterframe", function() {
                this.rotation.mul(rot2);
            });

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
            (4).times(function(i) {

                bullets.spawn(
                    glb.Vector2(0, 0),
                    glb.Vector2().fromAngleLength(e.app.frame * 0.04 + Math.PI * 0.5 * i, 9),
                    2
                );
                bullets.spawn(
                    glb.Vector2(0, 0),
                    glb.Vector2().fromAngleLength(e.app.frame * -0.04 + Math.PI * 0.5 * i, 9),
                    6
                );

            });
        });

        var particleSystem = glb.ParticleSystem(tm.asset.Manager.get("particles").element).addChildTo(this);
        tm.display.Label("particle count = 0", 40)
            .setAlign("left")
            .setFillStyle("darkgreen")
            .setPosition(10, 60)
            .addChildTo(this)
            .on("enterframe", function() {
                this.text = "particle count = " + particleSystem.particles.length;
            });

        this.on("enterframe", function(e) {
            if (e.app.frame % 60 !== 0) return;
            (1).times(function() {
                glb.ExplosionS(particleSystem)
                    .addChildTo(this)
                    .position.random(0, 0, 0, W * 0.5);
            }.bind(this));
        });

        this.on("enterframe", function(e) {
            if (e.app.frame % 180 !== 0) return;

            var flame = glb.Flame(particleSystem)
                .addChildTo(this);
            flame.position.random(0, 0, 0, W * 0.5);
            flame.tweener.wait(5000).call(function() {
                flame.remove();
            });

        })

    },

    draw: function() {
        this.glContext.render(this, this.camera);
    },
});
