import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-layer-details-wms.js',
    './components/edit-layer-details-esri-dynamic.js',
    './components/edit-layer-details-vector.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            title: {
                get: function () {
                    var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                    return item.title || this.$store.getters.configLayer( this.itemId ).title
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolLayersDisplayItem', { id: this.itemId, title: val } )
                }
            },
            isVisible: {
                get: function () {
                    var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                    return item.isVisible || this.$store.getters.configLayer( this.itemId ).isVisible
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
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                if ( item.type && item.type != 'layer' ) return 'edit-layer-details-' + item.type
                return 'edit-layer-details-' + this.$store.getters.configLayer( this.itemId ).type
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
