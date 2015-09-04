var fs = require("fs");
require("high");

module.exports = function(grunt) {

    var getSourceList = function() {
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

        var srcs = scan("./src").flatten().erase("./src/main.js");
        srcs.unshift("./src/main.js");

        return srcs;
    };

    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.initConfig({
        uglify: {
            product: {
                src: getSourceList(),
                dest: "build/game.js",
            },
            develop: {
                src: getSourceList(),
                dest: "build/game.js",
                options: {
                    sourceMap: true
                }
            }
        },
        concat: {
            product: {
                src: getSourceList(),
                dest: "build/game.js",
            },
            develop: {
                src: getSourceList(),
                dest: "build/game.js",
                options: {
                    sourceMap: true
                }
            }
        },
        watch: {
            develop: {
                files: getSourceList(),
                tasks: ["uglify:develop"],
            }
        }
    });

    grunt.registerTask("default", ["uglify:product"]);
};
