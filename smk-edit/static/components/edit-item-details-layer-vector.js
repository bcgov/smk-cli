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
            showCoverageOnHover: {
                get: function () {
                    var layer = this.$store.getters.configLayer( this.itemId )
                    return layer.clusterOption && !!layer.clusterOption.showCoverageOnHover
                },
                set: function ( val ) {
                    var layer = this.$store.getters.configLayer( this.itemId )
                    if ( !layer.clusterOption ) layer.clusterOption = {}
                    layer.clusterOption.showCoverageOnHover = !!val
                    this.$store.dispatch( 'configLayer', layer )
                }
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
