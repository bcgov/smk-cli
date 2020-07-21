const fs = require('fs');
// const path = require('path');
// const DOMParser = require("xmldom").DOMParser;
// const kmlToGeoJson = require('@tmcw/togeojson');
// const shapefile = require('shapefile');
// const fgdb = require('fgdb');
// const unzipper = require('unzipper');
// const Projector = require('./projector');
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

module.exports = function ( app ) {
    app.post("/SaveImage/:fileName", (req, res, next) =>
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

    app.post("/SaveAttachment/:fileName", (req, res, next) =>
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

    app.post("/SaveConfig", (req, res, next) =>
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

    app.post("/TestConfig", (req, res, next) =>
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

    app.post("/BuildConfig/:release", (req, res, next) =>
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

    app.get("/ProjectConfig", (req, res, next) =>
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
    var configFile = req.app.get( 'smk config' )

    console.log('SaveConfig ->');
    var body = '';
    console.log('Reading body content...');
    req.on('data', function(data)
    {
        body += data;
    });

    req.on('end', function ()
    {
        console.log(`Saving config to ${ configFile }`);
        var json = JSON.parse( body )
        fs.writeFile( configFile, JSON.stringify( json, null, '    ' ), function(err)
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
                res.json({ message: 'Success', filename: configFile });
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
    var configFile = req.app.get( 'smk config' )

    console.log('GetConfig ->');
    console.log(`Fetching project ${ configFile }`);
    fs.readFile( configFile, function(err, data)
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
