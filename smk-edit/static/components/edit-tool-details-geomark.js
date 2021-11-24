import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-tool-details.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'toolType', 'toolInstance' ],
        computed: {
            enableCreateFromFile: {
                get: function () {
                    return this.$store.getters.configTool( this.toolType, this.toolInstance ).enableCreateFromFile
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configTool', { type: this.toolType, instance: this.toolInstance, enableCreateFromFile: val } )
                }
            }
        }
    } )
} )