const chalk = require( 'chalk' )
const open = require( 'open' )
const express = require( 'express' )
const cors = require( 'cors' )
const path = require( 'path' )

module.exports = async function ( args ) {
    try
    {
        var app = startService( {
            port:       args.port || args.p || 1337,
            smkConfig:  args.smkConfig || 'smk-config.json'
        } )

        const url = `http://localhost:${ app.get( 'port' ) }`
        open( url )
    }
    catch( err )
    {
        console.log( chalk.red( 'Failed to launch SMK UI' ) )
        console.log( chalk.yellow( err ) )
        process.exit( 1 )
    }
}

function startService( opt ) {
    console.log( chalk.yellow( `Starting service..` ) )

    var app = express()

    app.set( 'port', opt.port )
    app.set( 'smk config', opt.smkConfig )

    app.use( cors() )

    require( './controllers' )( app )

    app.use( express.static( path.join( __dirname, 'static' ) ) )

    const routes = app._router.stack
        .filter( function ( r ) { return r.route } )
        .map( function ( r ) { return [
            Object.keys( r.route.methods ).map( function ( m ) { return m.toUpperCase() } ).join( ', ' ),
            r.route.path
        ] } )
        .sort( function( a, b ) { return a[ 1 ] > b[ 1 ] ? 1 : -1 } )
    routes.unshift( [ 'GET', '/', '(index.html)' ] )

    app.listen( opt.port, () => {
        console.log( chalk.yellow( 'Endpoints available:' ) )
        console.log( routes.map( function ( r ) {
            return `\t${ chalk.green( r[ 0 ] ) }\t${ chalk.blue( r[ 1 ] ) }   ${ r[ 2 ] || '' }`
        } ).join( '\n' ) )
        console.log( chalk.yellow( `Service listening on port ${ opt.port }` ) )
        console.log()
    } )

    return app
}