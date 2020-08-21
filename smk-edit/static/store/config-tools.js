import configToolLayers from './config-tool-layers.js'

export default mix( {
    state: function () {
        return []
    },
    getters: {
        configTools: function ( state, getters ) {
            return state
        },
        configEnabledTools: function ( state, getters ) {
            return state.filter( function ( t ) {
                return t.enabled
            } )
        },
        configHasTool: function ( state, getters ) {
            return getters.version && function ( type, instance ) {
                return !!state.find( toolMatch( { type, instance } ) )
            }
        },
        configTool: function ( state, getters ) {
            return getters.version && function ( type, instance ) {
                var t = state.find( toolMatch( { type, instance } ) )
                if ( !t ) throw Error( `Config tool "${ type }${ instance ? ':' : '' }${ instance || '' }" not defined` )
                return t
            }
        },
    },
    mutations: {
        configTool: function ( state, tool ) {
            var index = state.findIndex( toolMatch( tool ) )
            if ( index == -1 )
                throw Error( `Config tool "${ tool.type }${ tool.instance ? ':' : '' }${ tool.instance || '' }" not defined` )

            Vue.set( state, index, tool )
        },
        configToolAppend: function ( state, tool ) {
            var index = state.findIndex( toolMatch( tool ) )
            if ( index != -1 )
                throw Error( `Config tool "${ tool.type }${ tool.instance ? ':' : '' }${ tool.instance || '' }" already exists` )

            state.push( tool )
        },
        configToolRemove: function ( state, tool ) {
            var index = state.findIndex( toolMatch( tool ) )
            if ( index == -1 )
                throw Error( `Config tool "${ tool.type }${ tool.instance ? ':' : '' }${ tool.instance || '' }" not defined` )

            state.splice( index, 1 )
        },
    },
    actions: {
        configTool: function ( context, tool ) {
            var old = context.getters.configTool( tool.type, tool.instance )
            context.commit( 'configTool', Object.assign( old, tool ) )
            context.commit( 'bumpVersion' )
        },
        configToolEnable: function ( context, tool ) {
            if ( context.getters.configHasTool( tool.type, tool.instance ) ) {
                var old = context.getters.configTool( tool.type, tool.instance )
                old.enabled = true
                context.commit( 'configTool', old )
            }
            else {
                context.commit( 'configToolAppend', { ...tool, enabled: true } )
            }
            context.commit( 'bumpVersion' )
        },
        configToolRemove: function ( context, tool ) {
            context.commit( 'configToolRemove', tool )
            context.commit( 'bumpVersion' )
        },
    }
}, [
    configToolLayers,
] )

function mix( module, mixins ) {
    mixins.forEach( function ( m ) {
        Object.assign( module.getters, m.getters )
        Object.assign( module.mutations, m.mutations )
        Object.assign( module.actions, m.actions )
    } )

    return module
}

function toolMatch( tool ) {
    if ( !tool.type )
        throw Error( `Tool does not have a type` )

    return function ( t ) {
        return t.type == tool.type && ( !tool.instance || ( t.instance == tool.instance ) )
    }
}