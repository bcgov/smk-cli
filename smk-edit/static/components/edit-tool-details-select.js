import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            commandClear: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.clear
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', clear: val } )
                }
            },
            commandRemove: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).command.remove
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolSubProp', { type: this.toolType, instance: this.toolInstance, propName: 'command', remove: val } )
                }
            },
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
