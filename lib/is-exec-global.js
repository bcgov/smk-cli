const path = require( 'path' )
const shell = require( 'shelljs' )

module.exports = function ( exec ) {
    const globalPath = shell.exec( `npm bin -g`, { silent: true } ).stdout.slice( 0, -1 )
    // const localPath = shell.exec( `npm bin`, { silent: true } ).stdout

    const absExec = path.resolve( exec )
    if ( absExec.startsWith( globalPath ) ) return true
    return false
}
