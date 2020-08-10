import { vueComponent } from '../vue-util.js'

const itemType = {
    'folder': {
        title: 'Folder',
        colour: 'red',
        icon: 'folder_open',
    },
    'group': {
        title: 'Group',
        colour: 'orange',
        icon: 'folder',
    },
    'wms': {
        title: 'WMS Layer',
        colour: 'green',
        icon: 'backup',
    },
    'esri-dynamic': {
        title: 'ESRI Dynamic Layer',
        colour: 'blue',
        icon: 'layers',
    },
    'vector': {
        title: 'Vector Layer',
        colour: 'yellow darken-4',
        icon: 'insights', // 'edit',
    }
}

vueComponent( import.meta.url, {
    props: [ 'itemId' ],
    computed: {
        type: function () {
            var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
            if ( item.type && item.type != 'layer' ) return item.type
            return this.$store.getters.configLayer( this.itemId ).type
        },
        typeColour: function () { return itemType[ this.type ].colour },
        typeTitle: function () { return itemType[ this.type ].title },
        typeIcon: function () { return itemType[ this.type ].icon },
        title: function () {
            var item = this.$store.getters.configToolLayersDisplayItem( this.itemId )
            return item.title || this.$store.getters.configLayer( this.itemId ).title
        },
        metadataUrl: function () {
            return this.$store.getters.configHasLayer( this.itemId ) && this.$store.getters.configLayer( this.itemId ).metadataUrl
        },
    },
    methods: {
        edit: function () {},
        remove: function () {}
    }
} )

