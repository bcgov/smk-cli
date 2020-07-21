#!/usr/bin/env node

const chalk = require( 'chalk' )

// get the command line, remove first two args (node exe and js location)
const args = process.argv
const exec = args[ 1 ]
const command = ( args[ 2 ] || '' ).toLowerCase()
const opt = require( 'minimist' )( args.slice( 3 ) )

// if the first arg is 'ui', then we should attempt to launch the ui editor
if ( command == 'ui' )
    return require( './smk-ui' )( opt )

// if the first arg is 'create', then we should attempt to launch the cli project creator
if ( command == 'create' )
    return require( './smk-create' )( opt )

if ( command == 'help' || command == '-h' || command == '-?' ) {
    usage()
    console.log( chalk.yellow( 'To create a new SMK project:     ' ) + chalk.blueBright( `${ exec } create [name]` ) )
    console.log( chalk.yellow( 'To modify an SMK project config: ' ) + chalk.blueBright( `${ exec } ui [-p port]` ) )
    return 1
}

if ( !command )
    console.log( chalk.red( 'No command specified' ) )
else
    console.log( chalk.red( `Unknown command specified: "${ command }"` ) )

usage()
return 1

function usage() {
    console.log( 'Usage: ' + chalk.blueBright( `${ exec } create|ui|help` ) )
}
