import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
    './components/text-editor.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            popupTemplate: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).popupTemplate || '<div>Identified Feature</div>'
                },
                set: function ( val ) {
                    this.$store.dispatch( 'configLayer', { id: this.itemId, popupTemplate: val } )
                }
            }
        }
    } )
} )
