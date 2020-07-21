const fs = require('fs');
const path = require('path');
const DOMParser = require("xmldom").DOMParser;
const kmlToGeoJson = require('@tmcw/togeojson');
const shapefile = require('shapefile');
const fgdb = require('fgdb');
const unzipper = require('unzipper');
const Projector = require('./projector');
const shell = require('shelljs');

// Use Multer for handling zip file uploads used
// with shape, kmz vector file uploads
const multer = require('multer');
var storage = multer.diskStorage(
{
    destination: function (req, file, cb)
    {
        cb(null, './attachments');
    },
    filename: function (req, file, cb)
    {
        cb(null, 'temp.zip');
    }
});

var upload = multer({ storage: storage }).any();

// var FileController = function(app)
// {
    // app = app;
// };

module.exports = function ( app ) {
// FileController.prototype.initEndpoints = function()
// {
    app.post("/ProcessKML", (req, res, next) =>
    {
        try
        {
            processKml(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.post("/ProcessShape", upload, (req, res, next) =>
    {
        try
        {
            processShape(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.post("/ProcessKMZ", upload, (req, res, next) =>
    {
        try
        {
            processKmz(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.post("/ProcessFGDB", upload, (req, res, next) =>
    {
        try
        {
            processFgdb(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

};

function processKml(req, res, next)
{
    console.log('ProcessKML ->');
    var body = '';

    console.log('Reading body content...');
    req.on('data', function(data)
    {
        body += data;
    });

    req.on('end', function ()
    {
        try
        {
            console.log('Attempting to parse KML into geojson...');
            var kml = new DOMParser().parseFromString(body);
            var converted = kmlToGeoJson.kml(kml, { styles: true });

            console.log('Success!');
            res.json(converted);
        }
        catch(err)
        {
            throw new Error(err);
        }
    });
}

function processShape(req, res, next)
{
    console.log('ProcessShape ->');
    console.log('Unzipping temp zip file...');
    // unzip
    fs.createReadStream('./attachments/temp.zip').pipe(unzipper.Extract({ path: './attachments' }).on('close', function(finish)
    {
        // convert
        fs.readdir('./attachments/', function (err, files)
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else
            {
                var shp;
                var dbf;
                var prj;
                var shx;
                var cpg;
                var qpj;
                var sbn;
                var sbx;
                // locate the shapefile params
                files.forEach(function (file)
                {
                    if(file.endsWith('.shp')) shp = file;
                    if(file.endsWith('.dbf')) dbf = file;
                    if(file.endsWith('.prj')) prj = file;
                    if(file.endsWith('.shx')) shx = file;
                    if(file.endsWith('.cpg')) cpg = file;
                    if(file.endsWith('.qpj')) qpj = file;
                    if(file.endsWith('.sbn')) sbn = file;
                    if(file.endsWith('.sbx')) sbx = file;
                });

                if(shp)
                {
                    console.log('Shapefile found in zip. Converting...');
                    // parse the shape
                    var json = { type: "FeatureCollection", features: []};

                    shapefile.open('./attachments/' + shp, './attachments/' + dbf)
                    .then(source => source.read()
                    .then(function log(result)
                    {
                        if (result.done)
                        {
                            console.log('Completed, returning geojson response...');
                            res.json(json);

                            console.log('cleaning temp files');
                            cleanupTempFiles('./attachments', ['temp.zip', shp, dbf, prj, shx, cpg, qpj, sbn, sbx]);

                            return;
                        }

                        // project the feature if it's not in wgs84
                        // however, if there is no prj file specified, we have to assume it's ok
                        if(prj)
                        {
                            console.log('Reprojecting feature...');

                            var fromProj = '' + fs.readFileSync('./attachments/' + prj) + '';
                            var toProj = 'EPSG:4326';

                            //console.log('Projecting from: ' + fromProj);
                            //console.log('             to: ' + toProj);

                            var projector = new Projector(fromProj, toProj);
                            projector.project(result.value.geometry)
                        }

                        json.features.push(result.value);
                        source.read().then(log);
                    })).catch(() =>
                    {
                        console.error('Error during shapefile convert...');
                        console.log('cleaning temp files');
                        cleanupTempFiles('./attachments', ['temp.zip', shp, dbf, prj, shx, cpg, qpj, sbn, sbx]);
                        throw new Error(error);
                    });
                }
                else
                {
                    console.error('Shapefile not found in zip');
                    res.writeHead(500);
                    res.end();
                    console.log('cleaning temp files');
                    cleanupTempFiles('./attachments', ['temp.zip', shp, dbf, prj, shx, cpg, qpj, sbn, sbx]);
                }
            }
        });
    }));
}

function processKmz(req, res, next)
{
    console.log('processKmz ->');
    console.log('Unzipping temp zip file...');
    // unzip
    fs.createReadStream('./attachments/temp.zip').pipe(unzipper.Extract({ path: './attachments' }).on('close', function(finish)
    {
        // convert
        fs.readdir('./attachments/', function (err, files)
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else
            {
                var kml;
                // locate the shapefile params
                files.forEach(function (file)
                {
                    if(file.endsWith('.kml')) kml = file;
                });

                if(kml)
                {
                    console.log('KML found in zip. Converting...');

                    var kmlFile = '' + fs.readFileSync('./attachments/' + prj);
                    var kml = new DOMParser().parseFromString(kmlFile);
                    var json = kmlToGeoJson.kml(kml, { styles: true });

                    console.log('Completed, returning geojson response...');
                    res.json(json);
                }
                else
                {
                    console.error('KML not found in zip');
                    res.writeHead(500);
                    res.end();
                }

                console.log('cleaning temp files');
                cleanupTempFiles('./attachments', ['temp.zip', kml]);
            }
        });
    }));
}

function processFgdb(req, res, next)
{
    console.log('processFgdb ->');

    console.log('Unzipping FGDB...');
    fs.createReadStream('./attachments/temp.zip').pipe(unzipper.Extract({ path: './attachments' }).on('close', function(finish)
    {
        // find a directory with a .gdb extension
        fs.readdir('./attachments', function (err, files)
        {
            if (err)
            {
                console.error('Error during FGDB convert...');
                console.error(error);
                console.log('cleaning temp files');
                cleanupTempFiles('./attachments', ['temp.zip']);
                throw new Error(error);
            }

            var gdbPath = '';

            for(var i = 0 ; i < files.length; i++)
            {
                var fromPath = path.join('./attachments', files[i]);
                if(fromPath.includes('.gdb')) gdbPath = fromPath;
            }

            console.log('Found FGDB in path: ' + gdbPath);
            console.log('Processing FGDB...');
            fgdb(gdbPath)
            .then(function(objectOfGeojson)
            {
                console.log('Successfully processed FGDB!');

                // there may be multiple feature classes, and we may need to do some projection...
                var featureClassKeys = Object.keys(objectOfGeojson);
                for(var i = 0; i < featureClassKeys.length; i++)
                {
                    var key = featureClassKeys[i];
                    var featureClass = objectOfGeojson[key];

                    if(featureClass.bbox[0] > 180 || featureClass.bbox[0] < 180)
                    {
                        console.log('Reprojecting feature: ' + key);
                        // not WGS84, reproject
                        // we don't know the source projection, so assume BCAlbers?
                        var projector = new Projector('EPSG:3005', 'EPSG:4326');
                        for(var featureIdx = 0; featureIdx < featureClass.features.length; featureIdx++)
                        {
                            var feature = featureClass.features[featureIdx];
                            projector.project(feature.geometry);
                        }
                    }
                }

                console.log('Sending geojson response...');
                // send the feature classes back. The Processor will create layers
                // for each feature class
                res.json(objectOfGeojson);

                cleanupTempFiles('./attachments', ['temp.zip']);
                // cleanup temp folder too!
            },
            function(error)
            {
                console.error('Error during FGDB convert...');
                console.error(error);
                console.log('cleaning temp files');
                cleanupTempFiles('./attachments', ['temp.zip']);
                throw new Error(error);
            });
        });
    }));
}

function cleanupTempFiles(dir, files)
{
    for(var i = 0; i < files.length; i++)
    {
        try
        {
            if(files[i]) fs.unlinkSync(dir + '/' + files[i]);
        }
        catch(err)
        {
            console.error(err);
        }
    }
}
