module.exports = function(grunt) {
    'use strict';
    
    var config = {
        source: 'app/',         // 源码目录
        deploy: 'deploy/'       // 发布目录
    };

    // load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            html: {
                expand: true,
                cwd: config.source,
                src: '*.html',
                dest: config.deploy
            },
            img: {
                expand: true,
                cwd: config.source + 'img/',
                src: '**',
                dest: config.deploy + 'img/'
            }
        },

        compass: {
            main: {
                options: {
                    basePath: config.source,
                    sassDir: 'sass',
                    cssDir: 'css',
                    imagesDir: 'img',
                    javascriptsDir: 'js',
                    outputStyle: 'expanded',
                    force: true,
                    relativeAssets: true,
                    noLineComments: true,
                    assetCacheBuster: false
                }
            }
        },

        cssmin: {
            main: {
                src: [config.source + 'css/*.css'],
                dest: config.deploy + 'css/style.css'
            }
        },

        imagemin: {
            main: {
                expand: true,
                cwd: config.source + 'img',
                src: '**/*.{png,jpg,jpeg,gif}',
                dest: config.deploy + 'img'
            }
        },

        uglify: {
            main: {
                src: [config.source + 'js/*.js'],
                dest: config.deploy + 'js/script.js'
            }
        },

        usemin: {
            html: config.deploy + '*.html',
            options: {
                dest: config.deploy
            }
        },

        watch: {
            main: {
                files: [config.source + 'sass/**'],
                tasks: ['compass', 'build']
            }
        }
    });

    grunt.registerTask('build', ['copy', 'compass', 'cssmin', 'imagemin', 'uglify', 'usemin']);
    grunt.registerTask('default', ['build', 'watch']);
};