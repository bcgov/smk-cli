import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            serviceUrl: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).serviceUrl
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, serviceUrl: val } )
                }
            },
            layerName: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).layerName
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, layerName: val } )
                }
            },
            styleName: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).styleName
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, styleName: val } )
                }
            }
        },
        mounted: function () {
        },
        updated: function () {
        }
    } )
} )
