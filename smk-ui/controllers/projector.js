const proj4j = require('proj4');

var Projector = function(fromProj, toProj)
{
    this.fromProj = fromProj;
    this.toProj = toProj;

    // predefine BC Albers.
    proj4j.defs('EPSG:3005', 'PROJCS["NAD83 / BC Albers", GEOGCS["NAD83", DATUM["North_American_Datum_1983", SPHEROID["GRS 1980",6378137,298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0,0,0,0,0,0,0], AUTHORITY["EPSG","6269"]], PRIMEM["Greenwich",0, AUTHORITY["EPSG","8901"]], UNIT["degree",0.0174532925199433, AUTHORITY["EPSG","9122"]], AUTHORITY["EPSG","4269"]], PROJECTION["Albers_Conic_Equal_Area"], PARAMETER["standard_parallel_1",50], PARAMETER["standard_parallel_2",58.5], PARAMETER["latitude_of_center",45], PARAMETER["longitude_of_center",-126], PARAMETER["false_easting",1000000], PARAMETER["false_northing",0], UNIT["metre",1, AUTHORITY["EPSG","9001"]], AXIS["Easting",EAST], AXIS["Northing",NORTH], AUTHORITY["EPSG","3005"]]');
}

Projector.prototype.project = function(geometry)
{
    if (geometry.type === 'GeometryCollection')
    {
        console.log('Projecting GeometryCollection');
        for(var i = 0; i < geometry.geometries.length; i++)
        {
            projectGeometry(this.fromProj, this.toProj, geometry.geometries[i]);
        }
    }
    else
    {        
        if (geometry.type === 'MultiPolygon' || geometry.type === 'MultiPoint' || geometry.type === 'MultiLineString')
            console.log('Projecting MultiGeometry feature (should be a GeometryCollection...)');
        
        projectGeometry(this.fromProj, this.toProj, geometry);
    }
}

function projectPoint(fromProj, toProj, coords)
{
    var projectedCoords = proj4j(fromProj, toProj, coords);
    coords[0] = projectedCoords[0];
    coords[1] = projectedCoords[1];
}

function projectLineString(fromProj, toProj, lineString)
{
    for(var i = 0; i < lineString.length; i++)
    {
        projectPoint(fromProj, toProj, lineString[i]);
    }
}

function projectPolygon(fromProj, toProj, polygon)
{
    for(var i = 0; i < polygon.length; i++)
    {
        projectLineString(fromProj, toProj, polygon[i]);
    }
}

function projectGeometry(fromProj, toProj, geometry)
{
    // 'Multi" feature geometry should be GeometryCollection in geojson...
    if(geometry.type === 'Point')
    {
        projectPoint(fromProj, toProj, geometry.coordinates);
    }
    else if (geometry.type === 'LineString' || geometry.type === 'MultiPoint')
    {
        projectLineString(fromProj, toProj, geometry.coordinates);
    }
    else if (geometry.type === 'Polygon' || geometry.type === 'MultiLineString')
    {
        projectPolygon(fromProj, toProj, geometry.coordinates);
    }
    else if (geometry.type === 'MultiPolygon')
    {
        for(var i = 0; i < geometry.coordinates.length; i++)
        {
            projectPolygon(fromProj, toProj, geometry.coordinates[i]);
        }
    }
    else
    {
        console.error('No valid type found for this geometry. Projection cancelled');
        console.error(geometry);
    }
}

module.exports = Projector;