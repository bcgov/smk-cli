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

    const staticPath = path.join( __dirname, 'static' )
    // console.log( `Serving static resources from ${ staticPath }` )
    app.use( express.static( staticPath ) )

    app.get("/Ping", (req, res, next) =>
    {
        //console.log('Pong');
        res.json(['Pong']);
    });

    app.listen( opt.port, () =>
    {
        console.log(chalk.yellow("Service running on port " + opt.port));
        console.log("-----------------------------------------------------");
        console.log(chalk.green("UI available: /index.html"));
        console.log("-----------------------------------------------------");
        console.log(chalk.yellow("Endpoints available: GET  /Ping"));
        console.log(chalk.yellow("                     GET  /LayerLibrary"));
        console.log(chalk.yellow("                     GET  /LayerLibrary/:id"));
        console.log(chalk.yellow("                     GET  /LayerLibrary/wms/:url"));
        console.log(chalk.yellow("                     POST /ProcessKML"));
        console.log(chalk.yellow("                     POST /ProcessKMZ"));
        console.log(chalk.yellow("                     POST /ProcessShape"));
        console.log(chalk.yellow("                     POST /ProcessFGDB"));
        console.log(chalk.yellow("                     GET  /ProjectConfig"));
        console.log(chalk.yellow("                     POST /SaveConfig"));
        console.log(chalk.yellow("                     POST /TestConfig"));
        console.log(chalk.yellow("                     POST /BuildConfig/:release"));
        console.log(chalk.yellow("                     POST /SaveImage/:fileName"));
        console.log(chalk.yellow("                     POST /SaveAttachment/:fileName"));
        console.log("-----------------------------------------------------");
    } )

    return app
}