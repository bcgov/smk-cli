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
            displayMode: {
                get: function () {
                    var ly = this.$store.getters.configLayer( this.itemId )
                    return ly.useClustering ? 'cluster' : ly.useHeatmap ? 'heatmap' : 'raw'
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', {
                        id: this.itemId,
                        useClustering: val == 'cluster',
                        useHeatmap: val == 'heatmap',
                        useRaw: val == 'raw',
                    } )
                }
            },
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
