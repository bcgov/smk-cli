import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/text-editor.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'itemId' ],
        computed: {
            popupTemplate: {
                get: function () {
                    return this.$store.getters.configLayer( this.itemId ).popupTemplate || ''
                },
                set: function ( val ) {
                    if ( val )
                        if ( !/^</.test( val.trim() ) )
                            val = `<div>${ val }</div>`

                    this.$store.dispatch( 'configLayer', { id: this.itemId, popupTemplate: val } )
                }
            }
        }
    } )
} )
