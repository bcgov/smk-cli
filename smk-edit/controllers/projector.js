const proj4 = require( 'proj4' )

proj4.defs( 'EPSG:3005', 'PROJCS["NAD83 / BC Albers", GEOGCS["NAD83", DATUM["North_American_Datum_1983", SPHEROID["GRS 1980",6378137,298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0,0,0,0,0,0,0], AUTHORITY["EPSG","6269"]], PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]], UNIT["degree",0.0174532925199433, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4269"]], PROJECTION["Albers_Conic_Equal_Area"], PARAMETER["standard_parallel_1",50], PARAMETER["standard_parallel_2",58.5], PARAMETER["latitude_of_center",45], PARAMETER["longitude_of_center",-126], PARAMETER["false_easting",1000000], PARAMETER["false_northing",0], UNIT["metre",1, AUTHORITY["EPSG","9001"]], AXIS["Easting",EAST], AXIS["Northing",NORTH], AUTHORITY["EPSG","3005"]]' )

var Projector = function( fromProj ) {
    this.projection = proj4( fromProj )
    if ( !this.projection )
        throw Error( `Projection not understood: ${ fromProj }` )
}

Projector.prototype.project = function( geometry ) {
    var self = this

    traverseGeoJson( geometry, {
        coordinate: function ( c ) {
            return self.projection.inverse( c )
        }
    } )
}

function traverseGeoJson( geojson, cb ) {
    cb = Object.assign( {
        coordinate: function ( c ) { return c }
    }, cb )

    var type = {
        Point: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: cb.coordinate( obj.coordinates )
            } )
        },

        MultiPoint: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: obj.coordinates.map( function ( c ) { return cb.coordinate( c ) } )
            } )
        },

        LineString: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: obj.coordinates.map( function ( c ) { return cb.coordinate( c ) } )
            } )
        },

        MultiLineString: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: obj.coordinates.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } )
            } )
        },

        Polygon: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: obj.coordinates.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } )
            } )
        },

        MultiPolygon: function ( obj, cb ) {
            return Object.assign( obj, {
                coordinates: obj.coordinates.map( function ( ps ) { return ps.map( function ( ls ) { return ls.map( function ( c ) { return cb.coordinate( c ) } ) } ) } )
            } )
        },

        GeometryCollection: function ( obj, cb ) {
            return Object.assign( obj, {
                geometries: obj.geometries.map( function ( g ) { return type[ g.type ]( g, cb ) } )
            } )
        },

        FeatureCollection:  function ( obj, cb ) {
            return Object.assign( obj, {
                features: obj.features.map( function ( f ) { return type[ f.type ]( f, cb ) } )
            } )
        },

        Feature: function( obj, cb ) {
            return Object.assign( obj, {
                geometry: type[ obj.geometry.type ]( obj.geometry, cb ),
            } )
        }
    }

    type[ geojson.type ]( geojson, cb )
}

module.exports = Projector;