export default {
    state: function () {
        return {
            type: null,
            device: null,
            baseMap: null,
            location: {
                center: null,
                extent: null,
                zoom: null
            }
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
        configViewerLocation: function ( state, location ) {
            state.location = location
        },
    },
}