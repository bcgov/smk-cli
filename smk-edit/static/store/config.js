import viewer from './configViewer.js'
import layers from './configLayers.js'
import tools from './configTools.js'

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