var serviceUrl = "../";
var wmsUrl = "https://openmaps.gov.bc.ca/geo/pub/ows";
var wmsPostfix = "?service=WMS&request=GetCapabilities";
var wmsVersion = "1.3.0";

var catalogLayers = [];
var catalogTreeSource = [];
var basemapViewer;

var app = new Vue(
{
    el: '#content',
    data: 
    {
        config: 
        {
            lmfId: "",
            lmfRevision: 1,
            name: "",
            createdBy: "",
            createdDate: "",
            modifiedBy: "",
            modifiedDate: "",
            version: "",
            surround: { type: "default", title: "" },
            viewer: {
                type: "leaflet",
                device: "auto",
                panelWidth: 400,
                deviceAutoBreakpoint: 500,
                themes: [],
                location: { center: [-125, 55], zoom: 5 },
                baseMap: 'Topographic',
                clusterOption: { showCoverageOnHover: false }
            },
            tools: [],
            layers: []
        },
        editingLayer: null,
        editingTool: null,
        lastTab: 'init',
        currentTab: 'init',
        tabs: ['init', 'identity', 'basemap', 'mpcm-layers', 'wms-layers', 'vector-layers', 'layers', 'tools', 'edit-layer'],
        componentKey: 0,
        mySelf: this
    },
    methods: 
    {
        tabSwitch: function (tab) 
        {
            this.lastTab = this.currentTab;
            this.currentTab = tab;
            $('#contentPanel').show();
        },
        forceRerender() 
        {
            this.componentKey += 1;  
        },
        saveConfig: function(event)
        {
            saveConfig(this.config);
        },
        fetchTool: function (toolType)
        {
            return _.pickBy(this.config.tools, function(tool) 
            {
                return tool.type === toolType;
            });
        }
    },
    computed: 
    {
        currentTabComponent: function () 
        {   
            this.componentKey += 1;
            return this.currentTab.toLowerCase();
        },
        catalogLayers: function ()
        {
            return _.pickBy(this.config.layers, function(layer) 
            {
                return layer.type === 'esri-dynamic';
            });
        },
        wmsLayers: function ()
        {
            return _.pickBy(this.config.layers, function(layer) 
            {
                return layer.type === 'wms';
            });
        },
        vectorLayers: function ()
        {
            return _.pickBy(this.config.layers, function(layer) 
            {
                return layer.type === 'vector';
            });
        }
    },
    updated: function () 
    {
        this.$nextTick(function () 
        {
            // triggered twice in a row after toggling component?
            if(this.lastTab !== this.currentTab)
            {
                switch(this.currentTab)
                {
                    case 'basemap':
                        configureBasemapViewer();
                    break;
                    case 'mpcm-layers':
                        loadDataBCCatalogLayers();
                    break;
                    case 'vector-layers':
                        configureFileUpload();
                    break;
                    case 'edit-layer':
                        configureUpdatePanel();
                    break;
                    case 'layers':
                        configureLayersView();
                    break;
                    case 'edit-tool':
                        configureToolEditPanel();
                    break;
                }
            }

            $('select').formSelect();
            M.AutoInit(); 
            M.updateTextFields();

            this.lastTab = this.currentTab;
        })
    }
});

$(document).ready(function()
{
    // create a background map, remove the zoom buttons
    var map = L.map('backgroundMap', { zoomControl: false });
    // disable any ability to move/navigate the map
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    // add a base layer (osm for now)
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib = 'Map Tiles © <a href="https://openstreetmap.org">OpenStreetMap</a>';
    var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});
    map.addLayer(osm);
    // set the map to a random location somewhere roughly over British Columbia
    var rndLat = Math.random() * (60 - 48.3) + 47.294;
    var rndLon = (Math.random() * (124 - 111.291) + 114) * -1;
    var rndZoom = Math.floor(Math.random() * (11 - 6) + 6);
    map.setView(new L.latLng(rndLat, rndLon), rndZoom, { animate: true, duration: 60 } );
    map.invalidateSize();

    // material init
    $('.materialboxed').materialbox();
    $('.parallax').parallax();
    $('.sidenav').sidenav();
    
    M.AutoInit();
    
    // load the config data, preload mpcm layers
    loadConfig();

    // timeout listener
    setTimeout(statusCheck, 5000);

});

function statusCheck()
{
    $.ajax
	({
		url: serviceUrl + 'Ping',
		type: "get",
		success: function (result)
		{
            setTimeout(statusCheck, 5000);
		},
		error: function (status)
		{
            $('#slide-out').empty();
            $('#contentPanel').empty();
            $('#titlePanel').empty();
            $('#titlePanel').append('<p class="label" style="background: #c50d0d; border-top: 2px solid black; border-left: 2px solid black; border-right: 2px solid black;"> SMK UI service has disconnected</p><p class="label" style="background: #c50d0d; border-left: 2px solid black; border-right: 2px solid black;"> Please close this window and restart the service</p><p class="label" style="background: #c50d0d; border-bottom: 2px solid black; border-left: 2px solid black; border-right: 2px solid black;"> enter "smk ui [port]" in your command line</p>');

			M.toast({ html: 'Service unavailable. Please restart the SMK Conifg UI'});
		}
    });
}