#!/usr/bin/env node

const chalk = require('chalk');

const ui = require('./lib/smk-ui/init');
const cli = require('./lib/smk-cli/init');

// get the command line, remove first two args (node exe and js location)
var args = process.argv.slice(2);

// if the first arg exists, and it says 'ui', then we should attempt to launch the ui editor
if(args[0] && args[0] === 'ui')
{
    ui.launch(args);
}
// if the first arg exists, and it says 'create', then we should attempt to launch the cli project creator
else if(args[0] && args[0] === 'create')
{
    cli.launch(args);
}
else
{
    console.log(chalk.red('No command specified...'));
    console.log(chalk.yellow("If you wish to create a new SMK project, please type 'smk create'"));
    console.log(chalk.yellow("If you wish to modify an SMK project config, please type 'smk ui [port]'"));
}