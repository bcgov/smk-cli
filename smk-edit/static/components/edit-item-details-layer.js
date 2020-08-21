import { vueComponent, importComponents } from '../vue-util.js'

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
                    return this.$store.getters.configLayer( this.itemId ).scaleMin
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, scaleMin: Math.max( parseInt( this.scaleMax || 0 ), parseInt( val ) ) } )
                }
            },
            scaleMax: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).scaleMax
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, scaleMax: Math.min( parseInt( this.scaleMin || 1e15 ), parseInt( val ) ) } )
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
            }
        },
        mounted: function () {
            M.updateTextFields()
            M.textareaAutoResize( this.$refs.metadataUrl )
        },
        updated: function () {
            M.textareaAutoResize( this.$refs.metadataUrl )
        }
    } )
} )
