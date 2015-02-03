module.exports = function(grunt) {
    'use strict';

    var config = {
        app: 'app',
        dist: 'dist'
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
                cwd: config.app,
                src: '*.html',
                dest: config.dist
            },
            img: {
                expand: true,
                cwd: config.app + '/img/',
                src: '**',
                dest: config.dist + '/img/'
            }
        },

        compass: {
            main: {
                options: {
                    basePath: config.app,
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
                src: [config.app + '/css/*.css'],
                dest: config.dist + '/css/style.css'
            }
        },

        uglify: {
            main: {
                src: [config.app + '/js/*.js'],
                dest: config.dist + '/js/script.js'
            }
        },

        usemin: {
            html: config.dist + '/*.html',
            options: {
                dest: config.dist
            }
        },

        connect: {
            server: {
                options: {
                    port: 8000,
                    hostname: 'localhost',
                    open: true,
                    base: 'dist'
                }
            }
        },

        watch: {
            main: {
                files: ['**/*.html', '**/*.scss', '**/*.js', '!node_modules/**', '!dist/**'],
                tasks: ['default']
            }
        }
    });

    grunt.registerTask('default', ['copy', 'compass', 'cssmin', 'uglify', 'usemin']);
    grunt.registerTask('server', ['default', 'connect', 'watch']);
};