module.exports = function(grunt) {
    'use strict';
    
    var config = {
        src: 'app/',
        dist: 'deploy/'
    };

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        config: config,

        clean: {
            main: {
                src: config.dist
            }
        },

        copy: {
            html: {
                expand: true,
                cwd: config.src,
                src: '*.html',
                dest: config.dist
            },
            img: {
                expand: true,
                cwd: config.src + 'img/',
                src: '**',
                dest: config.dist + 'img/'
            }
        },

        compass: {
            main: {
                options: {
                    basePath: config.src,
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
                src: [config.src + 'css/*.css'],
                dest: config.dist + 'css/style.css'
            }
        },

        imagemin: {
            main: {
                expand: true,
                cwd: config.src + 'img',
                src: '**/*.{png,jpg,jpeg,gif}',
                dest: config.dist + 'img'
            }
        },

        uglify: {
            main: {
                src: [config.src + 'js/*.js'],
                dest: config.dist + 'js/script.js'
            }
        },

        usemin: {
            html: config.dist + '*.html',
            options: {
                dest: config.dist
            }
        },

        watch: {
            main: {
                files: [config.src + 'sass/**'],
                tasks: ['compass', 'build']
            }
        }
    });

    grunt.registerTask('build', ['copy', 'compass', 'cssmin', 'imagemin', 'uglify', 'usemin']);
    grunt.registerTask('default', ['build', 'watch']);
};