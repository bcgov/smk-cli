export default {
    state: function () {
        return []
    },
    getters: {
        configLayers: function ( state ) {
            return state
        },
        configHasLayer: function ( state ) {
            return function ( id ) {
                return !!state.find( function ( ly ) { return ly.id == id } )
            }
        },
        configLayer: function ( state ) {
            return function ( id ) {
                var ly = state.find( function ( ly ) { return ly.id == id } )
                if ( !ly ) throw Error( `Config layer "${ ly.id }" not defined` )
                return ly
            }
        },
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