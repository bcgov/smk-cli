const fs = require('fs');
const DOMParser = require("xmldom").DOMParser;
const kmlToGeoJson = require('@tmcw/togeojson');

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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
            console.log(err);
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
    var body = '';

    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        try
        {
            var kml = new DOMParser().parseFromString(body);
            var converted = kmlToGeoJson.kml(kml, { styles: true });

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
    var fileName = req.params.fileName;
    var body = '';

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
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            else res.json({ message: 'Success' });
        });
    });
}

function saveAttachment(req, res, next)
{
    var fileName = req.params.fileName;
    var body = '';

    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        fs.writeFile('./attachments/' + fileName + '.json', body, function(err) 
        {
            if(err)
            {
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            else res.json({ message: 'Success' });
        });
    });
}

function saveConfig(req, res, next)
{
    var body = '';

    req.on('data', function(data) 
    {
        body += data;
    });
    
    req.on('end', function ()
    {
        fs.writeFile('map-config.json', body, function(err) 
        {
            if(err)
            {
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            else res.json({ message: 'Success' });
        });
    });
}

function getConfig(req, res, next)
{
    console.log('Fetching project map-config json');
    fs.readFile('map-config.json', function(err, data) 
    {
        if(err)
        {
            console.log(err);
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

module.exports = FileController;