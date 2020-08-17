export default {
    state: function () {
        return []
    },
    getters: {
        configLayers: function ( state ) {
            return state
        },
        configHasLayer: function ( state, getters ) {
            return getters.version && function ( id ) {
                return !!state.find( function ( ly ) { return ly.id == id } )
            }
        },
        configLayer: function ( state, getters ) {
            return getters.version && function ( id ) {
                var ly = state.find( function ( ly ) { return ly.id == id } )
                if ( !ly ) throw Error( `Config layer "${ ly.id }" not defined` )
                return ly
            }
        },
        configLayerStyle: function ( state, getters ) {
            return getters.version && function ( id ) {
                return getters.configLayer( id ).style || {}
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
        },
        configLayer: function ( state, layer ) {
            var index = state.findIndex( function ( ly ) { return ly.id == layer.id } )
            if ( index == -1 )
                throw Error( `Layer "${ layer.id }" doesn't exist` )

            Vue.set( state, index, layer )
        },
        configLayerRemove: function ( state, layer ) {
            var index = state.findIndex( function ( ly ) { return ly.id == layer.id } )
            if ( index == -1 )
                throw Error( `Layer "${ layer.id }" doesn't exist` )

            state.splice( index, 1 )
            // Vue.set( state, index, layer )
        }
    },
    actions: {
        configLayer: function ( context, layer ) {
            var old = context.getters.configLayer( layer.id )
            context.commit( 'configLayer', Object.assign( old, layer ) )
            context.commit( 'bumpVersion' )
        },
        configLayerRemove: function ( context, layer ) {
            context.commit( 'configLayerRemove', layer )
            context.commit( 'bumpVersion' )
        },
        configLayerStyle: function ( context, layerStyle ) {
            var ly = context.getters.configLayer( layerStyle.id )
            if ( !ly.style ) ly.style = {}
            delete layerStyle.id
            Object.assign( ly.style, layerStyle )
            context.commit( 'configLayer', ly )
            context.commit( 'bumpVersion' )
        },
    }
}