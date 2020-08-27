import { vueComponent, importComponents } from '../vue-util.js'

export default importComponents( [
    './components/materialize.js',
] ).then( function () {
    return vueComponent( import.meta.url, {
        props: [ 'showDialog', 'icon' ],
        data: function () {
            return {
                icons: null
            }
        },
        methods: {
            selectIcon: function ( icon ) {
                this.$emit( 'select-icon', icon )
            }
        },
        mounted: function () {
            var self = this

            fetch( '/module/fonts/MaterialIcons-Regular.json' )
                .then( function ( resp ) {
                    return resp.json()
                } )
                .then( function ( data ) {
                    self.icons = Object.keys( data ).sort( function ( a, b ) {
                        return a > b ? 1 : -1
                    } )
                } )
        },
        updated: function () {
        }
    } )
} )
