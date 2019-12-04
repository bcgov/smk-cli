const xml2js = require('xml2js').parseString;

var LayerController = function(app)
{
    this.app = app;
};

LayerController.MPCM_OPTIONS = 
{
    host: 'apps.gov.bc.ca',
    port: '80',
    path: 'https://apps.gov.bc.ca/pub/mpcm/services/catalog/PROD',
    method: 'GET'
};

LayerController.prototype.initEndpoints = function(app)
{
    app.get("/LayerLibrary", (req, res, next) => 
    {
        try
        {
            getLayerConfig(res);
        }
        catch(err)
        {
            console.log(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.get("/LayerLibrary/:id", (req, res, next) => 
    {
        try
        {
            var id = req.params.id;
            getLayerConfigItem(id, res);
        }
        catch(err)
        {
            console.log(err);
            res.writeHead(500);
            res.end();
        }
    });

    app.get("/LayerLibrary/wms/:url", (req, res, next) => 
    {
        try
        {
            var urlString = req.params.url;
            getWmsItem(urlString, res);
        }
        catch(err)
        {
            console.log(err);
            res.writeHead(500);
            res.end();
        }
    });
};

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

            folder.folders.push(
                processFolder(folderJson.folderName[0], 
                              folderJson.folders ? folderJson.folders[0].folder : [], 
                              folderJson.layers ? folderJson.layers[0].layer : []));
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
};

function getLayerConfig(res)
{
    var http = require('http');

    var mpcmReq = http.request(LayerController.MPCM_OPTIONS, function(resp) 
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
                if(err)
                {
                    throw new Error(err);
                }
                else
                {
                    try
                    {
                        var layers = [];

                        for(var i = 0; i < result.catalog.folders[0].folder.length; i++)
                        {
                            var folderJson = result.catalog.folders[0].folder[i];

                            if(!folderJson.folders[0].folder) folderJson.folders[0].folder = [];
                            if(!folderJson.layers[0].layer) folderJson.layers[0].layer = [];

                            var folder = processFolder(folderJson.folderName[0], folderJson.folders[0].folder, folderJson.layers[0].layer);
                            
                            layers.push(folder);
                        }
                        
                        res.json(layers);
                    }
                    catch(er)
                    {
                        throw new Error(er);
                    }
                }
            });
        });
    });

    mpcmReq.end();
};

function getLayerConfigItem(id, res)
{
    var http = require('http');

    var options = JSON.parse(JSON.stringify(LayerController.MPCM_OPTIONS));
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
                if(err)
                {
                    throw new Error(err);
                }
                else
                {
                    try
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
                    }
                    catch(er)
                    {
                        throw new Error(er);
                    }
                }
            });
        });
    });

    mpcmReq.end();
};

function getWmsItem(urlString, res)
{
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
                if(err)
                {
                    throw new Error(err);
                }
                else
                {
                    try
                    {
                        var layers = [];

                        for(var i = 0; i < result.WMS_Capabilities.Capability[0].Layer[0].Layer.length; i++)
                        {
                            var wmsLayer = result.WMS_Capabilities.Capability[0].Layer[0].Layer[i];
                            for(var j = 0; j < wmsLayer.Style.length; j++)
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

                                layers.push(layer);
                            }
                        }

                        res.json(layers);
                    }
                    catch(er)
                    {
                        throw new Error(er);
                    }
                }
            });
        });
    });

    wmsReq.end();
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

module.exports = LayerController;