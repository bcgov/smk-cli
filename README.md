# Simple Map Kit Command-line Interface (smk-cli)

A command line utility and visual editor for creating and editing Simple Map Kit applications
(https://github.com/bcgov/smk)

# Installation

Install the smk-cli tool as a global command (you may need to use `sudo`):
`npm install -g smk-cli`

Test that installation was successful:
`smk help`

You should see a help message for `smk-cli`.

# Commands

`smk create [name]`

This will launch the command line tool for creating a new SMK application.
You can provide a name, it will be the name of the new subdirectory for the application.
This will download the latest version of SMK from GitHub and build a map configuration for you to start working with.

`smk ui [-p port]`

Once you've created an SMK application, or if you have an existing one, you can run this command to launch the visual editor.

For more information on the SMK project, or to read documentation on SMK development and building your finished SMK app, see https://bcgov.github.io/smk/

# Uninstall

`npm remove smk-cli`
