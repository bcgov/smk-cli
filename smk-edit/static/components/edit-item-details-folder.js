import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            isExpanded: {
                get: function () {
                    return this.$store.getters.configToolLayersDisplayItem( this.itemId ).isExpanded
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configToolLayersDisplayItem', { id: this.itemId, isExpanded: val } )
                }
            },
        },
    } )
} )
