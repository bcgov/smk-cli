module.exports = function ( app ) {
    require( './configuration.js' )( app )
    require( './converters.js' )( app )
    require( './layers.js' )( app )

    app.get( "/Ping", ( req, res, next ) => { res.json( [ 'Pong' ] ) } )
}