import viewer from './config-viewer.js'
import layers from './config-layers.js'
import tools from './config-tools.js'

export default {
    state: function () {
        return {
            name: null,
    //     createdBy: "",
    //     createdDate: "",
    //     modifiedBy: "",
    //     modifiedDate: "",
        }
    },
    modules: {
        viewer: viewer,
        layers: layers,
        tools: tools
    },
    getters: {
        config: function ( state ) {
            return state
        },
        configName: function ( state ) {
            return state.name
        },
        hasConfig: function ( state ) {
            return !!state.name
        }
    },
    mutations: {
        config: function ( state, config ) {
            Object.assign( state, config )
        },
        configName: function ( state, name ) {
            state.name = name
        },
    },
}