import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/text-editor.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            content: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).content
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, content: val } )
                }
            },
        },
        mounted: function () {
            // M.updateTextFields()
        },
        updated: function () {
        }
    } )
} )
