export default {
    state: function () {
        return []
    },
    getters: {
        mpcmLayers: function ( state ) {
            return state.filter( function ( ly ) {
                return !!ly.mpcmId
            } )
        },
        wmsLayers: function ( state ) {
            return state.filter( function ( ly ) {
                return ly.type == 'wms'
            } )
        },
        vectorLayers: function ( state ) {
            return state.filter( function ( ly ) {
                return ly.type == 'vector'
            } )
        }
    },
    mutations: {
        configLayersAppend: function ( state, layer ) {
            state.push( layer )
        }
    }
}