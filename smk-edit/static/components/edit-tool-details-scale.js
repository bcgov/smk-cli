import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            showFactor: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showFactor
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showFactor: val } )
                }
            },
            showBar: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showBar
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showBar: val } )
                }
            },
            showZoom: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).showZoom
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, showZoom: val } )
                }
            },
        },
        mounted: function () {
            M.updateTextFields()
        },
        updated: function () {
        }
    } )
} )
