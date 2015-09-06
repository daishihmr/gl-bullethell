tm.define("glb.GameScene", {
    superClass: "tm.app.Scene",
    _renderable: true,

    glContext: null,

    init: function() {
        this.superInit();

        // console.log(tm.asset.Manager.get("hime"));
        // console.log(tm.asset.Manager.get("p32.mtl"));

        this.fromJSON({
            children: {
                hud: {
                    type: "glb.Hud",
                    x: 0,
                    y: 0,
                }
            }
        });

        // 敵弾vs自機判定用
        this.screen = glb.Screen(256, 256);

        this.effectComposer = null;

        // カメラ
        // var camera = this.camera = glb.Camera(45 * Math.DEG_TO_RAD, SCREEN_WIDTH / SCREEN_HEIGHT, 100, 10000);
        var camera = this.camera = glb.OrthoCamera(
            SCREEN_WIDTH * -0.5,
            SCREEN_WIDTH * 0.5,
            SCREEN_HEIGHT * -0.5,
            SCREEN_HEIGHT * 0.5,
            100,
            10000
        );
        camera.position.z = SCREEN_HEIGHT * 0.5 / Math.tan(45 * Math.DEG_TO_RAD * 0.5);
        camera.updateMatrix();

        var reverseShader = glb.ShaderPass(glb.ReverseShader());
        reverseShader.enabled = false;

        this.on("enter", function(e) {
            // 2Dキャンバスの背景を透明にする
            e.app.background = "transparent";

            this.glContext = e.app.glContext;

            this.bullets.build(this.glContext);
            this.screen.build(this.glContext);

            this.effectComposer = glb.AfterEffectComposer(this.glContext);
            // this.effectComposer.addPass(glb.ShaderPass(glb.MonotoneShader()));
            // this.effectComposer.addPass(reverseShader);
            // this.effectComposer.addPass(glb.BlurPass());
        });

        // var axis = glb.Vector3(3, 1, 0).normalize();
        // var rot = glb.Quat().setAxisAngle(axis, 0.02);
        // glb.Mesh(
        //         glb.BoxGeometry(180),
        //         glb.BasicMaterial({ color: tm.graphics.Color(0, 128, 255, 1) })
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
        //         glb.BasicMaterial({ color: tm.graphics.Color(255, 128, 0, 1) })
        //     )
        //     .setPosition(-60, 380, 0)
        //     .addChildTo(this)
        //     .on("enterframe", function() {
        //         this.rotation.mul(rot2);
        //     });

        // var player = glb.Mesh(
        //         glb.PlaneGeometry(4),
        //         glb.BasicMaterial({ color: tm.graphics.Color(0, 128, 255, 1.0) })
        //     )
        //     .setPosition(200, 200, 0)
        //     .addChildTo(this);

        // 自機
        var player = this.player = glb.Mesh(
                glb.BoxGeometry(30),
                glb.BasicMaterial({
                    color: tm.graphics.Color(0, 100, 255, 1)
                })
            )
            .setPosition(0, -200, 0)
            .addChildTo(this);
        // なんか適当に回転させる
        var rot2 = glb.Quat().setAxisAngle(glb.Vector3(-3, 1, 0).normalize(), 0.2);
        player.on("enterframe", function(e) {
            this.rotation.mul(rot2);

            // 移動入力：キーボード
            var kb = e.app.keyboard.getKeyDirection();
            this.x += kb.x * 4;
            this.y -= kb.y * 4;

            // 移動入力：ポインティング
            var p = e.app.pointing;
            if (p.getPointing()) {
                var d = p.deltaPosition;
                this.x += d.x * 2;
                this.y -= d.y * 2;
            }
        });
        player.on("hit", function() {
            // 弾が当たったイベント処理
            // 爆発を表示する
            glb.ExplosionS(particleSystem)
                .setPosition(this.x, this.y, 0)
                .addChildTo(this);
            reverseShader.enabled = true;
            this.tweener
                .clear()
                .wait(50)
                .call(function() {
                    reverseShader.enabled = false;
                });
        });

        // 弾
        var bullets = this.bullets = glb.Bullets(tm.asset.Manager.get("bullets").element).addChildTo(this);
        tm.display.Label("bullet count = 0", 40)
            .setAlign("left")
            .setFillStyle("darkgreen")
            .setPosition(10, 30)
            .addChildTo(this)
            .on("enterframe", function() {
                this.text = "bullet count = " + bullets.bullets.length;
            });

        // 弾幕を適当に
        this.on("enterframe", function(e) {
            if (e.app.frame % 3 !== 0) return;
            var w = 2;
            (w).times(function(i) {

                bullets.spawn(
                    glb.Vector2(Math.cos(e.app.frame * -0.042) * 100, Math.sin(e.app.frame * -0.042) * 100),
                    glb.Vector2().fromAngleLength(e.app.frame * 0.06 + Math.PI * 2 * i / w, 3),
                    0
                );
                bullets.spawn(
                    glb.Vector2(Math.cos(e.app.frame * 0.042) * 100, Math.sin(e.app.frame * 0.042) * 100),
                    glb.Vector2().fromAngleLength(e.app.frame * -0.06 + Math.PI * 2 * i / w, 3.5),
                    4
                );

            });
        });

        // 自機の当たり判定マーカー
        var marker = tm.display.RectangleShape({
                width: 5,
                height: 5,
                fillStyle: "rgba(255,0,0,0.8)",
                strokeStyle: "transparent"
            })
            .addChildTo(this)
            .on("enterframe", function() {
                var sc = camera.getScreenCoord(player);
                this.setPosition(sc.x * SCREEN_WIDTH, (1 - sc.y) * SCREEN_HEIGHT);
            });

        // screenから自機位置の色を取って入れるための配列
        this.pixels = new Uint8Array(1 * 1 * 4);

        // 自機vs敵弾の当たり判定処理
        this.on("enterframe", function(e) {
            if (this.pixels[0] && this.pixels[3]) {
                marker.setScale(5);
                player.flare("hit");
            } else {
                marker.setScale(1);
            }
        });

        // screenの可視化モニタ
        // this.monitor = glb.Mesh(
        //     glb.PlaneGeometry(this.screen.width),
        //     glb.BasicMaterial()
        // ).addChildTo(this);
        // this.monitor.geometry.uvData = new Float32Array([
        //     0, 0,
        //     1, 0,
        //     0, 1,
        //     1, 1,
        // ]);
        // this.monitor.material.setTextures = function(glContext) {
        //     var gl = glContext.gl;
        //     gl.bindTexture(gl.TEXTURE_2D, this.screen.texture);
        // };
        // this.monitor.material.setUniforms = function(glContext, uniformValues) {
        //     this.superSetUniforms(glContext, uniformValues);
        //     this.setUniform(glContext, "color", this.color);
        //     this.setUniform(glContext, "useTexture", 1);
        // };

        // 画面全体のピクセルデータ
        // var pixels2 = new Uint8Array(this.screen.width * this.sreen.height * 4);
        // this.on("enterframe", function() {
        //     var gl = this.glContext.gl;
        //     gl.readPixels(0, 0, this.screen.width, this.screen.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels2);
        // });

        // 任意矩形の判定処理
        // var hit = function(pixels2, rect, colorIndex) {
        //     var xMin = rect.x - rect.w * 0.5;
        //     var xMax = rect.x + rect.w * 0.5;
        //     var yMin = rect.y - rect.h * 0.5;
        //     var yMax = rect.y + rect.h * 0.5;
        //     for (var y = yMin; y < yMax; y += 5) {
        //         for (var x = xMin; x < xMax; x += 5) {
        //             if (pixels2[(x + y * GL_PIXEL_WIDTH) * 4 + colorIndex]) {
        //                 return true;
        //             }
        //         }
        //     }
        //     return false;
        // };

        // パーティクルシステム
        var particleSystem = glb.ParticleSystem(tm.asset.Manager.get("particles").element).addChildTo(this);
        tm.display.Label("particle count = 0", 40)
            .setAlign("left")
            .setFillStyle("darkgreen")
            .setPosition(10, 60)
            .addChildTo(this)
            .on("enterframe", function() {
                this.text = "particle count = " + particleSystem.particles.length;
            });

        // ランダムな位置に爆発表示
        // this.on("enterframe", function(e) {
        //     if (e.app.frame % 60 !== 0) return;
        //     (1).times(function() {
        //         glb.ExplosionS(particleSystem)
        //             .addChildTo(this)
        //             .position.random(0, 0, 0, W * 0.5);
        //     }.bind(this));
        // });

        // ランダムな位置に炎表示
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
        var gl = this.glContext.gl;
        var bullets = this.bullets;

        // 弾だけをscreenに描画する
        this.bullets.switchMaterial(false);
        this.children.forEach(function(c) {
            c._visibleBkup = c.visible;
            c.visible = (c === bullets);
        });
        this.glContext.attachScreen(this.screen);
        this.glContext.render(this, this.camera);

        // screenから自機位置のピクセルだけ色データを取得
        var sc = this.camera.getScreenCoord(this.player);
        gl.readPixels(~~(sc.x * this.screen.width), ~~(sc.y * this.screen.height), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, this.pixels);

        // 状態を元に戻してメインキャンバスに描画
        this.bullets.switchMaterial(true);
        this.children.forEach(function(c) {
            c.visible = c._visibleBkup;
        });
        // this.glContext.attachScreen(null);
        // this.glContext.render(this, this.camera);
        this.effectComposer.render(this, this.camera);
    },
});
