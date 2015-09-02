var fs = require("fs");
require("high");

module.exports = function(grunt) {
    var scan = function(file) {
        var fileList = fs.readdirSync(file);
        return fileList.map(function(child) {
            var stat = fs.statSync(file + "/" + child);
            if (stat.isFile()) {
                return file + "/" + child;
            } else if (stat.isDirectory()) {
                return scan(file + "/" + child);
            }
        });
    };

    var LIB = scan("./lib").flatten();
    var SRC = scan("./src").flatten().erase("./src/main.js");
    SRC.unshift("./src/main.js");
    
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        uglify: {
            product: {
                src: LIB.concat(SRC),
                dest: "build/game.js",
            }
        },
        concat: {
            develop: {
                src: LIB.concat(SRC),
                dest: "build/game.js",
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            develop: {
                files: LIB.concat(SRC),
                tasks: ["concat"],
            }
        }
    });

    grunt.registerTask("default", ["uglify"]);
};
