# Simple Map Kit Command-line Interface

A command line utility and visual editor for creating and editing [Simple Map Kit](https://github.com/bcgov/smk) applications.

# Documentation

Check out the SMK CLI documentation available [here](https://bcgov.github.io/smk-cli/)

# Installation

The SMK CLI can be installed via NPM in two different ways;
either local to the current project, or globally for your whole system.

## Global installation

To install the command globally, so it can be used from any project in our system, use this command:

    npm install -global smk-cli

This may require you to use administrative rights (or `sudo`) on your machine, depending on how it is configured.

Test that installation was successful by executing:

    smk help

## Local installation

To install the command local to a particular project, first change into the directory of the project:

    cd <project>
    npm install --save-dev smk-cli

The `smk` will be installed for that particular project, as a dev dependency.
Test that installation was successful by executing:

    node_modules/.bin/smk help

# Commands

    smk create [name]

This will launch the command line tool for creating a new SMK application.
You can provide a name, it will be the name of the new subdirectory for the application.
This will download the latest version of SMK from GitHub and build a map configuration for you to start working with.

    smk edit [-p port]

Once you've created an SMK application, or if you have an existing one, you can run this command to launch the visual editor.

For more information on the SMK project, or to read documentation on SMK development and building your finished SMK app, see https://bcgov.github.io/smk/

# Uninstall

    npm uninstall —global smk-cli
