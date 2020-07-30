import { store } from './store.js'
import { importComponents } from './vue-util.js'

var components = importComponents( [
    './components/app-header.js',
    './components/app-main.js',
    './components/app-footer.js',
    './components/tab-application.js',
    './components/tab-viewer.js',
    './components/tab-mpcm-layers.js',
    './components/tab-wms-layers.js',
    './components/tab-vector-layers.js',
] )

var serviceUrl = "../";
var wmsUrl = "https://openmaps.gov.bc.ca/geo/pub/ows";
var wmsPostfix = "?service=WMS&request=GetCapabilities";
var wmsVersion = "1.3.0";

var catalogLayers = [];
var catalogTreeSource = [];
var basemapViewer;

components.then( function () {
    var app = new Vue( {
        el: '#content',
        store: store,
        methods: {
            saveConfig: function(event) {
                saveConfig( this.config );
            },
            // testConfig: function(event)
            // {
            //     testConfig(this.config);
            // },
            // buildConfig: function(event)
            // {
            //     buildConfig(this.config);
            // }
        },
        computed: {
            serviceStatus: function () {
                return this.$store.state.serviceStatus
            }
        },
        updated: function () {
            this.$nextTick(function () {
                // triggered twice in a row after toggling component?
                if(this.lastTab !== this.currentTab) {
                    switch(this.currentTab) {
                        case 'basemap':
                            configureBasemapViewer();
                        break;
                        case 'mpcm-layers':
                            loadDataBCCatalogLayers();
                        break;
                        case 'vector-layers':
                            configureFileUpload();
                        break;
                        // case 'edit-layer':
                        //     configureUpdatePanel();
                        // break;
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
    } )

    app.$store.commit( 'currentTab', 'tab-application' )

    app.$store.dispatch( 'loadConfig' )

    statusCheck()

    function statusCheck() {
        fetch( '/ping' )
            .then( function ( resp ) {
                if ( !resp.ok ) throw Error( 'ping failed' )
                return resp.json()
            } )
            .then( function ( obj ) {
                if ( !obj.ok ) throw Error( 'ping failed' )
                app.$store.commit( 'serviceStatus', true )
            } )
            .catch( function () {
                if ( app.serviceStatus )
                    M.toast( { html: 'Service not responding. Please restart the SMK Edit service.' } )
                app.$store.commit( 'serviceStatus', false )
            } )
            .finally( function () {
                // setTimeout( statusCheck, 5000 )
            } )
    }
} )
