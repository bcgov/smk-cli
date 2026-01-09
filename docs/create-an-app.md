# Creating your SMK application

Now that you've installed the SMK-CLI (if you haven't, check out the [install steps](installation.md)) you're ready to build an SMK application.

For a quick 'help' guide on using the SMK-CLI, enter the following into you command line:

`smk help`

which will return the available commands that the SMK-CLI supports.

```bash
 _____  _                    _        ___  ___                _   __ _  _
/  ___|(_)                  | |       |  \/  |               | | / /(_)| |
\ `--.  _  _ __ ___   _ __  | |  ___  | .  . |  __ _  _ __   | |/ /  _ | |_
 `--. \| || '_ ` _ \ | '_ \ | | / _ \ | |\/| | / _` || '_ \  |    \ | || __|
/\__/ /| || | | | | || |_) || ||  __/ | |  | || (_| || |_) | | |\  \| || |_
\____/ |_||_| |_| |_|| .__/ |_| \___| \_|  |_/ \__,_|| .__/  \_| \_/|_| \__|
                     | |                             | |
                     |_|                             |_|   CLI v1.2.4
Usage: smk create|edit|help
To create a new SMK project:     smk create [name]
To modify an SMK project config: smk edit [-p port]
```

There are three main commands:

- `create`
- `edit`
- `help`

We've just seen `help`, so lets dive into `create`.

## Create

Before creating your application, you'll want to ensure you're in a path where you want your SMK application to reside. A folder will be created to hold your application.

`cd myProjectsFolder`

Once you're in a location where you want to create your new application, you can enter the SMK create command:

`smk create mySmkProject`

`mySmkProject` will be your desired project name. You will then be presented with a series of options for configuring the skeleton of your SMK application.

```bash
                               _           ,__ __                     ,
   ()  o                      | |         /|  |  |                   /|   /  o
   /\       _  _  _       _   | |   _      |  |  |    __,      _      |__/       _|_
  /  \ |   / |/ |/ |    |/ \_ |/   |/      |  |  |   /  |    |/ \_    | \    |    |
 /(__/ |_/   |  |  |_/  |__/  |__/ |__/    |  |  |_/ \_/|_/  |__/     |  \_/ |_/  |_/
                       /|                                   /|
                       \|                                   \|      CLI v1.2.4
Welcome to the SMK application creation tool!
An application skeleton will be created for you at the current directory.
But first, please answer some questions about your new SMK application.

? Enter your application's name: mySmkProject
? Enter your application's title: My SMK Application
? Enter a short description for your application: This is a really cool map
? Enter the author's name: Vivid Solutions Inc.
? Enter the package name of SMK: @bcgov/smk
? Select the version of @bcgov/smk for your application: 1.2.4
? Select the template for your application: default
? Select the base map: BCGov
? Select the tools: about, coordinate, layers, pan, zoom, scale, identify, search
```

`Enter your application's name` will default to the name entered when you started the create process, but you are able to override that value here. Think of this as the "ID" for your application.

`Enter your application's title` will default to a 'pretty printed' version of an application name. You can supply a different name here if you prefer. This will be the label used in your SMK applications title and browser title.

`Enter a short description for your application` Allows you to enter a short description for your SMK application.

`Enter the author's name` Allows you to enter the name of the author for this application. This can be the developer's name, organization's name, or whatever identifiable author you prefer for your application.

`Enter the package name of SMK` Will default to `@bcgov/smk`. Generally, you can leave this at the default unless you want to override with a different flavour of SMK.

`Select the version of @bcgov/smk for your application` will retrieve and provide you with a number of recent version options for SMK that you can select. Press your arrow direction buttons up or down to choose an option, and press enter to select it. This will default to the most recent version.

`Select the template for your application` The SMK-CLI comes with two different template options for setting up your application: `defaut` which initializes your application with default values, or `mobile` which optimizes the application for mobile devices. Press your arrow direction buttons up or down to choose an option, and press enter to select it. Thw default is `default`.

`Select the base map` This will be the default map viewable on your application. Currently SMK uses the Esri basemap layers:

- Topographic
- Streets
- Imagery
- Oceans
- ShadedRelief
- DarkGray
- Gray

SMK also uses:

- BCGov
- BCGovHillshade

Press your arrow direction buttons up or down to choose an option, and press enter to select it. The default is `BCGov`.

`Enter an Esri API key` Several basemaps are provided by Esri and require the use of an API key. If you picked an Esri layer, you will see this prompt. To get an API key, create an [ArcGIS Location Platform account](https://location.arcgis.com/sign-up/) or [ArcGIS Online account](https://www.esri.com/en-us/arcgis/products/arcgis-online/trial) and then create an [API key](https://developers.arcgis.com/documentation/mapping-apis-and-services/security/api-keys/).

`Select the tools` Allows you to pre-select from a set of default SMK tools to activate. Press `space` to select, `a` to toggle all, `i` to invert selection. The options are:

- about
- coordinate
- layers
- pan
- zoom
- markup
- scale
- minimap
- directions
- location
- select
- identify
- search
- geomark

`about`, `coordinate`, `layers`, `pan`, `zoom`, `scale`, `identify`, and `search` are selected by default. You can find more information about these specific tools in the [SMK documentation](https://bcgov.github.io/smk/)

## Generating the Skeleton

After your options have been provided, SMK-CLI will generate your application and configuration. This process only takes a few seconds, and you will need internet access to download the required packages. 

### What's Created

You'll now have a new folder in the location where `smk create` was executed with the name you supplied. The folder contains generated configuration files and all required node modules.

## Final Steps

You've now created a new SMK application. SMK-CLI will prompt you if you'd like to immediately jump into the editor.

To run the app locally at any time, navigate to the app directory and run:

`npm run view`

This will launch an HTTP server and open your SMK app in a browser window.

Before moving on to testing and editing your application, you may want to push your generated code into a repository (GitHub, for example) so you can persist edits into an accessible location.

## Edit your application

Check out [Editing an SMK Application](edit-an-app.md)

[Back to Index](index.md)

---

![logo](smk-logo-sm.png)
