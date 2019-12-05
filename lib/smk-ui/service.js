const express = require("express");
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const LayerController = require('./layer-controller');
const FileController = require('./file-controller');

var app = express();
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

// controllers
var fc = new FileController(app);
var lc = new LayerController(app);

module.exports = 
{
    launch: (port) => 
    {
        // handle static files for the UI components
        console.log('Setting static path to ' + __dirname + '/static');
        app.use(express.static(__dirname + '/static/'));
        // Create service endpoints
        app.get("/Ping", (req, res, next) => 
        {
            console.log('Pong');
            res.json(['Pong']);
        });

        lc.initEndpoints(app);
        fc.initEndpoints(app);

        app.listen(port, () => 
        {
            console.log("Server running on port " + port);
            console.log("-----------------------------------------------------");
            console.log("UI available: /index.html");
            console.log("-----------------------------------------------------");
            console.log("Endpoints available: {GET}  /Ping");
            console.log("                     {GET}  /LayerLibrary");
            console.log("                     {GET}  /LayerLibrary/:id");
            console.log("                     {GET}  /LayerLibrary/wms/:url");
            console.log("                     {POST} /LayerLibrary/ProcessKML");
            console.log("                     {POST} /LayerLibrary/ProcessKMZ");
            console.log("                     {POST} /LayerLibrary/ProcessShape");
            console.log("                     {GET}  /ProjectConfig");
            console.log("                     {POST} /SaveConfig");
            console.log("                     {POST} /SaveImage/:fileName");
            console.log("                     {POST} /SaveAttachment/:fileName");
            console.log("-----------------------------------------------------");
        });

        return app;
    }
};