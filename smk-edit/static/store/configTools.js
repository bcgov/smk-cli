import configToolLayers from './configToolLayers.js'
import { vueComponent } from '../vue-util.js'

export default mix( {
    state: function () {
        return []
    },
    getters: {
        configHasTool: function ( state, getters ) {
            return getters.version && function ( type ) {
                return !!state.find( function ( t ) { return t.type == type } )
            }
        },
        configTool: function ( state, getters ) {
            return getters.version && function ( type ) {
                var t = state.find( function ( t ) { return t.type == type } )
                if ( !t ) throw Error( `Config tool "${ t.type }" not defined` )
                return t
            }
        },
    },
    mutations: {
        configTool: function ( state, tool ) {
            if ( !tool.type )
                throw Error( `Tool does not have a type` )

            var i = state.findIndex( function ( t ) { return t.type == tool.type } )
            if ( i == -1 ) {
                state.push( tool )
            }
            else {
                state[ i ] = tool
            }
        },
    },
    actions: {
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