# smk-cli
A command line utility and visual editor for creating and editing Simple Map Kit applications (https://github.com/bcgov/smk-client)

# Installation

Install the smk-cli tool as global: npm install -g smk-cli

# Commands

smk create

smk create will launch the command line tool for creating a new SMK application. This will download the latest version of SMK from GitHub and build a map configuration for you to start working with.

smk ui [port]

Once you've created an SMK application, or if you have an existing one, you can run 'smk ui' to launch the visual editor
By default, the editor will use port 1337 (it launches a simple api), but feel free to supply a port number to use instead

for more information on the SMK project, and to read documentation on SMK development and building your finished SMK app, see: https://bcgov.github.io/smk-client/

to uninstall: npm remove smk-cli 
