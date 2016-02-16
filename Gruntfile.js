module.exports = function(grunt) {

    grunt.initConfig({

        // For compiling our TypeScript/JavaScript
        ts: {
            build: {
                src: ['src/TSGrid/**/*.ts', '!node_modules/**/*.ts'],
                out: 'build/ts-grid.js',
                reference: 'src/ts-grid.r.ts',
                options: {
                    declaration: true
                }
            },
            test: {
                src: ['test/**/*.ts', '!node_modules/**/*.spec.ts'],
                out: 'test/ts-grid.spec.js',
                options: {
                    sourceMap: false
                }
            }
        },

        uglify: {
            build: {
                files: {
                    'build/ts-grid.min.js': ['build/ts-grid.js']
                }
            }
        },

        karma: {
            dev: {
                configFile: 'karma.conf.js'
            },
            build: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        release: {
            options: {
                additionalFiles: ['bower.json'],
                indentation: '    ', // four spaces
                beforeRelease: [
                    'build'
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ts');

    /** Dirty-hack **/
    grunt.registerTask('stripref', function() {


        var contents = grunt.file.read('./build/ts-grid.d.ts');
        contents = contents.replace("/// <reference path=\"../typings/tsd.d.ts\" />\n", "");
        contents = contents.replace("/// <reference path=\"../node_modules/ts-core/build/ts-core.d.ts\" />\n", "");
        grunt.file.write('./build/ts-grid.d.ts', contents);
    });

    /** Development **/
    grunt.registerTask('compile', [
        'ts:build',
        'ts:test',
        'stripref'
    ]);

    grunt.registerTask('test', [
        'compile',
        'karma:dev'
    ]);

    /** Release **/
    grunt.registerTask('build', [
        'compile',
        'karma:build',
        'uglify:build'
    ]);
};