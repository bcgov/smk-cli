module.exports = function ( app, logger ) {
    require( './configuration.js' )( app, logger )
    require( './converters.js' )( app, logger )
    require( './catalogs.js' )( app, logger )

    app.get( '/ping', function ( req, res, next ) { res.json( {
        ok: true,
        next: parseInt( app.get( 'smk ping' ) )
    } ) } )
}