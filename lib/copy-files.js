const fs = require( 'fs' )
const path = require( 'path' )
const _ = require( 'lodash' )
const glob = require( 'glob' )

module.exports = function copyFiles( opt ) {
    if ( !opt.sources || opt.sources.length == 0 ) throw Error( 'no sources' )
    if ( !opt.destination || !_.isString( opt.destination ) ) throw Error( 'no destination' )
    if ( !opt.base || !_.isString( opt.base ) ) throw Error( 'no base' )

    var { sources, destination, substitution, base } = opt

    sources.forEach( function ( pattern ) {
        var files = glob.sync( pattern, { cwd: base } )
        files.forEach( function ( src ) {
            var absSrc = path.resolve( base, src )
            var dest = path.join( destination, src )

            var destDir = path.dirname( dest )
            if ( !fs.existsSync( destDir ) ) {
                // console.log( `Creating ${ destDir }` )
                fs.mkdirSync( destDir, { recursive: true } )
            }

            copyFile( absSrc, dest, substitution )
        } )
    } )
}

function copyFile( source, destination, substitution ) {
    console.log( `copying ${ relativePath( source ) } ..` )
    if ( substitution ) {
        var input = fs.readFileSync( source, { encoding: 'utf8' } )
        var output = _.template( input )( substitution )
        fs.writeFileSync( destination, output )
        // console.log( `(with substitutions)` )
    }
    else {
        fs.copyFileSync( source, destination, fs.constants.COPYFILE_EXCL )
    }
    console.log( `.. to ${ relativePath( destination ) }` )
}

function relativePath( path ) {
    return path.replace( process.cwd(), '.' )
}
