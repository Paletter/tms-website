module.exports = function (grunt) {
    'use strict';
    //load task require npm lib
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-zip');
    grunt.loadNpmTasks('grunt-replace');

    var taskConfig = grunt.file.readJSON('task-config.json');

    grunt.registerTask("env-dev-replace","replace environments configuration",function(){
        grunt.config.set("replace",{
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('./config/environments/develop.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['./config/base_config.js'],
                    dest: './src/js/'
                }]
            }
        });
        grunt.task.run(['replace']);
    });
    grunt.registerTask("env-rls-replace","replace environments configuration",function(){
        grunt.config.set("replace",{
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('./config/environments/release.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['./config/base_config.js'],
                    dest: './src/js/'
                }]
            }
        });
        grunt.task.run(['replace']);
    });
    grunt.registerTask("env-prd-replace","replace environments configuration",function(){
        grunt.config.set("replace",{
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('./config/environments/product.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['./config/base_config.js'],
                    dest: './src/js/'
                }]
            }
        });
        grunt.task.run(['replace']);
    });

    /**
     * zip dist-ecw directory
     */
    grunt.registerTask("zip-dist","build dist project to zip file",function(){
        grunt.config.set("zip",taskConfig.zip);
        grunt.task.run(['zip']);
    });
    /**
     * build src directory to dist-ecw
     */
    grunt.registerTask('build', 'requirejs web project', function () {
        grunt.config.set('requirejs', taskConfig.requirejs );
        grunt.task.run(['requirejs']);
        grunt.task.run(['zip-dist']);
    });
    grunt.registerTask('build-dev', 'requirejs web project', function () {
        grunt.task.run(['env-dev-replace']);
        grunt.config.set('requirejs', taskConfig.requirejs );
        grunt.task.run(['requirejs']);
        grunt.task.run(['zip-dist']);
    });
    grunt.registerTask('build-rls', 'requirejs web project', function () {
        grunt.task.run(['env-rls-replace']);
        grunt.config.set('requirejs', taskConfig.requirejs );
        grunt.task.run(['requirejs']);
        grunt.task.run(['zip-dist']);
    });
    grunt.registerTask('build-prd', 'requirejs web project', function () {
        grunt.task.run(['env-prd-replace']);
        grunt.config.set('requirejs', taskConfig.requirejs );
        grunt.task.run(['requirejs']);
        grunt.task.run(['zip-dist']);
    });
    /**
     * clean dist-ecw directory task
     */
    grunt.registerTask('clean-zip', 'clean dist web project', function () {
        grunt.config.set('clean', taskConfig.clean);
        grunt.task.run(['clean']);
    });

    grunt.registerTask('default', ['build']);
};