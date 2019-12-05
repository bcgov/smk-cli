const proj4j = require('proj4');

var Projector = function(fromProj, toProj)
{
    this.fromProj = fromProj;
    this.toProj = toProj;
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
        console.log('Projecting ' + geometry.type);

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