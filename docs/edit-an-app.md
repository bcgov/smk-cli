# Editing your SMK application

Before this step, you should have an existing SMK application created. If you don't, review [Creating an SMK application](create-an-app.md).

Before you can edit your application, you'll want to open your command line and navigate to the applications folder

```bash
cd /myApplications/mySmkApplication
```

Once you've navigated to your applciation, you use the SMK-CLI `edit` command.

```bash
smk edit
```

This will launch the SMK-CLI editor in your browser. As part of this process, a mini-api is launched in the background. To prevent issues with any other development servers you may have running, you can optionally supply a port number. The default is `1337`

```bash
smk edit -p 1337
```

In your command line utility, you'll see some configuration and logging info presented:

```bash
Starting service..
Opening default browser at http://localhost:1337...
Endpoints available:
        GET     /       -> /npm/node_modules/smk-cli/smk-edit/static
        GET     /assets -> ./assets
        GET     /layers -> ./layers
        GET     /module -> /smk-cli/node_modules/smk/dist
        POST    /catalog/asset
        GET     /catalog/asset
        GET     /catalog/asset/:id
        POST    /catalog/local
        GET     /catalog/local
        DELETE  /catalog/local/:id
        PUT     /catalog/local/:id
        GET     /catalog/local/:id
        GET     /catalog/mpcm
        GET     /catalog/mpcm/:id
        GET     /catalog/wms/:url
        GET     /catalog/wms/:url/:id
        POST    /config
        GET     /config
        POST    /convert/csv
        POST    /convert/geojson
        POST    /convert/kml
        POST    /convert/shape
        GET     /ping
Current path is /mySmkProjects/mySmkProject
Base path is ./
Configuration path is ./smk-config.json
Layers catalog path is ./layers
Assets catalog path is ./assets
Temp path is ./.temp
Service listening at http://localhost:1337/
Hit Ctrl-C to exit

2020-09-24T22:12:35.094Z GET /config
    Reading config from /mySmkProjects/mySmkProject/smk-config.json
```

Then your default browser will open to the startup window of the editor:

![editor](smk-cli-editor.png)

From this screen you can see a navigation bar on the left which contains the main menus for the editor:

![Menu](smk-cli-menu.png)

The main menu contains three options:

- Applciation
- Layers
- Tools

By default, the SMK-CLI editor launches with the `Application` menu open, and you can click on any of the options to open up the related screens.

`Application` contains options for configuring the default settings for your map. This is explained in greater detail below in the section "Application"

`Layers` contains options for creating and configuring layers and folders in your application. This is explained in greater detail below in the section "Layers"

`Tools` contains options for adding and configuring tools that can be used in your application. This is explained in greater detail below in the section "Tools"

## Saving and testing your changes

At the bottom of the application is a set of buttons, `save` and `view`.

![Save and View Buttons](smk-cli-buttons.png)

Click once on the `save` button to save any configuration changes you've made to your application.

Click once on the `view` button to launch your application in a popup window so you can test out any configuration changes you've made. Once you're done, click anywhere outside the popup window to close the view and return to the editor screen.

