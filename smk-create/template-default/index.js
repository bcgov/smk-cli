const copyFiles = require( '../../lib/copy-files.js' )
const path = require( 'path' )

module.exports = function ( app, destDir ) {
    copyFiles( {
        base: path.join( __dirname, 'resources' ),
        sources: [ 'package.json', 'index.html', 'smk-config.json' ],
        destination: destDir,
        substitution: { app: app },
    } )

    copyFiles( {
        base: path.join( __dirname, 'resources' ),
        sources: [ 'assets/*', '*.js' ],
        destination: destDir,
    } )
}
