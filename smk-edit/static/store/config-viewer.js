export default {
    state: function () {
        return {
            type: null,
            device: null,
            baseMap: null,
            esriApiKey: null,
            location: {
                center: null,
                extent: null,
                zoom: null
            }
//         panelWidth: 400,
//         deviceAutoBreakpoint: 500,
//         themes: [],
//         location: { center: [-125, 55], zoom: 5 },
//         baseMap: 'Topographic',
//         clusterOption: { showCoverageOnHover: false }
        }
    },
    getters: {
        configViewerType: function ( state ) {
            return state.type
        },
        configViewerDevice: function ( state ) {
            return state.device || 'auto'
        },
        configViewerBaseMap: function ( state ) {
            return state.baseMap || 'Topographic'
        },
        configViewerEsriApiKey: function ( state ) {
            return state.esriApiKey
        },
        configViewerLocation: function ( state ) {
            return state.location
        },
    },
    mutations: {
        configViewerType: function ( state, type ) {
            state.type = type
        },
        configViewerDevice: function ( state, device ) {
            state.device = device
        },
        configViewerBaseMap: function ( state, baseMap ) {
            state.baseMap = baseMap
        },
        configViewerEsriApiKey: function ( state, esriApiKey ) {
            state.esriApiKey = esriApiKey
        },
        configViewerLocation: function ( state, location ) {
            state.location = location
        },
    },
}