You can also test your application by building and launching it on a local server. Instructions for deploying your application on the server can be found in the [SMK documentation](https://bcgov.github.io/smk/)

## Application

The Applcation screen shows you your current settings for the application name and title, and allows you to modify the following settings for your application.

- Map Viewer (Leaflet or ESRI 3D)
- Device (Auto-detect, Desktop, or Mobile)
- Basemap (ESRI basemaps)

You can use the map on the right to select your applications initial extent. When the appliction is launched, this is the location that the map will zoom to. By default the extent is a bounding box around British Columbia, Canada.

To change your initial extent and zoom levels, you can pan and zoom the map using your mouse to the desired location using the provided leaflet "slippy" map.

## Layers

The layers screen is more complex then the application screen, containing a default for for your layers and folders, and multiple sub-menu's for loading layers into your application.

For a new application, the layer screen will initially display empty:

![Empty Layer Window](smk-cli-layers.png)

To add layers, you'll need to select one of the options in the sub-menus provided on the left-hand menu.

![Layers Sub-Menu](smk-cli-layers-submenu.png)

You'll notice that there are three options in the sub-menu:

- Manage DataBC Layers
- Manage WMS Layers
- Manage Vector Layers

### DataBC Layers

`Manage DataBC Layers` allows you to select layers from the [DataBC Layer Catalog](https://catalogue.data.gov.bc.ca/dataset?download_audience=Public). These are Government of British Columbia datasets provided by the BC Geographic Warehouse and contain layers covering a wide range of ministries, business areas and data sets. By default, only publically accessible layers are provided. An active internet connection is required to load available layers from the DataBC Catalog.

![DataBC Selector](smk-cli-databc-init.png)

On the left had side of the screen there is a "Filter Catalog" option, and a folder listing of available layers. Because the layer list is quite large, convering hundreds of folder and layer groups, it's best to filter your options down to the datasets you're specifically looking for.

#### Filtering DataBC Layers

To filter the layers, click once on the "Filter Catalog" header. This will open the filter options.

![Filter](smk-cli-databc-filter.png)

To filter available layers, type your filter text into the "Show Catalog Entries Containing" box and click once on the ![Filter](filter-button.png) button. The layer list will be updated to filter out options that do not match your text search. Some folders with matching layer names may be automatically opened as well.

#### Adding DataBC Layers

Once you've found a layer you wish to add. Double-click on the layer and it will add it to your application. You can see selected layers to the right of the layer listing.

![Added Layers](smk-cli-databc-layers.png)

The added DataBC Catalog layers have four options on the bottom-right of the layer panels for working with the layers. These options, from left to right, are 'View in Catalog', 'Show/Hide', 'Edit', and 'Remove'.

![Layer edit buttons](smk-cli-layer-edit-buttons.png)

`View in catalog` will open a seperate browser tab, which displays the DataBC Data Catalog page with information about the layer.

`Show/Hide` is a toggle button that indicates if this layer should be turned on when the application is launched. By default layers are set to hidden.

`Edit` will open an advanced settings popup that allows you to modify the layer details. Please view [Editing a Layer](edit-layer.md) from more information on the layer editing options.

`Remove` will remove the layer from your application. Be careful, as removing a layer will also delete any of your configured settings with that layer.

### WMS Layers

`Manage WMS Layers` allows you to supply a link to a WMS service, and via the service `GetCapabilities` load a listing of available WMS layers to add to your application.

![WMS Layers](smk-cli-wms-init.png)

The functionality for WMS layers is identical to that of the DataBC layers described above. At the top of the options you can configure your WMS service URL. There is also a "Filter Catalog" option, and a folder listing of available layers.

#### Setting your WMS URL

By default, the application will set the WMS service URL to the [DataBC Catalog WMS Service](https://openmaps.gov.bc.ca/geo/pub/wms). To change your WMS service, click once on the WMS Selector.

![WMS Selector](smk-cli-wms-selector.png)

You'll notice that the selector is actually a dropdown select box. SMK-CLI is preconfigured with some additional default WMS Services. These include:

- [DataBC Catalog WMS Service](https://openmaps.gov.bc.ca/geo/pub/wms) (selected by default)
- [Maps.th.gov.bc.ca](https://maps.th.gov.bc.ca/geoV05/ows)
- [NRS GeoServer](https://geo.nrs.gov.bc.ca/pub/geoserver/wms)
- Another WMS Service

![Selector](smk-cli-wms-selector.png)

To add another WMS service that is not listed in the default options, click once on 'Another WMS Service'. You will be provided with a text box where you can supply the full URL to a new WMS service

![Custom URL](smk-cli-wms-custom.png)

Click once on the 'Load Catalog' button to load layers from your provided services `GetCapabilities`

#### Filtering WMS Layers

Filtering WMS layers works identically to the DataBC Layer filtering detailed above. To filter the layers, click once on the "Filter Catalog" header. This will open the filter options.

![Filter](smk-cli-databc-filter.png)

To filter available layers, type your filter text into the "Show Catalog Entries Containing" box and click once on the ![Filter](filter-button.png) button. The layer list will be updated to filter out options that do not match your text search. Some folders with matching layer names may be automatically opened as well.

#### Adding WMS Layers

Adding layers from a WMS service works identically to the DataBC Layer options. Once you've found a layer you wish to add. Double-click on the layer and it will add it to your application. You can see selected layers to the right of the layer listing.

![Added Layers](smk-cli-wms-layers.png)

The added WMS layers have three options on the bottom-right of the layer panels for working with the layers. These options, from left to right, are 'View in Catalog', 'Show/Hide', 'Edit', and 'Remove'.

![Layer edit buttons](smk-cli-wms-layer-edit-buttons.png)

`Show/Hide` is a toggle button that indicates if this layer should be turned on when the application is launched. By default layers are set to hidden.

`Edit` will open an advanced settings popup that allows you to modify the layer details. Please view [Editing a Layer](edit-layer.md) from more information on the layer editing options.

`Remove` will remove the layer from your application. Be careful, as removing a layer will also delete any of your configured settings with that layer.

### Vector Layers

## Tools

![logo](smk-logo-sm.png)
