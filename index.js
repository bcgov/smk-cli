#!/usr/bin/env node

const chalk = require( 'chalk' )
const figlet = require( 'figlet' )
const package = require( './package.json' )

const args = process.argv
const exec = 'smk'

const command = ( args[ 2 ] || '' ).toLowerCase()
const opt = require( 'minimist' )( args.slice( 3 ) )
opt.exec = exec

const fonts = [
    'Big', 'Doom', 'Gothic', 'Graffiti', 'Rectangles', 'Script',
    'Shadow', 'SL Script', 'Small', 'Soft', 'Speed', 'Stop', 'Swan'
]
const ver = 'CLI v' + package.version
const title = figlet.textSync( 'Simple Map Kit', {
    font: fonts[ Math.round( fonts.length * Math.random() ) ],
    horizontalLayout: 'full'
} ).slice( 0, -ver.length )
console.log( chalk.yellow( title ) + chalk.gray( ver ) )

if ( !opt.smkPackage ) {
    var smkDeps = Object.keys( package.dependencies ).filter( function ( d ) {
        return /(^|[/])smk$/.test( d )
    } )
    if ( smkDeps.length != 1 )
        throw Error( "Can't determine the dependency information for smk" )

    opt.smkPackage = smkDeps[ 0 ]
}

if ( !opt.smkPackageVersion ) {
    opt.smkPackageVersion = package.dependencies[ opt.smkPackage ]
}

opt.packageVersion = package.version

if ( command == 'edit' )
    return require( './smk-edit' )( opt )

if ( command == 'create' )
    return require( './smk-create' )( opt )

if ( command == 'help' || command == '-h' || command == '-?' ) {
    usage()
    console.log( chalk.yellow( 'To create a new SMK project:     ' ) + chalk.blueBright( `${ exec } create [name]` ) )
    console.log( chalk.yellow( 'To modify an SMK project config: ' ) + chalk.blueBright( `${ exec } edit [-p port]` ) )
    return 1
}

console.log( chalk.red( command ? `Unknown command specified: "${ command }"` : 'No command specified' ) )

usage()
return 1

function usage() {
    console.log( 'Usage: ' + chalk.blueBright( `${ exec } create|edit|help` ) )
}
