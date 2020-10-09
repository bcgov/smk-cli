export default {
    state: function () {
        return []
    },
    getters: {
        configLayers: function ( state ) {
            return state
        },
        configLayersMpcm: function ( state ) {
            return state.filter( function ( ly ) {
                return !!ly.mpcmId
            } )
        },
        configLayersWms: function ( state ) {
            return state.filter( function ( ly ) {
                return ly.type == 'wms'
            } )
        },
        configLayersVector: function ( state ) {
            return state.filter( function ( ly ) {
                return ly.type == 'vector'
            } )
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
        configLayerQueries: function ( state, getters ) {
            return getters.version && function ( id ) {
                return getters.configLayer( id ).queries || []
            }
        },
        configLayerQuery: function ( state, getters ) {
            return getters.version && function ( id, queryId ) {
                var q = getters.configLayerQueries( id ).find( function ( q ) { return q.id == queryId } )
                if ( !q ) throw Error( `Query "${ queryId }" doesn't exist` )
                return q
            }
        },
        configLayerQueryParameters: function ( state, getters ) {
            return getters.version && function ( id, queryId ) {
                return getters.configLayerQuery( id, queryId ).parameters || []
            }
        },
        configLayerQueryPredicate: function ( state, getters ) {
            return getters.version && function ( id, queryId ) {
                var p = getters.configLayerQuery( id, queryId ).predicate
                if ( Array.isArray( p ) ) p = null
                return p || { operator: 'and', arguments: [] }
            }
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
        configLayerQueries: function ( context, layerQueries ) {
            var ly = context.getters.configLayer( layerQueries.id )
            ly.queries = layerQueries.queries
            context.commit( 'configLayer', ly )
            context.commit( 'bumpVersion' )
        },
        configLayerQueryParameters: function ( context, layerQueryParameters ) {
            var ly = context.getters.configLayer( layerQueryParameters.id )
            var q = ly.queries.find( function ( q ) { return q.id == layerQueryParameters.queryId } )
            if ( !q ) throw Error( `Query "${ layerQueryParameters.queryId }" doesn't exist` )
            q.parameters = layerQueryParameters.parameters
            context.commit( 'configLayer', ly )
            context.commit( 'bumpVersion' )
        },
        configLayerQueryPredicate: function ( context, layerQueryPredicate ) {
            var ly = context.getters.configLayer( layerQueryPredicate.id )
            var q = ly.queries.find( function ( q ) { return q.id == layerQueryPredicate.queryId } )
            if ( !q ) throw Error( `Query "${ layerQueryPredicate.queryId }" doesn't exist` )
            q.predicate = layerQueryPredicate.predicate
            context.commit( 'configLayer', ly )
            context.commit( 'bumpVersion' )
        },
    }
}