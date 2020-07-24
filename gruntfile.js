module.exports = function( grunt ) {

    grunt.loadNpmTasks( 'grunt-contrib-watch' )

    grunt.initConfig( {
        package: grunt.file.readJSON( 'package.json' ),

        watch: {
            options: {
                debounceDelay:  2000,
                spawn:          false,
                livereload:     true
            },

            'smk-ui': {
                files: [
                    'smk-ui/status/*/**'
                ]
            }
        }
    } )

}