# Simple Map Kit Command Line Interface

![img](https://img.shields.io/badge/Lifecycle-Stable-97ca00)

A command line utility and visual editor for creating and editing [Simple Map Kit](https://github.com/bcgov/smk) applications. 

SMK-CLI lets you add map layers from BC government and other sources to your SMK application. It also lets you add and configure many mapping tools, such as Search, Identify, and Directions, to give extra functionality to your application.

Changes made using SMK-CLI are saved to the `smk-config.json` configuration file. This file can be edited manually as well. 

# Installation

SMK-CLI uses Node Package Manager (NPM). [Node.js](https://nodejs.org) must be installed before installing SMK-CLI. 

SMK-CLI can be installed via NPM in two different ways -
either local to the current project, or globally for your whole system.

## Global installation

To install the command globally, so it can be used from any project in your system, use this command:

    npm install --global @bcgov/smk-cli

This may require you to use administrative rights (or `sudo`) on your machine, depending on how it is configured.

Test that installation was successful by executing:

    smk help

You should see the help information for `smk-cli`. If you don't and are using Windows, then it's likely your npm folder (`%APPDATA%\npm`) is not part of the system PATH variable. The simplest way to add it is with via the [Control Panel](https://www.computerhope.com/issues/ch000549.htm). After adding the npm folder to path, `smk help` should work.

## Local installation

To install the command local to a particular project, first change into the directory of the project:

    cd <project>
    npm install --save-dev @bcgov/smk-cli

The `smk` module will be installed for that particular project as a dev dependency.
Test that installation was successful by executing:

    ./node_modules/.bin/smk help

# Commands

    smk create [name]

This will launch the `create` tool for creating a new SMK application. If you provide a name, it will become the name of the new subdirectory for the application. Next you will see a series of prompts asking you to choose or enter values. Many of these can be changed later when using the `edit` tool.

Once the wizard prompts are completed, the tool will download SMK as well as its NPM dependencies and build an SMK application configuration for you to start working with.

    smk edit [-p port]

Once you've created an SMK application, or if you have an existing one, you can run this command to start an HTTP server at the port you specified, or port 8080 if you didn't specify one, and launch the visual editor in a browser tab.

When you are finished using the `edit` tool, quit the process with `Ctrl-C` or whichever alternative your operating system uses. This shuts down the HTTP server.

# SMK

For more information on the SMK project, or to read documentation on SMK development and building your finished SMK app, see https://bcgov.github.io/smk/.

# Uninstall

    npm uninstall --global @bcgov/smk-cli

# [Further Documentation](https://bcgov.github.io/smk-cli/)