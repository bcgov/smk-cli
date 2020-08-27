import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            within: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).within
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, within: val } )
                }
            },
            commandWithin: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.within
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', within: val } )
                }
            },
            commandSelect: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.select
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', select: val } )
                }
            },
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
