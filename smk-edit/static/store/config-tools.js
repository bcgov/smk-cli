import configToolAbout from './config-tool-about.js'
import configToolBaseMaps from './config-tool-baseMaps.js'
import configToolDirections from './config-tool-directions.js'
import configToolIdentify from './config-tool-identify.js'
import configToolLayers from './config-tool-layers.js'
import configToolListMenu from './config-tool-list-menu.js'
import configToolLocation from './config-tool-location.js'
import configToolMeasure from './config-tool-measure.js'
import configToolQuery from './config-tool-query.js'
import configToolScale from './config-tool-scale.js'
import configToolSearch from './config-tool-search.js'
import configToolSelect from './config-tool-select.js'
import configToolVersion from './config-tool-version.js'
import configToolZoom from './config-tool-zoom.js'


export default mix( [
    configToolAbout,
    configToolBaseMaps,
    configToolDirections,
    configToolIdentify,
    configToolLayers,
    configToolListMenu,
    configToolLocation,
    configToolMeasure,
    configToolQuery,
    configToolScale,
    configToolSearch,
    configToolSelect,
    configToolVersion,
    configToolZoom
], function ( typeFilter ) { return {
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

                return typeFilter( type ).get( t )
            }
        },
    },
    mutations: {
        configTool: function ( state, tool ) {
            var index = state.findIndex( toolMatch( tool ) )
            if ( index == -1 )
                throw Error( `Config tool "${ tool.type }${ tool.instance ? ':' : '' }${ tool.instance || '' }" not defined` )

            Vue.set( state, index, typeFilter( tool.type ).set( tool ) )
        },
        configToolAppend: function ( state, tool ) {
            var index = state.findIndex( toolMatch( tool ) )
            if ( index != -1 )
                throw Error( `Config tool "${ tool.type }${ tool.instance ? ':' : '' }${ tool.instance || '' }" already exists` )

            state.push( typeFilter( tool.type ).set( tool ) )
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
                var cfg = typeFilter( tool.type ).get( tool )
                cfg.enabled = true
                context.commit( 'configToolAppend', cfg )
            }
            context.commit( 'bumpVersion' )
        },
        configToolSubProp: function ( context, toolSubProp ) {
            var tool = context.getters.configTool( toolSubProp.type, toolSubProp.instance )
            delete toolSubProp.type
            delete toolSubProp.instance
            var propName = toolSubProp.propName
            delete toolSubProp.propName
            if ( !tool[ propName ] ) tool[ propName ] = {}
            Object.assign( tool[ propName ], toolSubProp )
            context.commit( 'configTool', tool )
            context.commit( 'bumpVersion' )
        },
        configToolRemove: function ( context, tool ) {
            context.commit( 'configToolRemove', tool )
            context.commit( 'bumpVersion' )
        },
    } }
} )

function mix( mixins, module ) {
    var filters = {}
    const identity = {
        get: function ( v ) { return v },
        set: function ( v ) { return v },
    }
    var typeFilter = function ( type ) {
        if ( type in filters ) return Object.assign( {}, identity, filters[ type ] )
        return identity
    }

    var mod = module( typeFilter )

    mixins.forEach( function ( m ) {
        Object.assign( mod.getters, m.getters )
        Object.assign( mod.mutations, m.mutations )
        Object.assign( mod.actions, m.actions )
        Object.assign( filters, m.filters )
    } )

    return mod
}

function toolMatch( tool ) {
    if ( !tool.type )
        throw Error( `Tool does not have a type` )

    return function ( t ) {
        return t.type == tool.type && ( !tool.instance || ( t.instance == tool.instance ) )
    }
}