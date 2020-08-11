import { vueComponent, importComponents } from '../vue-util.js'
import itemTypePresentation from './item-type-presentation.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/edit-layer-details.js'
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'showDialog' ],
        watch: {
            showDialog: function ( val ) {
                if ( val && this.itemId ) {
                    M.Modal.getInstance( this.$refs.layerEditDialog ).open()
                    M.Tabs.getInstance( this.$refs.tabs ).select( 'details' )
                }
                else {
                    M.Modal.getInstance( this.$refs.layerEditDialog ).close()
                }
            }
        },
        computed: {
            type: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                if ( item.type && item.type != 'layer' ) return item.type
                return this.$store.getters.configLayer( this.itemId ).type
            },
            typeTitle: function () { return itemTypePresentation[ this.type ].title }
        },
        methods: {
        },
        mounted: function () {
            var self = this

            M.Modal.init( this.$refs.layerEditDialog, {
                onCloseEnd: function () {
                    self.$emit( 'update:showDialog', false )
                }
            } )
            M.Tabs.init( this.$refs.tabs, {} )
        },
        updated: function () {
            var inst = M.Tabs.getInstance( this.$refs.tabs )
            setTimeout( function () {
                inst.updateTabIndicator()
            }, 500 )
        }
    } )
} )
