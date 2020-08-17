import { vueComponent, importComponents } from '../vue-util.js'
import itemTypePresentation from './item-type-presentation.js'

export default importComponents( [
    './components/catalog-item.js',
    './components/edit-item-details.js',
    './components/edit-item-style.js',
    './components/edit-item-attributes.js',
    './components/dialog-box.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId', 'showDialog' ],
        computed: {
            type: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                if ( item.type && item.type != 'layer' ) return item.type
                return this.$store.getters.configLayer( this.itemId ).type
            },
            typeTitle: function () { return itemTypePresentation[ this.type ].title },
            hasStyle: function () { return itemTypePresentation[ this.type ].style },
            hasAttributes: function () { return itemTypePresentation[ this.type ].layer },
            hasQueries: function () { return itemTypePresentation[ this.type ].layer }
        },
        methods: {
            openDialog: function () {
                M.Tabs.init( this.$refs.tabs, {} )
                var inst = M.Tabs.getInstance( this.$refs.tabs )
                inst.select( 'details' )
                setTimeout( function () {
                    inst.updateTabIndicator()
                }, 500 )
            }
        },
    } )
} )
