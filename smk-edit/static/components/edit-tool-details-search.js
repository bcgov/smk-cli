import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            showLocation: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showLocation
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showLocation: val } )
                }
            },
            showPanel: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showPanel
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showPanel: val } )
                    if ( !val ) this.showLocation = null
                }
            },
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
