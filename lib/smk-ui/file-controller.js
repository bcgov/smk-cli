const fs = require('fs');
const DOMParser = require("xmldom").DOMParser;
const kmlToGeoJson = require('@tmcw/togeojson');
const shapefile = require('shapefile');
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

var FileController = function(app)
{
    this.app = app;
};

FileController.prototype.initEndpoints = function()
{
    this.app.post("/ProcessKML", (req, res, next) => 
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

    this.app.post("/ProcessShape", upload, (req, res, next) => 
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

    this.app.post("/ProcessKMZ", upload, (req, res, next) => 
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

    this.app.post("/SaveImage/:fileName", (req, res, next) => 
    {
        try
        {
            saveImage(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    this.app.post("/SaveAttachment/:fileName", (req, res, next) => 
    {
        try
        {
            saveAttachment(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    this.app.post("/SaveConfig", (req, res, next) => 
    {
        try
        {
            saveConfig(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    this.app.post("/TestConfig", (req, res, next) => 
    {
        try
        {
            testConfig(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    this.app.post("/BuildConfig/:release", (req, res, next) => 
    {
        try
        {
            buildConfig(req, res, next);
        }
        catch(err)
        {
            console.error(err);
            res.writeHead(500);
            res.end();
        }
    });

    this.app.get("/ProjectConfig", (req, res, next) => 
    {
        try
        {
            getConfig(req, res, next);
        }
        catch(err)
        {
            console.log(err);
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

function saveImage(req, res, next)
{
    console.log('SaveImage ->');
    var fileName = req.params.fileName;
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        console.log(body);
        var base64Data = body.split(';base64,').pop();
        console.log(base64Data);

        // check the datatype first, png, jpg etc.

        fs.writeFile('./attachments/' + fileName + '.png', base64Data, {encoding: 'base64'}, function(err) 
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else res.json({ message: 'Success' });
        });
    });
}

function saveAttachment(req, res, next)
{
    console.log('SaveAttachment ->');

    var fileName = req.params.fileName;
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        console.log('Attempting to store attachment ' + fileName + '.json...');
        fs.writeFile('./attachments/' + fileName + '.json', body, function(err) 
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else 
            {
                console.log('Success!');
                res.json({ message: 'Success' });
            }
        });
    });
}

function saveConfig(req, res, next)
{
    console.log('SaveConfig ->');
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        console.log('Saving project map-config.json');
        fs.writeFile('map-config.json', body, function(err) 
        {
            if(err)
            {
                console.error(err);
                res.writeHead(500);
                res.end();
            }
            else 
            {
                console.log('Success!');
                res.json({ message: 'Success' });
            }
        });
    });
}

function testConfig(req, res, next)
{
    console.log('TestConfig ->');

    // this will launch a grunt server process... but will lock up our running service.active
    // we may need to embed SMK, but that will need to be template specific
    shell.exec('npm install --production');
    shell.exec('npm install grunt-release --save-dev');
    shell.exec('grunt');
    
    console.log('Success!');
    res.json({ message: 'Success' });
}

function buildConfig(req, res, next)
{
    console.log('BuildConfig ->');

    var release = req.params.release.toLowerCase() === 'true' ? true : false;

    console.log('Building release version? ' + release);
    var command = 'grunt' + (release ? ' release' : ' develop');
    console.log('Executing: ' + command);

    shell.exec('npm install --production');
    shell.exec('npm install grunt-release --save-dev');
    
    var orgDir = process.cwd();
    process.chdir(orgDir + "/src");

    var result = shell.exec(command);
    process.chdir(orgDir);

    console.log('Complete');
    res.json({ message: 'Success', result: result });
}

function getConfig(req, res, next)
{
    console.log('GetConfig ->');
    console.log('Fetching project map-config json');
    fs.readFile('map-config.json', function(err, data) 
    {
        if(err)
        {
            console.error(err);
            res.writeHead(500);
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(data);
        }

        res.end();
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

module.exports = FileController;