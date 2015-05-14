module.exports = function(grunt) {
    // All loaded Grunt plugins
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-notify');

    // Tasks
    grunt.registerTask('default', ['less:dev']);

    // Config
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // grunt-contrib-less
        less: {
            dev: {
                options: {
                    paths: ['less/ms-lib'],
                    compress: false
                },
                files: {
                    'css/multi-seq.css'  : 'less/ms-lib/multi-seq.less'
                }
            }
        },

        // grunt-contrib-watch
        watch: {
            options: {
                dateFormat: function(time) {
                    grunt.log.writeln('The watch finished in ' + time + 'ms at ' + (new Date()).toString());
                    grunt.log.writeln('Waiting for more changes…');
                },
                spawn: false,
                interrupt: false
            },
            less: {
                files: ['less/**/*.less'],
                tasks: ['less', 'notify:watch']
            }
        },

        notify_hooks: {
            options: {
                enabled: true,
                title: 'Multi Seq'
            }
        },

        notify: {
            watch: {
                options: {
                    title: 'Task Completed',
                    message: 'LESS finished compiling successfully!'
                }
            }
        }

    });
}