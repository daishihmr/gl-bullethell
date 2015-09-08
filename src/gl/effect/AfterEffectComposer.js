(function() {

    tm.define("glb.AfterEffectComposer", {

        glContext: null,

        passes: null,

        init: function(glContext) {
            this.glContext = glContext;
            this.firstPass = glb.FirstPass();
            this.endPass = glb.EndPass();
            this.passes = [];
        },

        addPass: function(renderPass) {
            this.passes.push(renderPass);
        },

        render: function(scene, camera, light) {
            var self = this;
            var glContext = this.glContext;

            if (this.passes.length === 0 || this.passes.filter(isDisabled).length === 0) {
                glContext.attachScreen(null);
                glContext.render(scene, camera, light);
            } else {
                var endScreen = this.passes.reduce(function(beforeScreen, pass) {
                    if (pass.enabled) {
                        return pass.render(glContext, beforeScreen, light);
                    } else {
                        return beforeScreen;
                    }
                }, this.firstPass.render(glContext, scene, camera, light));

                this.endPass.render(glContext, endScreen, light);
            }

        },

    });

    var isDisabled = function(pass) {
        return pass.enabled;
    };

})();
