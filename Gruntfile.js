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
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        uglify: {
            main: {
                src: LIB.concat(SRC),
                dest: "build/game.js",
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            main: {
                files: LIB.concat(SRC),
                tasks: ["uglify"],
            }
        }
    });

    grunt.registerTask("default", ["uglify"]);
};
