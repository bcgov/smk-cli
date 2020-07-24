module.exports = function ( app ) {
    require( './configuration.js' )( app )
    require( './converters.js' )( app )
    require( './layers.js' )( app )

    app.get( '/ping', function ( req, res, next ) { res.json( { ok: true } ) } )
}