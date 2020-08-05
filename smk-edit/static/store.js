import config from './store/config.js'

export const store = new Vuex.Store( {
    modules: {
        config: config
    },
    state: {
        serviceStatus: true,
        statusPingInterval: 5000,
        dirtyConfig: false,
        // editingLayer: null,
        // editingTool: null,
        currentTab: null,
        // tabs: ['init', 'identity', 'basemap', 'mpcm-layers', 'wms-layers', 'vector-layers', 'layers', 'tools', 'edit-layer'],
        // mySelf: this,
        wmsCatalogUrl: null
    },
    mutations: {
        // /^(?!serviceStatus)/ -- filter out these mutations from devtools
        serviceStatus: function ( state, status ) {
            state.serviceStatus = status
        },
        currentTab: function ( state, tab ) {
            state.currentTab = tab
        },
        dirtyConfig: function ( state, dirty ) {
            state.dirtyConfig = dirty
        },
        wmsCatalogUrl: function ( state, url ) {
            state.wmsCatalogUrl = url
        }
    },
    getters: {
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
                .catch( function ( err ) {
                    M.toast( {
                        html: 'Error: ' + JSON.stringify( err )
                    } )
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
                    context.commit( 'dirtyConfig', false )
                } )
                .catch( function ( err ) {
                    M.toast( {
                        html: 'Error: ' + JSON.stringify( err )
                    } )
                } )
        },
        statusCheck: function ( context ) {
            var nextPing
            return fetch( '/ping' )
                .then( function ( resp ) {
                    if ( !resp.ok ) throw Error( 'ping failed' )
                    return resp.json()
                } )
                .then( function ( obj ) {
                    if ( !obj.ok ) throw Error( 'ping failed' )

                    if ( obj.next )
                        context.state.statusPingInterval = obj.next

                    context.commit( 'serviceStatus', true )
                } )
                .catch( function () {
                    context.commit( 'serviceStatus', false )
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
