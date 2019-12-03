const express = require("express");
const fs = require('fs');
const DOMParser = require("xmldom").DOMParser;
const kmlToGeoJson = require('@tmcw/togeojson');
const xml2js = require('xml2js').parseString;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

var app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

const MPCM_OPTIONS = 
{
    host: 'apps.gov.bc.ca',
    port: '80',
    path: 'https://apps.gov.bc.ca/pub/mpcm/services/catalog/PROD',
    method: 'GET'
};

module.exports = 
{
    launch: (port) => 
    {
        // handle static files for the UI components
        console.log('Setting static path to ' + __dirname + '/static');
        app.use(express.static(__dirname + '/static/'));
        // Create service endpoints
        app.get("/LayerLibrary", (req, res, next) => 
        {
            var http = require('http');

            var mpcmReq = http.request(MPCM_OPTIONS, function(resp) 
            {
                var msg = '';

                resp.setEncoding('utf8');
                resp.on('data', function(chunk) 
                {
                    msg += chunk;
                });
                resp.on('end', function() 
                {
                    xml2js(msg, function (err, result) 
                    {
                        var layers = [];

                        var i = 0;
                        for(i = 0; i < result.catalog.folders[0].folder.length; i++)
                        {
                            var folderJson = result.catalog.folders[0].folder[i];

                            if(!folderJson.folders[0].folder) folderJson.folders[0].folder = [];
                            if(!folderJson.layers[0].layer) folderJson.layers[0].layer = [];

                            var folder = processFolder(folderJson.folderName[0], folderJson.folders[0].folder, folderJson.layers[0].layer);
                            
                            layers.push(folder);
                        }

                        res.json(layers);
                    });
                });
            });

            mpcmReq.end();
        });

        function processFolder(name, folders, layers)
        {
            var folder = new Folder(name);

            if(folders)
            {
                for(var i = 0; i < folders.length; i++)
                {
                    var folderJson = folders[i];

                    if(folderJson.folders && !folderJson.folders[0].folder) folderJson.folders[0].folder = [];
                    if(folderJson.layers && !folderJson.layers[0].layer) folderJson.layers[0].layer = [];

                    folder.folders.push(processFolder(folderJson.folderName[0], folderJson.folders ? folderJson.folders[0].folder : [], folderJson.layers ? folderJson.layers[0].layer : []));
                }
            }

            if(layers)
            {
                for(var i = 0; i < layers.length; i++)
                {
                    var layerJson = layers[i];

                    var layer = new Layer(layerJson.layerId[0]);
                    layer.label = layerJson.layerDisplayName[0];

                    folder.layers.push(layer);
                }
            }

            return folder;
        }

        app.get("/LayerLibrary/:id", (req, res, next) => 
        {
            var id = req.params.id;
            var http = require('http');

            var options = JSON.parse(JSON.stringify(MPCM_OPTIONS));
            options.path += '/' + id;
            console.log(options.path);
            var mpcmReq = http.request(options, function(resp) 
            {
                var msg = '';

                resp.setEncoding('utf8');
                resp.on('data', function(chunk) 
                {
                    msg += chunk;
                });
                resp.on('end', function() 
                {
                    xml2js(msg, function (err, result) 
                    {
                        var layer = 
                        {
                            id: result['gis-layer'].layerId[0], // or just use a uuid?
                            title: result['gis-layer'].layerDisplayName[0],
                            minScale: result['gis-layer'].minScale[0],
                            maxScale: result['gis-layer'].maxScale[0],
                            mpcmWorkspace: result['gis-layer'].workspaceName[0],
                            dynamicLayers: result['gis-layer'].dynamicJson,
                            attributes: result['gis-layer'].fields[0].field,
                            type: 'esri-dynamic',
                            attribution: 'DataBC',
                            opacity: 0.65,
                            isVisible: true,
                            isQueryable: true,
                            minScale: null,
                            maxScale: null,
                            titleAttribute: null,
                            queries: []
                        };
                        
                        // cleanup fields
                        for(var i = 0; i < layer.attributes.length; i++)
                        {
                            var field = layer.attributes[i];
                            field.title = field.fieldAlias[0];
                            field.name = field.fieldName[0];
                            field.id = field.fieldOrder[0];
                            field.visible = field.visible[0];

                            delete field.fieldAlias;
                            delete field.fieldName;
                            delete field.fieldOrder;
                            delete field.fieldType;
                            if(field.hasOwnProperty('maximumLength')) delete field.maximumLength;
                        }

                        for(var i = 0; i < result['gis-layer'].properties[0].property.length; i++)
                        {
                            var property = result['gis-layer'].properties[0].property[i];
                            if(property.key === 'metadata.url') layer.metadataUrl = property.value;
                        }

                        res.json(layer);
                    });
                });
            });

            mpcmReq.end();
        });

        app.get("/LayerLibrary/wms/:url", (req, res, next) => 
        {
            var urlString = req.params.url;

            var url = new URL(urlString)

            var http = require('http');

            console.log("Checking WMS service at: " + urlString);

            var options = 
            {
                host: url.host,
                port: url.port,
                path: url,
                method: 'GET'
            };

            var wmsReq = http.request(options, function(resp) 
            {
                var msg = '';

                resp.setEncoding('utf8');
                resp.on('data', function(chunk) 
                {
                    msg += chunk;
                });
                resp.on('end', function() 
                {
                    xml2js(msg, function (err, result) 
                    {
                        var layers = [];

                        var i = 0;
                        for(i = 0; i < result.WMS_Capabilities.Capability[0].Layer[0].Layer.length; i++)
                        {
                            var wmsLayer = result.WMS_Capabilities.Capability[0].Layer[0].Layer[i];
                            var j = 0;
                            for(j = 0; j < wmsLayer.Style.length; j++)
                            {
                                var style = wmsLayer.Style[j];
                                var layer = 
                                {
                                    type: "wms",
                                    id: wmsLayer.Name + "_" + style.Name,
                                    title: wmsLayer.Title[0] + "_" + style.Name,
                                    isVisible: false,
                                    isQueryable: true,
                                    opacity: 0.65,
                                    attribution: "",
                                    minScale: null,
                                    maxScale: null,
                                    titleAttribute: null,
                                    metadataUrl: wmsLayer.MetadataURL != null && wmsLayer.MetadataURL[0].OnlineResource != null ? wmsLayer.MetadataURL[0].OnlineResource[0].$["xlink:href"] : null,
                                    attributes:  [ ],
                                    queries: [],
                                    serviceUrl: req.params.url,
                                    layerName: wmsLayer.Name[0],
                                    styleName: style.Name[0]
                                };

                                // make a call for a single feature to fetch the attributes, set the title attribute?

                                layers.push(layer);
                            }
                        }

                        res.json(layers);
                    });
                });
            });

            wmsReq.end();
        });

        app.post("/ProcessKML", (req, res, next) => 
        {
            var body = '';

            req.on('data', function(data) 
            {
                body += data;
            });
            
            req.on('end', function ()
            {
                var kml = new DOMParser().parseFromString(body);
                var converted = kmlToGeoJson.kml(kml, { styles: true });

                res.json(converted);
            });
        });

        app.post("/SaveImage/:fileName", (req, res, next) => 
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

                fs.writeFile('./attachments/' + fileName + '.png', base64Data, {encoding: 'base64'}, function() 
                {
                    res.json({ message: 'Success' });
                });
            });
        });

        app.post("/SaveAttachment/:fileName", (req, res, next) => 
        {
            var fileName = req.params.fileName;
            var body = '';

            req.on('data', function(data) 
            {
                body += data;
            });
            
            req.on('end', function ()
            {
                fs.writeFile('./attachments/' + fileName + '.json', body, function() 
                {
                    res.json({ message: 'Success' });
                });
            });
        });

        app.post("/SaveConfig", (req, res, next) => 
        {
            var body = '';

            req.on('data', function(data) 
            {
                body += data;
            });
            
            req.on('end', function ()
            {
                fs.writeFile('map-config.json', body, function() 
                {
                    res.json({ message: 'Success' });
                });
            });
        });

        app.get("/ProjectConfig", (req, res, next) => 
        {
            console.log('Fetching project map-config json');
            fs.readFile('map-config.json', function(err, data) 
            {
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(data);
                res.end();
            });
        });

        app.listen(port, () => 
        {
            console.log("Server running on port " + port);
            console.log("-----------------------------------------------------");
            console.log("UI available: /index.html");
            console.log("-----------------------------------------------------");
            console.log("Endpoints available: {GET}  /LayerLibrary");
            console.log("                     {GET}  /LayerLibrary/:id");
            console.log("                     {GET}  /LayerLibrary/wms/:url");
            console.log("                     {POST} /LayerLibrary/ProcessKML");
            console.log("                     {GET}  /ProjectConfig");
            console.log("                     {POST} /SaveConfig");
            console.log("-----------------------------------------------------");
        });

        return app;
    }
};
/// --- Class defs. Move to a module
class Folder
{
    constructor(name)
    {
        this.label = name;
        this.folders = [];
        this.layers = [];
    }
};

class Layer
{
    constructor(id)
    {
        this.mpcmId = id;
        this.label = null;
    }
};