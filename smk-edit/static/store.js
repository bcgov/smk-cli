import config from './store/config.js'

export const store = new Vuex.Store( {
    modules: {
        config: config
    },
    state: {
        serviceStatus: true,
        dirtyConfig: false,
        // config: {},
        // {
        //     lmfId: "",
        //     lmfRevision: 1,
        //     name: "",
        //     createdBy: "",
        //     createdDate: "",
        //     modifiedBy: "",
        //     modifiedDate: "",
        //     version: "",
        //     surround: { type: "default", title: "" },
        //     viewer: {
        //         type: "leaflet",
        //         device: "auto",
        //         panelWidth: 400,
        //         deviceAutoBreakpoint: 500,
        //         themes: [],
        //         location: { center: [-125, 55], zoom: 5 },
        //         baseMap: 'Topographic',
        //         clusterOption: { showCoverageOnHover: false }
        //     },
        //     tools: [],
        //     layers: []
        // },
        editingLayer: null,
        editingTool: null,
        currentTab: null,
        tabs: ['init', 'identity', 'basemap', 'mpcm-layers', 'wms-layers', 'vector-layers', 'layers', 'tools', 'edit-layer'],
        mySelf: this
    },
    mutations: {
        serviceStatus: function ( state, status ) {
            state.serviceStatus = status
        },
        currentTab: function ( state, tab ) {
            state.currentTab = tab
        },
        dirtyConfig: function ( state, dirty ) {
            state.dirtyConfig = dirty
        }
    },
    getters: {
        // catalogLayers: function ( state ) {
        //     return _.pickBy( state.config.layers, function(layer) {
        //         return layer.type === 'esri-dynamic';
        //     });
        // },
        // wmsLayers: function ( state ) {
        //     return _.pickBy( state.config.layers, function(layer) {
        //         return layer.type === 'wms';
        //     });
        // },
        // vectorLayers: function ( state ) {
        //     return _.pickBy( state.config.layers, function(layer) {
        //         return layer.type === 'vector';
        //     });
        // }
    },
    actions: {
        loadConfig: function ( context ) {
            return fetch( '/config' )
                .then( function ( resp ) {
                    if ( !resp.ok ) throw Error( 'failed to get config' )
                    return resp.json()
                } )
                .then( function ( data ) {
                    context.commit( 'config', data )
                } )
        },
        saveConfig: function ( context ) {
            return fetch( '/config', {
                    method: 'POST',
                    cache: 'no-cache',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify( context.state.config )
                } )
                .then( function( resp ) {
                    return resp.json()
                } )
                .then( function ( result ) {
                    if ( !result.ok ) throw Error( 'Result failed' )
                    M.toast( {
                        html: JSON.stringify( result.message )
                    } )
                } )
                .catch( function ( err ) {
                    M.toast( {
                        html: 'Error: ' + JSON.stringify( err )
                    } )
                } )
        }

    }
} )

store.subscribe( function ( mutation ) {
    // console.log(mutation)
    if ( mutation.type.startsWith( 'config' ) && mutation.type.length > 6 ) {
        store.commit( 'dirtyConfig', true )
    }
} )
