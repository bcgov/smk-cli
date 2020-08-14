import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/edit-layer-details-layer.js',
    './components/edit-layer-details-folder.js',
    // './components/edit-layer-details-group.js'
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
            layerDetailComponent: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                return 'edit-layer-details-' + ( item.type || 'layer' )
            }
        },
        mounted: function () {
            M.updateTextFields()
        },
        updated: function () {
        }
    } )
} )
