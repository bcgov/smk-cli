# Installing SMK-CLI

[Check your dependencies!](getting-started.md)

Once you have Node.js and NPM installed, you're ready to download and install the SMK-CLI. Simply type the following into your command line of choice:

`npm install —-global @bcgov/smk-cli`

NPM should now install all required packages as a globally accessible command line utility. 

Test that this worked:

`smk help`

You should see the help information for `smk-cli`. If you don't and are using Windows, then it's likely your NPM folder (`%APPDATA%\npm`) is not part of the system PATH variable. The simplest way to add it is with via the [Control Panel](https://www.computerhope.com/issues/ch000549.htm). After adding the NPM folder to PATH, `smk help` should work.

You're ready to get started!

[Creating an SMK application with the CLI](create-an-app.md) |
[Editing an SMK application with the CLI](edit-an-app.md) |
[Back to Index](index.md)

---

![logo](smk-logo-sm.png)