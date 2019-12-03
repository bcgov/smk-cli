const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const fs = require('fs');

const files = require('./files');
const inquirer = require('./inquirer');
const defConfig = require('./templates/default');
const mobileConfig = require('./templates/mobile');

module.exports = 
{
    launch: async (args) => 
    {
        console.log("Launching Command Line utility...");
        clear();
    
        console.log(chalk.yellow(figlet.textSync('Simple Map Kit', { horizontalLayout: 'full' })));
        console.log(chalk.blue('Welcome to the Simple Map Kit creator utility!'));
        console.log('');
    
        const run = async () => 
        {
            try
            {
                // get the project values from the inquierer
                const projectInfo = await inquirer.askProjectDetails();

                console.log('loading template: ' + projectInfo.template);
                var mapConfig;
                var config;
                var repo;
                if(projectInfo.template === 'default') config = defConfig;
                if(projectInfo.template === 'mobile') config = mobileConfig;

                mapConfig = config.json;
                repo = config.repo;

                // set map-config json info (project, author etc.)
                console.log('Setting up map config...');   
                mapConfig.lmfId = projectInfo.projectname.replace(/\s/g , "-").toLowerCase();
                mapConfig.name = projectInfo.projectname;
                mapConfig.createdBy = projectInfo.author;
                mapConfig.modifiedBy = projectInfo.author;
                mapConfig.createdDate = new Date();
                mapConfig.modifiedDate = new Date();
                mapConfig.viewer.type = projectInfo.viewer;
                mapConfig.viewer.location.center[0] = projectInfo.longitude;
                mapConfig.viewer.location.center[1] = projectInfo.latitude;
                mapConfig.viewer.location.zoom = projectInfo.zoom;

                // setup basemap choices
                mapConfig.viewer.baseMap = projectInfo.defaultbasemap;
                mapConfig.tools.push(
                {
                    type: "baseMaps",
                    enabled: true,
                    title: "Base Maps",
                    position: "toolbar",
                    choices: projectInfo.basemaps,
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "about",
                    enabled: projectInfo.tools.includes('about'),
                    title: "Welcome to SMK",
                    position: "toolbar",
                    content: "<p>Welcome to SMK!</p>",
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "coordinate",
                    enabled: projectInfo.tools.includes('coordinate')
                });

                mapConfig.tools.push(
                {
                    type: "attribution",
                    enabled: projectInfo.tools.includes('attribution')
                });
  
                mapConfig.tools.push(
                {
                    type: "layers",
                    enabled: projectInfo.tools.includes('layers'),
                    title: "Layers",
                    position: "toolbar",
                    display: [],
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "pan",
                    enabled: projectInfo.tools.includes('pan')
                });
 
                mapConfig.tools.push(
                {
                    type: "zoom",
                    enabled: projectInfo.tools.includes('zoom'),
                    mouseWheel: true,
                    doubleClick: true,
                    box: true,
                    control: true
                });

                mapConfig.tools.push(
                {
                    type: "measure",
                    enabled: projectInfo.tools.includes('measure'),
                    position: "shortcut-menu",
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "markup",
                    enabled: projectInfo.tools.includes('markup')
                });

                mapConfig.tools.push(
                {
                    type: "scale",
                    enabled: projectInfo.tools.includes('scale'),
                    showFactor: true,
                    showBar: true
                });

                const minimapBM = await inquirer.getBasemapOptions();
                mapConfig.tools.push(
                {
                    type: "minimap",
                    enabled: projectInfo.tools.includes('minimap'),
                    baseMap: minimapBM
                });

                mapConfig.tools.push(
                {
                    type: "directions",
                    enabled: projectInfo.tools.includes('directions'),
                    title: "",
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "location",
                    enabled: projectInfo.tools.includes('select')
                });

                mapConfig.tools.push(
                {
                    type: "select",
                    enabled: projectInfo.tools.includes('select'),
                    title: "Selection Panel",
                    style: {
                        strokeStyle: "",
                        strokeColor: "#000000",
                        fillColor: "#000000",
                        markerSize: [
                            20,
                            20
                        ],
                        markerOffset: [
                            10,
                            10
                        ],
                        strokeOpacity: "",
                        fillOpacity: "",
                        strokeWidth: ""
                    },
                    styleOpacity: "",
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "identify",
                    enabled: projectInfo.tools.includes('identify'),
                    title: "Identify",
                    position: "toolbar",
                    style: {
                        strokeWidth: "1",
                        strokeStyle: "1, 1",
                        strokeColor: "#ffff80",
                        strokeOpacity: "0.8",
                        fillColor: "#ffff00",
                        fillOpacity: "0.5",
                        markerSize: [
                            20,
                            20
                        ],
                        markerOffset: [
                            10,
                            0
                        ]
                    },
                    styleOpacity: "1",
                    tolerance: "12",
                    icon: null
                });

                mapConfig.tools.push(
                {
                    type: "search",
                    enabled: projectInfo.tools.includes('search')
                });

                mapConfig.tools.push(
                {
                    type: "list-menu",
                    enabled: true
                });

                mapConfig.tools.push(
                {
                    type: "toolbar",
                    enabled: true
                });

                mapConfig.tools.push(
                {
                    type: "shortcut-menu",
                    enabled: true
                });

                mapConfig.tools.push(
                {
                    type: "dropdown",
                    enabled: false
                });

                // Clone SMK from master
                const shell = require('shelljs');
                console.log('git clone ' + repo + ' ./' + mapConfig.lmfId);
                shell.exec('git clone ' + repo + ' ./' + mapConfig.lmfId);

                // copy in config
                fs.writeFile('./' + mapConfig.lmfId + '/map-config.json', JSON.stringify(mapConfig), async function() 
                {
                    console.log('Created project map-config.json from template ' + projectInfo.template);   

                    /*
                    const yN = await inquirer.askYNQuestion('Would you like to launch the editor now?');

                    if(yN.answer.toLowerCase() === 'y')
                    {
                        const portNum = await inquirer.askForPortNumber();

                        console.log('Starting the editor...');
                        shell.exec('cd ./' + mapConfig.lmfId + '/'); 
                        shell.exec('smk ui ' + portNum);
                    }
                    */
                });

                console.log(chalk.green('Your project has been created. To modify the configuration, navigate to the project folder and type "smk ui [port]"'));
            }
            catch(err) 
            {
                console.log(err);
            }
        };
    
        run();
    }
};