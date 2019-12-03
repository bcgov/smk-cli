const inquirer = require('inquirer');
const files = require('./files');

module.exports = 
{
    askProjectDetails: () =>
    {
        const argv = require('minimist')(process.argv.slice(2));

        // types: input, password, list, checkbox

        const questions =
        [
            {
                name: 'projectname',
                type: 'input',
                message: 'Enter your project name:',
                default: argv._[0] || files.getCurrentDirectoryBase(),
                validate: function( value ) 
                {
                    if (value.length) return true;
                    else return 'A project name is required to create a new SMK project.';
                }
            },
            {
                name: 'author',
                type: 'input',
                message: 'Enter author name:',
                default: 'SMK Developer'
            },
            {
                name: 'viewer',
                type: 'list',
                message: 'Leaflet or ESRI 3D:',
                choices: [ 'leaflet', 'esri3d' ],
                default: 'leaflet'
            },
            {
                name: 'longitude',
                type: 'input',
                message: 'Starting Longitude:',
                default: '-128.7817'
            },
            {
                name: 'latitude',
                type: 'input',
                message: 'Starting Latitude:',
                default: '53.7764'
            },
            {
                name: 'zoom',
                type: 'input',
                message: 'Starting zoom:',
                default: '5',
                validate: function( value ) 
                {
                    if (parseInt(value) >= 0 && parseInt(value) <= 20 ) return true;
                    else return 'Zoom level must be a value from 0 to 20';
                }
            },
            {
                name: 'template',
                type: 'list',
                message: 'Select a project template:',
                choices: [ 'default', 'mobile' ],
                default: 'default'
            },
            {
                name: 'basemaps',
                type: 'checkbox',
                message: 'Select your basemap options:',
                choices: ['Streets', 'Topographic', 'NationalGeographic', 'Oceans', 'Gray', 'DarkGray', 'Imagery', 'ShadedRelief'],
                default: ['Topographic', 'Imagery', 'Gray']
            },
            {
                name: 'defaultbasemap',
                type: 'list',
                message: 'Select the default basemap:',
                choices: ['Streets', 'Topographic', 'NationalGeographic', 'Oceans', 'Gray', 'DarkGray', 'Imagery', 'ShadedRelief'],
                default: 'Topographic'
            },
            {
                name: 'tools',
                type: 'checkbox',
                message: 'Select your default tools:',
                choices: ['about', 'coordinate', 'attribution', 'layers', 'pan', 'zoom', 'measure', 'markup', 'scale', 'minimap', 'directions', 'location', 'select', 'identify', 'search'],
                default: ['about', 'coordinate', 'attribution', 'layers', 'pan', 'zoom', 'scale', 'minimap', 'identify', 'search']
            }
        ];

        return inquirer.prompt(questions);
    },
    getBasemapOptions:  () =>
    {
        const questions =
        [
            {
                name: 'defaultbasemap',
                type: 'list',
                message: 'Select the default basemap for the minimap to use:',
                choices: ['Streets', 'Topographic', 'NationalGeographic', 'Oceans', 'Gray', 'DarkGray', 'Imagery', 'ShadedRelief'],
                default: 'Topographic'
            }
        ];

        return inquirer.prompt(questions);
    },
    askYNQuestion: (message) =>
    {
        const questions =
        [
            {
                name: 'answer',
                type: 'list',
                message: message,
                choices: [ 'y', 'n' ],
                default: 'y'
            }
        ];

        return inquirer.prompt(questions);
    },
    askForPortNumber: () =>
    {
        const questions =
        [
            {
                name: 'port',
                type: 'input',
                message: 'Please specify an available port number to launch the editor UI with',
                default: 1337
            }
        ];

        return inquirer.prompt(questions);
    }
};