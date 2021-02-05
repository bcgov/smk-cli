import { vueComponent, importComponents } from '../vue-util.js'
import { zoomScale } from './presentation.js'

export default importComponents( [
    './components/edit-item-details-layer-wms.js',
    './components/edit-item-details-layer-esri-dynamic.js',
    './components/edit-item-details-layer-vector.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            isVisible: {
                get: function () {
                    var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                    if ( item.isVisible != null ) return item.isVisible
                    return this.$store.getters.configLayer( this.itemId ).isVisible
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolLayersDisplayItem', { id: this.itemId, isVisible: val } )
                }
            },
            isQueryable: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).isQueryable
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, isQueryable: val } )
                }
            },
            alwaysShowLegend: {
                get: function () {
                    var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                    return !!item.alwaysShowLegend
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolLayersDisplayItem', { id: this.itemId, alwaysShowLegend: val } )
                }
            },
            opacity: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).opacity
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, opacity: val } )
                }
            },
            scaleMin: {
                get: function () {
                    var s = this.$store.getters.configLayer( this.itemId ).scaleMin
                    if ( !s ) return 0
                    return zoomBracketForScale( s )[ 0 ]
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, scaleMin: !val ? val : zoomScale[ val ] } )
                }
            },
            scaleMax: {
                get: function () {
                    var s = this.$store.getters.configLayer( this.itemId ).scaleMax
                    if ( !s ) return 0
                    return zoomBracketForScale( s )[ 0 ]
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, scaleMax: !val ? val : zoomScale[ val ] } )
                }
            },
            metadataUrl: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).metadataUrl
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, metadataUrl: val } )
                }
            },
            layerDetailComponent: function () {
                return 'edit-item-details-layer-' + this.$store.getters.configLayer( this.itemId ).type
            },
            zoomScale: function () {
                return zoomScale.map( function ( scale, i ) {
                    return {
                        formatted: parseFloat( scale.toPrecision( 3 ) ).toLocaleString(),
                        scale: scale,
                        zoom: i
                    }
                } )
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )

function zoomBracketForScale ( scale ) {
    if ( scale > zoomScale[ 1 ] ) return [ 0, 1 ]
    if ( scale < zoomScale[ 19 ] ) return [ 19, 20 ]
    for ( var z = 2; z < 20; z += 1 )
        if ( scale > zoomScale[ z ] ) return [ z - 1, z ]
}
