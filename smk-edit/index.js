const chalk = require( 'chalk' )
const open = require( 'open' )
const express = require( 'express' )
const cors = require( 'cors' )
const path = require( 'path' )

module.exports = async function ( args ) {
    try {
        var app = startService( {
            smkPackage: args.package,
            port:   args.port || args.p || 1337,
            base:   args.base || '.',
            config: args.config || 'smk-config.json',
            layers: args.layers || 'layers',
            temp:   args.temp || '.temp',
            ping:   args.ping || 10 * 1000,
        } )

        if ( !args.open || !/^(no|none|false|0)$/i.test( args.open ) ) {
            if ( args.open === true ) args.open = null
            const url = `http://localhost:${ app.get( 'port' ) }`
            console.log( chalk.yellow( `Opening ${ args.open || 'default browser' } at ${ chalk.blue( url ) }...` ) )
            open( url, { app: args.open } )
        }
    }
    catch ( err ) {
        console.log( chalk.red( 'Failed to launch SMK Edit' ) )
        console.log( chalk.yellow( err ) )
        process.exit( 1 )
    }
}

function startService( opt ) {
    console.log( chalk.yellow( `Starting service..` ) )

    var app = express()

    app.set( 'port', opt.port )
    app.set( 'smk base', path.resolve( opt.base ) )
    app.set( 'smk config', path.resolve( opt.base, opt.config ) )
    app.set( 'smk layers', path.resolve( opt.base, opt.layers ) )
    app.set( 'smk temp', path.resolve( opt.base, opt.temp ) )
    app.set( 'smk ping', opt.ping )

    app.use( cors() )

    require( './controllers' )( app, function ( req, res, next ) {
        console.log( chalk.yellow( ( new Date() ).toISOString() ), chalk.green( req.method ), chalk.blue( req.originalUrl ) )
        next()
    } )

    app.use( function ( err, req, res, next ) {
        console.log( chalk.yellow( ( new Date() ).toISOString() ), chalk.red( err.stack ) )
        res.status( 500 ).json( { ok: false, message: err.toString() } )
    } )

    app.use( express.static( path.resolve( __dirname, 'static' ) ) )
    app.use( '/module', express.static( path.dirname( require.resolve( opt.smkPackage ) ) ) )
    app.use( '/layers', express.static( app.get( 'smk layers' ) ) )

    app.use( function ( req, res, next ) {
        if ( ( '' + req.originalUrl ).endsWith( 'css' ) ) {
            console.log( `Returned dummy content for ${ req.originalUrl }` )
            res.type( 'text/css' ).send( `/* ${ req.originalUrl } */` ).end()
        }
        next()
    } )

    const routes = app._router.stack
        .filter( function ( r ) {
            return r.route
        } )
        .map( function ( r ) { return [
            Object.keys( r.route.methods ).map( function ( m ) { return m.toUpperCase() } ).join( ', ' ),
            r.route.path
        ] } )
        .sort( function( a, b ) { return a[ 1 ] > b[ 1 ] ? 1 : -1 } )
    routes.unshift( [ 'GET', '/module', path.dirname( require.resolve( opt.smkPackage ) ) ] )
    routes.unshift( [ 'GET', '/layers', app.get( 'smk layers' ) ] )
    routes.unshift( [ 'GET', '/', path.resolve( __dirname, 'static' ) ] )

    app.listen( opt.port, () => {
        console.log( chalk.yellow( 'Endpoints available:' ) )
        console.log( routes.map( function ( r ) {
            return `\t${ chalk.green( r[ 0 ] ) }\t${ chalk.cyan( r[ 1 ] ) }\t${  r[ 2 ] ? chalk.yellow( '-> ' ) + chalk.blue( relativePath( r[ 2 ] ) ) : '' }`
        } ).join( '\n' ) )
        console.log( chalk.yellow( `Base path is ${ chalk.blue( relativePath( app.get( 'smk base' ) ) ) }` ) )
        console.log( chalk.yellow( `Configuration path is ${ chalk.blue( relativePath( app.get( 'smk config' ) ) ) }` ) )
        console.log( chalk.yellow( `Layers catalog path is ${ chalk.blue( relativePath( app.get( 'smk layers' ) ) ) }` ) )
        console.log( chalk.yellow( `Temp path is ${ chalk.blue( relativePath( app.get( 'smk temp' ) ) ) }` ) )
        console.log( chalk.yellow( `Service listening at ${ chalk.cyan( 'http://localhost:' + app.get( 'port' ) + '/' ) }` ) )
        console.log( chalk.yellow( `Hit Ctrl-C to exit` ) )
        console.log()
    } )

    return app
}

function relativePath( path ) {
    return path.replace( process.cwd(), '.' )
}