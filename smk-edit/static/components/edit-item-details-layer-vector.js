import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            dataUrl: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).dataUrl
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, dataUrl: val } )
                }
            },
            useClustering: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).useClustering
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, useClustering: val } )
                }
            },
            useHeatmap: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).useHeatmap
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, useHeatmap: val } )
                }
            },
        },
        mounted: function () {
            M.updateTextFields()
            M.textareaAutoResize( this.$refs.dataUrl )
        },
        updated: function () {
            M.textareaAutoResize( this.$refs.dataUrl )
        }
    } )
} )
