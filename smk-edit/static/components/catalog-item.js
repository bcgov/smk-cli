import { vueComponent } from '../vue-util.js'
import itemTypePresentation from './item-type-presentation.js'

vueComponent( import.meta.url, {
    props: [ 'itemId', 'allowed', 'iconSize' ],
    computed: {
        type: function () {
            var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
            if ( item.type && item.type != 'layer' ) return item.type
            return this.$store.getters.configLayer( this.itemId ).type
        },
        typeColour: function () { return itemTypePresentation[ this.type ].colour },
        typeTitle: function () { return itemTypePresentation[ this.type ].title },
        typeIcon: function () { return itemTypePresentation[ this.type ].icon },
        title: function () {
            var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
            return item.title || this.$store.getters.configLayer( this.itemId ).title
        },
        metadataUrl: function () {
            return this.$store.getters.configHasLayer( this.itemId ) && this.$store.getters.configLayer( this.itemId ).metadataUrl
        },
        allowedEdit: function () { return !this.allowed || this.allowed.edit !== false },
        allowedRemove: function () { return !this.allowed || this.allowed.remove !== false },
        isVisible: {
            get: function () {
                var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
                if ( item.isVisible != null || itemTypePresentation[ this.type ].collection ) return item.isVisible
                return this.$store.getters.configLayer( this.itemId ).isVisible
            },
            set: function ( val ) {
                this.$store.dispatch( 'configToolLayersDisplayItem', { id: this.itemId, isVisible: val } )
            }
        },
    },
    methods: {
        edit: function () { this.$emit( 'edit-item', this.itemId ) },
        remove: function () { this.$emit( 'remove-item', this.itemId ) }
    },
    mounted: function () {
        M.Tooltip.init( this.$refs.visibility, {
            html: 'Initial visibility of this layer',
            position: 'top',
            enterDelay: 1000,
            inDuration: 500,
            outDuration: 100,
        } )
    }
} )

