const fs = require('fs');
const shell = require('shelljs');

module.exports = function ( app, logger ) {
    app.use( '/config', logger )

    app.get( '/config', getConfig )
    app.post( '/config', saveConfig )
};

function getConfig( req, res, next ) {
    var configFile = req.app.get( 'smk config' )

    console.log( `    Reading config from ${ configFile }` );
    const data = JSON.parse( fs.readFileSync( configFile, { encoding: 'utf8' } ) )// function(err, data)
    res.json( data )
}

function saveConfig( req, res, next ) {
    var configFile = req.app.get( 'smk config' )

    // console.log('    Reading body content...');
    var body = '';
    req.on( 'data', function( data ) { body += data } )
    req.on( 'end', function () {
        console.log( `    Saving to ${ configFile }` )
        var json = JSON.parse( body )
        fs.writeFileSync( configFile, JSON.stringify( json, null, '    ' ) )
        res.json( { ok: true, message: 'Successfully saved to ' + configFile } )
    } )
}
