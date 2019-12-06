const chalk = require('chalk');
const express = require("express");
const cors = require('cors');
//const helmet = require('helmet');
//const morgan = require('morgan');

const LayerController = require('./layer-controller');
const FileController = require('./file-controller');

var app = express();
app.use(cors());
//app.use(helmet());
//app.use(morgan('combined'));

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
            //console.log('Pong');
            res.json(['Pong']);
        });

        lc.initEndpoints(app);
        fc.initEndpoints(app);

        app.listen(port, () => 
        {
            console.log(chalk.yellow("Server running on port " + port));
            console.log("-----------------------------------------------------");
            console.log(chalk.green("UI available: /index.html"));
            console.log("-----------------------------------------------------");
            console.log(chalk.yellow("Endpoints available: {GET}  /Ping"));
            console.log(chalk.yellow("                     {GET}  /LayerLibrary"));
            console.log(chalk.yellow("                     {GET}  /LayerLibrary/:id"));
            console.log(chalk.yellow("                     {GET}  /LayerLibrary/wms/:url"));
            console.log(chalk.yellow("                     {POST} /LayerLibrary/ProcessKML"));
            console.log(chalk.yellow("                     {POST} /LayerLibrary/ProcessKMZ"));
            console.log(chalk.yellow("                     {POST} /LayerLibrary/ProcessShape"));
            console.log(chalk.yellow("                     {GET}  /ProjectConfig"));
            console.log(chalk.yellow("                     {POST} /SaveConfig"));
            console.log(chalk.yellow("                     {POST} /TestConfig"));
            console.log(chalk.yellow("                     {POST} /BuildConfig/:release"));
            console.log(chalk.yellow("                     {POST} /SaveImage/:fileName"));
            console.log(chalk.yellow("                     {POST} /SaveAttachment/:fileName"));
            console.log("-----------------------------------------------------");
        });

        return app;
    }
};