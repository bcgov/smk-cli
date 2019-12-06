const chalk = require('chalk');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const opn = require('opn');

const service = require('./service');

const DEFAULT_EDITOR_PORT = 1337;

module.exports = 
{
    launch: async (args) => 
    {
        var status = new Spinner('... starting up, please wait ...');
        status.start();

        try
        {
            if(args[1]) console.log('Argument found... port: ' + args[1]);
            const port = args[1] && parseInt(args[1]) ? args[1] : DEFAULT_EDITOR_PORT;
            console.log(chalk.yellow('Creating server at localhost on port ' + port));
    
            console.log(chalk.yellow('Launching utility api...'));
            service.launch(port);

            console.log(chalk.green('Launching UI...'));
    
            const url = 'http://localhost:' + port;
    
            opn(url);
        }
        catch(err)
        {
            console.log(chalk.red('Failed to launch SMK UI'));
            console.log(chalk.yellow(err));
            process.exit();
        }
        finally
        {
            status.stop();
        }
    }
};