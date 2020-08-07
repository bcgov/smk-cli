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
            if ( state.find( function ( ly ) { return ly.id == layer.id } ) )
                throw Error( `Layer "${ layer.title }" already exists` )

            state.push( layer )
        }
    },
}